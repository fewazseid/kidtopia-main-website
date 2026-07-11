import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword as firebaseUpdatePassword } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, setLogLevel, doc, getDoc, setDoc, onSnapshot, getDocFromServer, collection, getDocs, updateDoc, deleteDoc, serverTimestamp, query, where, addDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Silence internal firebase logs to prevent polluting console or triggering false test failures
try {
  setLogLevel('silent');
} catch (e) {
  // Ignore log level configuration failures
}

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
}, firebaseConfig.firestoreDatabaseId);

export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Secondary app for creating users without signing out the admin
const secondaryApp = initializeApp(firebaseConfig, 'SecondaryApp');
const secondaryAuth = getAuth(secondaryApp);

export const createUserWithoutLogin = async (email: string, pass: string, role: string) => {
  let user;
  try {
    const result = await createUserWithEmailAndPassword(secondaryAuth, email, pass);
    user = result.user;
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      try {
        const signinResult = await signInWithEmailAndPassword(secondaryAuth, email, pass);
        user = signinResult.user;
      } catch (loginErr: any) {
        throw new Error('User exists in Database but password does not match. Please use correct password to restore, or delete from Firebase console.');
      }
    } else {
      throw err;
    }
  }

  await setDoc(doc(db, 'users', user.uid), {
    email,
    role,
    updatedAt: new Date().toISOString()
  });
  await signOut(secondaryAuth);
  return user;
};

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithEmail = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
export const registerWithEmail = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);
export const logout = () => signOut(auth);

export const getUserRole = async (uid: string) => {
  if (auth.currentUser?.email === 'admin@kidtopiaet.com' || 
      auth.currentUser?.email === 'fewazseidahmed@gmail.com' || 
      auth.currentUser?.email === 'system_worker@kidtopiaet.internal' || 
      auth.currentUser?.email === 'system_worker_v2@kidtopiaet.internal' || 
      auth.currentUser?.email === 'system_worker_v4@kidtopiaet.internal' || 
      auth.currentUser?.email?.endsWith('@kidtopiaet.internal')) {
    return 'admin';
  }
  
  try {
    const config = await getAdminConfig();
    if (auth.currentUser?.email === config.email) {
      return 'admin';
    }
  } catch (e) {
    // Ignore config fetch errors if not allowed
  }

  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data().role;
  }
  return null;
};

export const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  }));
};

export const updateUserRole = async (uid: string, role: string) => {
  await updateDoc(doc(db, 'users', uid), {
    role,
    updatedAt: new Date().toISOString()
  });
};

export const deleteUserDoc = async (uid: string) => {
  await deleteDoc(doc(db, 'users', uid));
};

