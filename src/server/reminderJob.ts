import nodemailer from 'nodemailer';
import { getAllBookings, getAdminConfig, updateBookingReminderStatus, auth } from '../firebase.ts';
import { signInWithEmailAndPassword } from 'firebase/auth';

export function startReminderJob() {
  const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

  setInterval(async () => {
    try {
      // Authenticate as admin before querying private collections
      const config = await getAdminConfig();
      const reminderHours = config.reminderHours || 2;
      const REMINDER_THRESHOLD = reminderHours * 60 * 60 * 1000;
      if (config.email && config.firebasePassword) {
        if (!auth.currentUser || auth.currentUser.email !== config.email) {
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
               } catch (createErr: any) {
                 if (createErr.code === 'auth/email-already-in-use') {
                   console.log('Admin user already exists');
                 } else {
                   console.error('Failed to create admin user for reminder job', createErr);
                   return;
                 }
               }
             } else {
               console.error('Failed to authenticate reminder job as admin:', authErr);
               return;
             }
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
          const recipientEmails: string[] = [];
          if (config.operationsEmail) {
            recipientEmails.push(config.operationsEmail);
          } else if (config.adminEmails && config.adminEmails.length > 0) {
            recipientEmails.push(...config.adminEmails);
          } else {
            recipientEmails.push('admin@kidtopiaet.com');
          }
          
          if (recipientEmails.length > 0) {
            const subject = `Reminder: Pending Booking for ${b.name}`;
            const html = `
              <h3>Action Required: Pending Tour Booking</h3>
              <p>The following tour booking has been pending for over ${reminderHours} hours and requires review:</p>
              <ul>
                <li><strong>Name:</strong> ${b.name}</li>
                <li><strong>Requested Date:</strong> ${b.date}</li>
                <li><strong>Requested Time:</strong> ${b.time}</li>
              </ul>
              <p>Please log in to the admin dashboard to process this booking.</p>
            `;

            // Send to all configured admin/operations emails
            for (const email of recipientEmails) {
              await transporter.sendMail({
                from: `"Kidtopia Daycare" <${GMAIL_USER}>`,
                replyTo: config.operationsEmail || GMAIL_USER,
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
