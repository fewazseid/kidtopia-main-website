import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBooking, getTourSchedule, updateBookingTime, cancelBooking, sendEmail, getAdminConfig } from '../firebase';
import { Calendar, Clock, CheckCircle, ArrowLeft, MapPin } from 'lucide-react';

import { Language } from '../translations';
import { useContent } from '../ContentContext';

interface RescheduleTourPageProps {
  lang: Language;
  setLang?: (lang: Language) => void;
}

export const RescheduleTourPage: React.FC<RescheduleTourPageProps> = ({ lang, setLang }) => {
  const content = useContent(lang);
  const t = content.reschedule;
  const footerT = content.footer;
  const branches = footerT.addresses || [];
  
  const { id } = useParams<{ id: string }>();

  const [booking, setBooking] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [bookData, schedData] = await Promise.all([
          getBooking(id),
          getTourSchedule()
        ]);
        
        if (!bookData) {
          setError(t.notFound);
          return;
        }

        if (bookData.status !== 'pending') {
          setError(t.alreadyProcessed);
          return;
        }

        // Synchronize interface language with email booking language
        if (bookData.lang && setLang) {
          setLang(bookData.lang as Language);
        }

        setBooking(bookData);
        setSchedule(schedData);
        setSelectedDate(bookData.date);
        setSelectedTime(bookData.time);
        setSelectedBranch(bookData.branch || '');
      } catch (err) {
        console.error(err);
        setError(t.failedToLoad);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const replacePlaceholders = (template: string, data: any) => {
    if (!template) return '';
    const dayName = data.date ? new Date(data.date).toLocaleDateString('en-US', { weekday: 'long' }) : '';
    return template
      .replace(/\{name\}|\[Parent Name\]|\[Name\]/gi, data.name || '')
      .replace(/\{date\}|\[Date\]/gi, data.date || '')
      .replace(/\{time\}|\[Time\]/gi, data.time || '')
      .replace(/\{dayName\}|\[Day\]/gi, dayName)
      .replace(/\{branch\}|\[Branch\]/gi, data.branch || '')
      .replace(/\{email\}|\[Parent Email\]|\[Email\]/gi, data.email || '')
      .replace(/\{phone\}|\[Parent Phone\]|\[Phone\]/gi, data.phone || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !selectedDate || !selectedTime) return;

    setLoading(true);
    try {
      await updateBookingTime(id, selectedDate, selectedTime, selectedBranch);
      setSuccess(true);

      // Send Reschedule Emails
      if (booking?.email) {
        const isAmharic = lang === 'am';
        const parentRescheduleSubject = content.emailTemplates?.reschedule?.subject || (isAmharic ? 'የጉብኝት ቀጠሮ ተቀይሯል' : 'Tour Booking Rescheduled');
        const parentRescheduleBody = content.emailTemplates?.reschedule?.body || (isAmharic
          ? 'የጉብኝት ቀጠሮዎ በተሳካ ሁኔታ ተቀይሯል\n\nውድ {name}፣\n\nየአካል ጉብኝት ቀጠሮዎ ተዘምኗል።\n\nየካምፓስ አድራሻ: {branch}\nአዲስ ቀን: {dayName}, {date}\nአዲስ ሰዓት: {time}'
          : 'Tour Rescheduled Successfully\n\nDear {name},\n\nYour physical tour booking has been updated.\n\nCampus Location: {branch}\nNew Date: {dayName}, {date}\nNew Time: {time}');

        const bData = {
          ...booking,
          date: selectedDate,
          time: selectedTime,
          branch: selectedBranch || booking.branch
        };

        const parentSubject = replacePlaceholders(parentRescheduleSubject, bData);
        const parentBody = replacePlaceholders(parentRescheduleBody, bData);

        const parentParagraphs = parentBody
          .split('\n')
          .map(p => p.trim())
          .filter(p => p !== '')
          .map(p => `<p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #44403c;">${p}</p>`)
          .join('');

        const parentEmailHtml = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; background-color: #fafaf9; border-radius: 16px; border: 1px solid #e7e5e4; max-width: 600px; margin: 0 auto; text-align: left;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 14px; font-weight: bold; color: #10b981; text-transform: uppercase; letter-spacing: 1px;">Kidtopia Campus Tour</span>
              <h2 style="color: #10b981; margin: 8px 0 0 0; font-family: sans-serif; font-weight: 800;">${parentSubject}</h2>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e7e5e4;">
              ${parentParagraphs}
            </div>
          </div>
        `;

        sendEmail(booking.email, parentSubject, parentEmailHtml).catch(console.error);

        // Admin Alert
        getAdminConfig().then((config) => {
          const opsEmail = config.operationsEmail;
          if (opsEmail) {
            const adminSubjectTemplate = content.emailTemplates?.adminRescheduleAlert?.subject || 'Alert: Tour Booking Rescheduled by Parent';
            const adminBodyTemplate = content.emailTemplates?.adminRescheduleAlert?.body || 'Tour Rescheduled Alert\n\nA parent has updated their physical tour booking schedule.\n\nParent Name: {name}\nParent Email: {email}\nParent Phone: {phone}\nCampus Location: {branch}\nUpdated Date: {dayName}, {date}\nUpdated Time: {time}';

            const adminSubject = replacePlaceholders(adminSubjectTemplate, bData);
            const adminBody = replacePlaceholders(adminBodyTemplate, bData);

            const adminParagraphs = adminBody
              .split('\n')
              .map(p => p.trim())
              .filter(p => p !== '')
              .map(p => `<p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #44403c;">${p}</p>`)
              .join('');

            const adminEmailHtml = `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; background-color: #fafaf9; border-radius: 16px; border: 1px solid #e7e5e4; max-width: 600px; margin: 0 auto; text-align: left;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <span style="font-size: 14px; font-weight: bold; color: #f59e0b; text-transform: uppercase;">Admin Alert</span>
                  <h2 style="color: #f59e0b; margin: 8px 0 0 0; font-family: sans-serif; font-weight: 800;">${adminSubject}</h2>
                </div>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e7e5e4;">
                  ${adminParagraphs}
                </div>
              </div>
            `;
            sendEmail(opsEmail, adminSubject, adminEmailHtml).catch(console.error);
          }
        }).catch(console.error);
      }
    } catch (err) {
      console.error(err);
      setError(t.failedToUpdate);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!id) return;
    const confirmMsg = lang === 'en' 
      ? "Are you sure you want to cancel this tour booking request?" 
      : "ይህን የጉብኝት ቀጠሮ ጥያቄ በእርግጠኝነት መሰረዝ ይፈልጋሉ?";
    
    if (!window.confirm(confirmMsg)) return;

    setCancelling(true);
    try {
      await cancelBooking(id);
      setIsCancelled(true);

      // Send Cancellation Emails
      if (booking?.email) {
        const isAmharic = lang === 'am';
        const parentCancelSubject = content.emailTemplates?.cancellation?.subject || (isAmharic ? 'የጉብኝት ቀጠሮ ተሰርዟል' : 'Tour Booking Cancelled');
        const parentCancelBody = content.emailTemplates?.cancellation?.body || (isAmharic
          ? 'የጉብኝት ቀጠሮ መሬዝ\n\nውድ {name}፣\n\nበ{date} በ{time} የነበረዎት የአካል ጉብኝት ጥያቄ በጠየቁት መሠረት ተሰርዟል።'
          : 'Tour Booking Cancelled\n\nDear {name},\n\nYour physical tour request for {date} at {time} has been cancelled as requested.');

        const parentSubject = replacePlaceholders(parentCancelSubject, booking);
        const parentBody = replacePlaceholders(parentCancelBody, booking);

        const parentParagraphs = parentBody
          .split('\n')
          .map(p => p.trim())
          .filter(p => p !== '')
          .map(p => `<p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #44403c;">${p}</p>`)
          .join('');

        const parentEmailHtml = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; background-color: #fafaf9; border-radius: 16px; border: 1px solid #e7e5e4; max-width: 600px; margin: 0 auto; text-align: left;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 14px; font-weight: bold; color: #ef4444; text-transform: uppercase;">Kidtopia Tour Update</span>
              <h2 style="color: #ef4444; margin: 8px 0 0 0; font-family: sans-serif; font-weight: 800;">${parentSubject}</h2>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e7e5e4;">
              ${parentParagraphs}
            </div>
          </div>
        `;

        sendEmail(booking.email, parentSubject, parentEmailHtml).catch(console.error);

        // Admin Alert
        getAdminConfig().then((config) => {
          const opsEmail = config.operationsEmail;
          if (opsEmail) {
            const adminSubjectTemplate = content.emailTemplates?.adminCancellationAlert?.subject || 'Alert: Tour Booking Cancelled by Parent';
            const adminBodyTemplate = content.emailTemplates?.adminCancellationAlert?.body || 'Tour Cancellation Alert\n\nA tour booking request has been cancelled by the parent.\n\nParent Name: {name}\nParent Email: {email}\nCampus Location: {branch}\nOriginal Date: {dayName}, {date}\nOriginal Time: {time}';

            const adminSubject = replacePlaceholders(adminSubjectTemplate, booking);
            const adminBody = replacePlaceholders(adminBodyTemplate, booking);

            const adminParagraphs = adminBody
              .split('\n')
              .map(p => p.trim())
              .filter(p => p !== '')
              .map(p => `<p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #44403c;">${p}</p>`)
              .join('');

            const adminEmailHtml = `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; background-color: #fafaf9; border-radius: 16px; border: 1px solid #e7e5e4; max-width: 600px; margin: 0 auto; text-align: left;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <span style="font-size: 14px; font-weight: bold; color: #ef4444; text-transform: uppercase;">Admin Alert</span>
                  <h2 style="color: #ef4444; margin: 8px 0 0 0; font-family: sans-serif; font-weight: 800;">${adminSubject}</h2>
                </div>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e7e5e4;">
                  ${adminParagraphs}
                </div>
              </div>
            `;
            sendEmail(opsEmail, adminSubject, adminEmailHtml).catch(console.error);
          }
        }).catch(console.error);
      }
    } catch (err) {
      console.error(err);
      setError(lang === 'en' ? "Failed to cancel booking." : "ቀጠሮውን መሰረዝ አልተቻለም።");
    } finally {
      setCancelling(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const availableSlots = schedule?.slots?.filter((slot: any) => slot.active) || [];

  if (loading && !booking && !error) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-20 pb-12 flex flex-col items-center">
      <div className="max-w-2xl w-full px-4 mt-8">
        <Link to="/" className="inline-flex items-center text-brand-green font-medium hover:underline mb-6">
          <ArrowLeft size={20} className="mr-2" /> {t.backToHome}
        </Link>

        <div className="card-rounded p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-4">{t.title}</h1>
          </div>

          {error ? (
            <div className="text-center py-8 text-red-600 bg-red-50 rounded-2xl p-6">
              <p className="font-medium text-lg">{error}</p>
            </div>
          ) : isCancelled ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {lang === 'en' ? 'Tour Booking Cancelled' : 'የጉብኝት ቀጠሮው ተሰርዟል'}
              </h2>
              <p className="text-stone-600 text-lg">
                {lang === 'en' 
                  ? 'Your tour request has been successfully cancelled. You can book a new tour anytime.' 
                  : 'የጉብኝት ጥያቄዎ በተሳካ ሁኔታ ተሰርዟል። በማንኛውም ጊዜ አዲስ ጉብኝት ማስያዝ ይችላሉ።'}
              </p>
            </div>
          ) : success ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">{t.success}</h2>
              <p className="text-stone-600 text-lg">
                {t.successDesc.replace('{date}', selectedDate).replace('{time}', selectedTime)}
                {selectedBranch && ` (${selectedBranch})`}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-stone-50 p-6 rounded-2xl mb-6">
                <h3 className="font-bold text-stone-700 mb-2">{t.currentRequest}</h3>
                {booking?.branch && (
                  <p className="text-stone-900 mb-1"><strong>{lang === 'en' ? 'Campus:' : 'ካምፓስ፡'}</strong> {booking.branch}</p>
                )}
                <p className="text-stone-900 mb-1"><strong>{t.date}</strong> {booking?.date}</p>
                <p className="text-stone-900"><strong>{t.time}</strong> {booking?.time}</p>
              </div>

              {/* Campus / Branch Selection */}
              {branches.length > 0 && (
                <div className="space-y-4">
                  <label className="flex items-center text-stone-900 font-bold mb-2">
                    <MapPin className="mr-2 text-brand-green" size={20} /> {lang === 'en' ? 'Select Campus / Branch' : 'ካምፓስ / ቅርንጫፍ ይምረጡ'}
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl outline-none focus:border-brand-green text-stone-800 bg-white"
                  >
                    {branches.map((b: any, index: number) => {
                      const name = typeof b === 'string' ? b : b.locationName;
                      return (
                        <option key={index} value={name}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {/* Date Selection */}
              <div className="space-y-4">
                <label className="flex items-center text-stone-900 font-bold mb-2">
                  <Calendar className="mr-2 text-brand-green" size={20} /> {t.selectNewDate}
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl outline-none focus:border-brand-green text-stone-800"
                />
              </div>

              {/* Time Selection */}
              <div className="space-y-4">
                <label className="flex items-center text-stone-900 font-bold mb-2">
                  <Clock className="mr-2 text-brand-green" size={20} /> {t.selectNewTime}
                </label>
                {selectedDate ? (
                  availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot: any) => (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-3 px-2 rounded-lg text-sm font-medium transition-colors border-2 ${
                            selectedTime === slot.time 
                              ? 'border-brand-green bg-brand-green/10 text-brand-green' 
                              : 'border-stone-200 text-stone-600 hover:border-brand-green'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-3 text-amber-600 font-medium">{t.noSlots}</div>
                  )
                ) : (
                  <div className="py-3 text-stone-400">{t.pleaseSelectDate}</div>
                )}
              </div>

              <div className="pt-6 border-t border-stone-100 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading || !selectedDate || !selectedTime}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-50"
                >
                  {loading ? t.updating : t.updateButton}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading || cancelling}
                  className="w-full py-4 text-lg font-bold border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                >
                  {cancelling ? (lang === 'en' ? "Cancelling..." : "በመሰረዝ ላይ...") : (lang === 'en' ? "Cancel Tour Booking Request" : "የጉብኝት ቀጠሮ ጥያቄውን ይሰርዙ")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
