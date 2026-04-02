import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword as firebaseUpdatePassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, getDocFromServer, collection, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Secondary app for creating users without signing out the admin
const secondaryApp = initializeApp(firebaseConfig, 'SecondaryApp');
const secondaryAuth = getAuth(secondaryApp);

export const createUserWithoutLogin = async (email: string, pass: string, role: string) => {
  const result = await createUserWithEmailAndPassword(secondaryAuth, email, pass);
  await setDoc(doc(db, 'users', result.user.uid), {
    email,
    role,
    updatedAt: new Date().toISOString()
  });
  await signOut(secondaryAuth);
  return result.user;
};

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithEmail = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
export const registerWithEmail = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);
export const logout = () => signOut(auth);

export const getUserRole = async (uid: string) => {
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

export const getAdminConfig = async () => {
  const configDoc = await getDoc(doc(db, 'settings', 'admin_config'));
  if (configDoc.exists()) {
    return configDoc.data();
  }
  return {
    username: 'admin',
    password: '123456',
    email: 'admin@kidtopiadaycare.com',
    firebasePassword: 'admin123'
  };
};

export const updateAdminConfig = async (config: any) => {
  await setDoc(doc(db, 'settings', 'admin_config'), {
    ...config,
    updatedAt: new Date().toISOString()
  });
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
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}
testConnection();