export const setUserRole = async (uid: string, role: string, email: string) => {
  await setDoc(doc(db, 'users', uid), {
    role,
    email,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

export const saveFingerprintTemplate = async (template: string) => {
  await setDoc(doc(db, 'settings', 'admin_config'), {
    fingerprintTemplate: template,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

export interface AdminConfig {
  username?: string;
  password?: string;
  email?: string;
  firebasePassword?: string;
  adminEmails?: string[];
  operationsEmail?: string;
  reminderHours?: number;
  [key: string]: any;
}

export const getAdminConfig = async (): Promise<AdminConfig> => {
  const defaults: AdminConfig = {
    username: 'admin',
    password: '123456',
    email: 'system_worker_v4@kidtopiaet.internal',
    firebasePassword: 'internal_system_password_99X',
    adminEmails: [],
    operationsEmail: '',
    reminderHours: 2
  };
  const configDoc = await getDoc(doc(db, 'settings', 'admin_config'));
  if (configDoc.exists()) {
    const data = configDoc.data();
    return {
      ...defaults,
      ...data,
      // Force internal creds for firebase operations on server
      email: data.firebaseWorkerEmail || defaults.email,
      firebasePassword: data.firebaseWorkerPassword || defaults.firebasePassword,
    };
  }
  return defaults;
};

export const updateAdminConfig = async (config: any) => {
  await setDoc(doc(db, 'settings', 'admin_config'), {
    ...config,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

export const updateCurrentUserPassword = async (newPass: string) => {
  if (auth.currentUser) {
    await firebaseUpdatePassword(auth.currentUser, newPass);
  }
};

// Test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && (
      error.message.toLowerCase().includes('offline') || 
      error.message.toLowerCase().includes('could not reach') || 
      error.message.toLowerCase().includes('unavailable')
    )) {
      console.warn("Please check your Firebase configuration. The client is offline.");
    } else {
      console.error("Firebase connection error:", error);
    }
  }
}
testConnection();

const formatToAMPM = (time24: string) => {
  if (time24.includes('AM') || time24.includes('PM')) return time24;
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
};

// Bookings and Schedule
export const getTourSchedule = async () => {
  try {
    const docRef = doc(db, 'settings', 'tourSchedule');
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // Default slots
      const defaultSlots = [];
      let hour = 8;
      let minute = 30;
      while (hour < 18 || (hour === 18 && minute === 0)) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        defaultSlots.push({ time: formatToAMPM(timeStr), active: true });
        minute += 30;
        if (minute >= 60) {
          hour++;
          minute -= 60;
        }
      }
      return { slots: defaultSlots, daySchedules: {} };
    }
    
    const data = docSnap.data();
    if (data.slots) {
       data.slots = data.slots.map((s: any) => ({ ...s, time: formatToAMPM(s.time) }));
    }
    if (!data.daySchedules) {
       data.daySchedules = {};
    } else {
       for (const day in data.daySchedules) {
          data.daySchedules[day] = data.daySchedules[day].map((s: any) => ({ ...s, time: formatToAMPM(s.time) }));
       }
    }
    return data;
  } catch (err) {
    console.error("Failed to get tour schedule:", err);
    throw err;
  }
};

export const updateTourSchedule = async (schedule: any) => {
  try {
    const docRef = doc(db, 'settings', 'tourSchedule');
    await setDoc(docRef, schedule, { merge: true });
  } catch (err) {
    console.error("Failed to update tour schedule:", err);
    throw err;
  }
};

export const createBooking = async (bookingData: any) => {
  try {
    const id = doc(collection(db, 'bookings')).id;
    const docRef = doc(db, 'bookings', id);
    const detailsRef = doc(db, 'booking_details', id);

    // Public readable booking data (no PII)
    await setDoc(docRef, {
      id,
      date: bookingData.date,
      time: bookingData.time,
      status: 'pending',
      createdAt: serverTimestamp()
    });

    // Private booking details (Admin only)
    await setDoc(detailsRef, {
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone,
      bookingId: id
    });
    return id;
  } catch (err) {
    console.error("Failed to create booking:", err);
    throw err;
  }
};

export const getAllBookings = async () => {
  let bookings: any[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, 'bookings'));
    bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
  } catch (err: any) {
    console.error("Failed to get all bookings (bookings collection):", err);
    throw err;
  }

  // Pre-check authentication and roles before attempting to query private booking_details
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return bookings.map(b => ({
      ...b,
      name: b.name || "Guest Access Only",
      email: b.email || "Confidential",
      phone: b.phone || "Confidential"
    }));
  }

  const email = currentUser.email || '';
  const isAdminEmail = email === 'admin@kidtopiaet.com' ||
                       email === 'fewazseidahmed@gmail.com' ||
                       email === 'system_worker@kidtopiaet.internal' ||
                       email === 'system_worker_v2@kidtopiaet.internal' ||
                       email === 'system_worker_v4@kidtopiaet.internal' ||
                       email.endsWith('@kidtopiaet.internal');

  let hasPermission = isAdminEmail;

  if (!hasPermission) {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const role = userDoc.data()?.role;
        if (role === 'admin' || role === 'staff') {
          hasPermission = true;
        }
      }
    } catch (e) {
      // Ignore user doc fetch errors
    }
  }

  if (!hasPermission) {
    return bookings.map(b => ({
      ...b,
      name: b.name || "Guest Access Only",
      email: b.email || "Confidential",
      phone: b.phone || "Confidential"
    }));
  }

  try {
    // Fetch details for each booking
    const detailsSnapshot = await getDocs(collection(db, 'booking_details'));
    const detailsMap = new Map();
    detailsSnapshot.docs.forEach(doc => detailsMap.set(doc.id, doc.data()));

    return bookings.map(b => ({
      ...b,
      ...detailsMap.get(b.id)
    }));
  } catch (err: any) {
    console.warn("Failed to get booking details (graceful degradation):", err);
    // Return bookings list even without details if permission is denied or details can't be fetched
    return bookings.map(b => ({
      ...b,
      name: b.name || "Guest Access Only",
      email: b.email || "Confidential",
      phone: b.phone || "Confidential"
    }));
  }
};

export const getBookingsByDate = async (date: string) => {
  try {
    const q = query(collection(db, 'bookings'), where('date', '==', date), where('status', 'in', ['pending', 'approved']));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
  } catch (err) {
    console.error("Failed to get bookings for date:", err);
    throw err;
  }
};

export const getBooking = async (id: string) => {
  try {
    const docRef = doc(db, 'bookings', id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as any : null;
  } catch (err) {
    console.error("Failed to get booking:", err);
    throw err;
  }
};

export const updateBookingTime = async (id: string, date: string, time: string) => {
  try {
    const docRef = doc(db, 'bookings', id);
    await setDoc(docRef, { date, time }, { merge: true });
  } catch (err) {
    console.error("Failed to update booking time:", err);
    throw err;
  }
};

export const updateBookingStatus = async (id: string, status: string) => {
    try {
      const docRef = doc(db, 'bookings', id);
      await setDoc(docRef, { status }, { merge: true });
    } catch (err) {
      console.error("Failed to update booking status:", err);
      throw err;
    }
  };

export const updateBookingReminderStatus = async (id: string, reminderSent: boolean) => {
  try {
    const docRef = doc(db, 'bookings', id);
    await setDoc(docRef, { reminderSent }, { merge: true });
  } catch (err) {
    console.error("Failed to update reminder status:", err);
    throw err;
  }
};

export const sendEmail = async (to: string, subject: string, html: string, replyTo?: string) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        replyTo,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }
    
    console.log("Email sent successfully via Node Mailer!");
  } catch (err) {
    console.error("Failed to send email:", err);
    throw err;
  }
};
