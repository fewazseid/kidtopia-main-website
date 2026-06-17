import { getAdminConfig, getAllBookings } from './src/firebase.ts';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './src/firebase.ts';

async function run() {
  console.log("Fetching config...");
  const config = await getAdminConfig();
  console.log("Config email:", config.email);
  let loggedIn = false;
  try {
    const cred = await signInWithEmailAndPassword(auth, config.email, config.firebasePassword);
    console.log("Logged in as", cred.user.uid);
    loggedIn = true;
  } catch (err: any) {
    console.error("Login failed:", err.code);
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
      console.log("Attempting to register new user...");
      try {
        const cred = await createUserWithEmailAndPassword(auth, config.email, config.firebasePassword);
        console.log("Registered successfully! uid:", cred.user.uid);
        loggedIn = true;
        
        console.log("Attempting to write user collection document...");
        await setDoc(doc(db, 'users', cred.user.uid), {
          email: config.email,
          role: 'admin',
          updatedAt: new Date().toISOString()
        });
        console.log("User document written successfully!");
      } catch (err2: any) {
        console.error("Registration/Writing failed:", err2);
      }
    }
  }

  if (loggedIn && auth.currentUser) {
    console.log("Decoding user ID token claims...");
    try {
      const token = await auth.currentUser.getIdToken(true);
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        console.log("Token claims payload:", JSON.stringify(payload, null, 2));
      }
    } catch (tokenErr: any) {
      console.error("Failed to get token:", tokenErr);
    }

    console.log("Attempting to read public settings/tourSchedule document...");
    try {
      const snap = await getDoc(doc(db, 'settings', 'tourSchedule'));
      console.log("Read public document successful! Exists:", snap.exists(), snap.data());
    } catch (readErr: any) {
      console.error("Failed to read public doc settings/tourSchedule:", readErr);
    }

    console.log("Checking if users collection document exists for user:", auth.currentUser.uid);
    try {
      const uSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
      console.log("User document exists?", uSnap.exists(), uSnap.data());
    } catch (uErr: any) {
      console.error("Failed to read users doc:", uErr);
    }

    console.log("Attempting to write a test document under bookings collection...");
    try {
      const bDocRef = doc(db, 'bookings', 'static_test_doc');
      await setDoc(bDocRef, {
        childName: "Test Child Static",
        status: "pending",
        createdAt: new Date().toISOString()
      });
      console.log("Bookings test document written successfully!");
      
      console.log("Verifying static bookings document write via live read...");
      const bSnap = await getDoc(bDocRef);
      console.log("Bookings static doc read result:", bSnap.exists(), bSnap.data());
    } catch (bWriteErr: any) {
      console.error("Failed to write/read bookings collection:", bWriteErr);
    }

    console.log("Attempting to write/verify user collection document...");
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        email: config.email,
        role: 'worker',
        updatedAt: new Date().toISOString()
      });
      console.log("User document written successfully!");
    } catch (docErr: any) {
      console.error("Failed to write users doc:", docErr);
    }

    console.log("Fetching all bookings...");
    try {
      const bookings = await getAllBookings();
      console.log("Bookings:", bookings.length);
    } catch (err3: any) {
      console.error("Fetch failed:", err3);
    }
  }
  process.exit(0);
}
run();
