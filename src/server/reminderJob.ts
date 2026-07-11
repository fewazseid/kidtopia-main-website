import { sendEmail } from './email.ts';
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
          } else {
            recipientEmails.push('admin@kidtopiaet.com');
          }
          
          if (recipientEmails.length > 0) {
            const subject = `Reminder: Pending Booking for ${b.name}`;
            const html = `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #fafaf9;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #3a5b32; margin: 0; font-size: 24px; font-weight: 800;">KIDTOPIA</h1>
                  <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px;">International Daycare & Preschool</p>
                </div>
                <h2 style="color: #1c1917; font-size: 18px; border-bottom: 1px solid #e7e5e4; padding-bottom: 12px; margin-top: 0;">Action Required: Pending Tour Booking</h2>
                <p style="color: #44403c; font-size: 14px; line-height: 1.6;">The following tour booking has been pending for over ${reminderHours} hours and requires review:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; color: #44403c; width: 120px; font-size: 14px;">Name:</td>
                    <td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${b.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; color: #44403c; font-size: 14px;">Campus Branch:</td>
                    <td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${b.branch || 'Main Branch'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; color: #44403c; font-size: 14px;">Requested Date:</td>
                    <td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${b.date}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; color: #44403c; font-size: 14px;">Requested Time:</td>
                    <td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${b.time}</td>
                  </tr>
                </table>
                <p style="color: #44403c; font-size: 14px; line-height: 1.6;">Please log in to the admin dashboard to approve or decline this request.</p>
                <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;" />
                <p style="font-size: 11px; color: #78716c; text-align: center; margin: 0;">This reminder request was automatically sent by the Kidtopia scheduler system.</p>
              </div>
            `;

            // Send to all configured admin/operations emails
            for (const email of recipientEmails) {
              await sendEmail(email, subject, html, config.operationsEmail).catch(err => console.error(`Failed to send reminder to ${email}`, err));
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
