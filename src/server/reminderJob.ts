import nodemailer from 'nodemailer';
import { getAllBookings, getAdminConfig, updateBookingReminderStatus, auth } from '../firebase.ts';
import { signInWithEmailAndPassword } from 'firebase/auth';

export function startReminderJob() {
  const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
  const REMINDER_THRESHOLD = 2 * 60 * 60 * 1000; // 2 hours

  setInterval(async () => {
    try {
      // Authenticate as admin before querying private collections
      const config = await getAdminConfig();
      if (config.email && config.firebasePassword) {
        try {
           await signInWithEmailAndPassword(auth, config.email, config.firebasePassword);
         } catch (authErr: any) {
           if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
             try {
               const { createUserWithEmailAndPassword } = await import('firebase/auth');
               const result = await createUserWithEmailAndPassword(auth, config.email, config.firebasePassword);
               const { doc, setDoc } = await import('firebase/firestore');
               await setDoc(doc(auth.app ? (await import('firebase/firestore')).getFirestore(auth.app) : (await import('../firebase.ts')).db, 'users', result.user.uid), {
                  email: config.email,
                  role: 'admin',
                  updatedAt: new Date().toISOString()
               });
             } catch (createErr) {
               console.error('Failed to create admin user for reminder job', createErr);
               return;
             }
           } else {
             console.error('Failed to authenticate reminder job as admin:', authErr);
             return;
           }
         }
      }

      const bookings = await getAllBookings();
      const pendingBookings = bookings.filter((b: any) => b.status === 'pending' && !b.reminderSent);
      
      const now = Date.now();
      const GMAIL_USER = process.env.GMAIL_USER;
      const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

      if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        return; // Email not configured
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD
        }
      });

      for (const b of pendingBookings) {
        let createdAtMs = 0;
        if (b.createdAt && typeof b.createdAt.toMillis === 'function') {
          createdAtMs = b.createdAt.toMillis();
        } else if (b.createdAt && b.createdAt._seconds) {
          createdAtMs = b.createdAt._seconds * 1000;
        } else if (b.createdAt) {
          createdAtMs = new Date(b.createdAt).getTime();
        }

        if (createdAtMs > 0 && (now - createdAtMs > REMINDER_THRESHOLD)) {
          const config = await getAdminConfig();
          const adminEmails = config.adminEmails || [];
          
          if (adminEmails.length > 0) {
            const subject = `Reminder: Pending Booking for ${b.name}`;
            const html = `
              <h3>Action Required: Pending Tour Booking</h3>
              <p>The following tour booking has been pending for over 2 hours and requires review:</p>
              <ul>
                <li><strong>Name:</strong> ${b.name}</li>
                <li><strong>Requested Date:</strong> ${b.date}</li>
                <li><strong>Requested Time:</strong> ${b.time}</li>
              </ul>
              <p>Please log in to the admin dashboard to process this booking.</p>
            `;

            // Send to all configured admin emails
            for (const email of adminEmails) {
              await transporter.sendMail({
                from: `"Kidtopia Daycare" <${GMAIL_USER}>`,
                to: email,
                subject,
                html
              }).catch(err => console.error(`Failed to send reminder to ${email}`, err));
            }
          }
          
          // Mark as sent so we don't spam
          await updateBookingReminderStatus(b.id, true);
        }
      }
    } catch (err) {
      console.error('Error running reminder job:', err);
    }
  }, CHECK_INTERVAL);
}
