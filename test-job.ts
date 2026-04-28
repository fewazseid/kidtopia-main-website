import { getAdminConfig, getAllBookings } from './src/firebase.ts';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './src/firebase.ts';

async function run() {
  console.log("Fetching config...");
  const config = await getAdminConfig();
  console.log("Config email:", config.email);
  try {
    const cred = await signInWithEmailAndPassword(auth, config.email, config.firebasePassword);
    console.log("Logged in as", cred.user.uid);
  } catch (err: any) {
    console.error("Login failed:", err.code);
  }

  console.log("Fetching all bookings...");
  const bookings = await getAllBookings();
  console.log("Bookings:", bookings.length);
  process.exit(0);
}
run();
