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
            const { doc, getDoc } = await import('firebase/firestore');
            const { db } = await import('../firebase.ts');
            let adminReminderTemplate: any = null;
            try {
              const contentDoc = await getDoc(doc(db, 'content', 'en'));
              if (contentDoc.exists()) {
                adminReminderTemplate = contentDoc.data()?.emailTemplates?.adminReminder;
              }
            } catch (err) {
              console.error('Failed to load content doc for email template in reminder job:', err);
            }

            const dayName = b.date ? new Date(b.date).toLocaleDateString('en-US', { weekday: 'long' }) : '';
            const rawSubject = adminReminderTemplate?.subject || `Reminder: Pending Tour Booking for {name}`;
            const rawBody = adminReminderTemplate?.body || `Action Required: Pending Tour Booking\n\nThe following tour booking request has been pending for over {hours} hours and requires review in the admin dashboard.\n\nParent Name: {name}\nCampus Location: {branch}\nDate: {dayName}, {date}\nTime: {time}\n\nPlease log in to your admin panel to approve or reject this tour request.`;

            const replaceTags = (str: string) => {
              if (!str) return '';
              return str
                .replace(/\{name\}|\[Parent Name\]|\[Name\]/gi, b.name || '')
                .replace(/\{date\}|\[Date\]/gi, b.date || '')
                .replace(/\{time\}|\[Time\]/gi, b.time || '')
                .replace(/\{dayName\}|\[Day\]/gi, dayName)
                .replace(/\{branch\}|\[Branch\]/gi, b.branch || 'Main Branch')
                .replace(/\{email\}|\[Parent Email\]|\[Email\]/gi, b.email || '')
                .replace(/\{phone\}|\[Parent Phone\]|\[Phone\]/gi, b.phone || '')
                .replace(/\{hours\}|\[Hours\]/gi, String(reminderHours));
            };

            const subject = replaceTags(rawSubject);
            const bodyText = replaceTags(rawBody);

            const paragraphs = bodyText
              .split('\n')
              .map(p => p.trim())
              .filter(p => p !== '')
              .map(p => `<p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #44403c;">${p}</p>`)
              .join('');

            const html = `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e7e5e4; border-radius: 16px; background-color: #fafaf9;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #3a5b32; margin: 0; font-size: 24px; font-weight: 800; font-family: sans-serif;">KIDTOPIA</h1>
                  <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px;">International Daycare & Preschool</p>
                </div>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e7e5e4;">
                  ${paragraphs}
                </div>
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
