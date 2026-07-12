import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getTourSchedule, getBookingsByDate, createBooking, sendEmail, getAdminConfig } from '../firebase';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, ArrowLeft, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language } from '../translations';
import { useContent } from '../ContentContext';

interface BookTourPageProps {
  lang: Language;
}

export const BookTourPage: React.FC<BookTourPageProps> = ({ lang }) => {
  const content = useContent(lang);
  const t = content.leadCapture;
  const footerT = content.footer;
  const branches = footerT.addresses || [];
  
  const [schedule, setSchedule] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedBranchIdx, setSelectedBranchIdx] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const sched = await getTourSchedule();
        setSchedule(sched);
      } catch (err) {
        console.error("Error loading schedule", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (selectedDate && schedule) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
          const [y, m, d] = selectedDate.split('-').map(Number);
          const dateObj = new Date(y, m - 1, d);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }); // e.g. "Monday"

          let daySlots = schedule.slots || [];
          if (schedule.daySchedules && schedule.daySchedules[dayName]) {
             daySlots = schedule.daySchedules[dayName];
          }

          // Display all active slots in the schedule
          const available = daySlots.filter((slot: any) => slot.active);
          setAvailableSlots(available);
          setSelectedTime(''); // reset selection
        } catch (err) {
          console.error("Error fetching available slots", err);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [selectedDate, schedule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !formData.name || !formData.email || !formData.phone) return;
    
    setSubmitting(true);
    try {
      const branchObj = branches[selectedBranchIdx];
      let selectedBranchName = 'Kidtopia International Daycare and Preschool, Addis Ababa, Ethiopia';

      if (branchObj) {
        selectedBranchName = typeof branchObj === 'string' ? branchObj : branchObj.locationName;
      } else if (branches.length > 0) {
        const firstBranch = branches[0];
        selectedBranchName = typeof firstBranch === 'string' ? firstBranch : firstBranch.locationName;
      }
      
      const mapQuery = selectedBranchName;

      const bookingId = await createBooking({
        ...formData,
        date: selectedDate,
        time: selectedTime,
        branch: selectedBranchName,
      });

      // Send confirmation emails (to parent and admin notification)
      try {
        const [y, m, d] = selectedDate.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

        const rescheduleLink = `${window.location.origin}/reschedule/${bookingId}`;
        
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

        const parentEmailHtml = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; background-color: #fafaf9; border-radius: 16px; border: 1px solid #e7e5e4; max-width: 600px; margin: 0 auto; text-align: left;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 16px; font-weight: bold; color: #10b981; text-transform: uppercase; letter-spacing: 1px;">Kidtopia Campus</span>
              <h2 style="color: #10b981; margin: 10px 0 0 0; font-family: sans-serif; font-weight: 800;">Kidtopia Tour Received</h2>
            </div>
            <p style="font-size: 15px; color: #44403c; line-height: 1.6;">Dear ${formData.name},</p>
            <p style="font-size: 15px; color: #44403c; line-height: 1.6;">Thank you for booking a physical tour at <strong>Kidtopia International Daycare and Preschool</strong>! We are excited to show you our campus.</p>
            <p style="font-size: 15px; color: #44403c; line-height: 1.6;">Here are your request details:</p>
            
            <div style="background-color: #f5f5f4; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #10b981; font-size: 14px; color: #44403c; line-height: 1.6;">
              <p style="margin: 0 0 8px 0;"><strong>Campus Location:</strong> ${selectedBranchName}</p>
              <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${dayName}, ${selectedDate}</p>
              <p style="margin: 0 0 16px 0;"><strong>Time:</strong> ${selectedTime}</p>
 
              <!-- Map Directions Card -->
              <div style="margin-top: 16px; border: 1px solid #e7e5e4; border-radius: 10px; background: white; padding: 16px; text-align: center;">
                <p style="font-size: 13px; font-weight: bold; color: #1c1917; margin: 0 0 6px 0; text-align: left;">Interactive Campus Map</p>
                <p style="font-size: 12px; color: #78716c; margin: 0 0 14px 0; text-align: left; line-height: 1.4;">
                   Need directions to this campus? You can open driving directions, check walking distances, or view public transit routes on Google Maps.
                </p>
                <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background-color: #ea580c; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; box-shadow: 0 2px 4px rgba(234,88,12,0.15);">Open in Google Maps</a>
              </div>
            </div>
            
            <p style="font-size: 15px; color: #44403c; line-height: 1.6;">Our admissions team will review your request shortly and send you an email once your tour is confirmed.</p>
            <p style="font-size: 15px; color: #44403c; line-height: 1.6;">If you need to change your requested time before it is finalized, click the button below:</p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${rescheduleLink}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; shadow: 0 4px 6px rgba(0,0,0,0.05);">Reschedule Your Tour</a>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #e7e5e4; margin: 24px 0;" />
            <p style="font-size: 12px; color: #78716c; line-height: 1.5; margin: 0;">Kidtopia International Daycare and Preschool<br/>Providing top-tier bilingual early childhood education.</p>
          </div>
        `;
 
        // Send confirmation to the parent
        sendEmail(formData.email, 'Kidtopia Tour Booking Request Received', parentEmailHtml).catch(console.error);
 
        // Fetch central operations email to send admin notification
        getAdminConfig().then((config) => {
          const opsEmail = config.operationsEmail;
          if (opsEmail) {
            const adminEmailHtml = `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; background-color: #fafaf9; border-radius: 16px; border: 1px solid #e7e5e4; max-width: 600px; margin: 0 auto; text-align: left;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <span style="font-size: 14px; font-weight: bold; color: #f59e0b; text-transform: uppercase;">Notification Alert</span>
                  <h2 style="color: #f59e0b; margin: 10px 0 0 0; font-family: sans-serif; font-weight: 800;">New Pending Tour Booking</h2>
                </div>
                <p style="font-size: 15px; color: #44403c; line-height: 1.6;">A new physical tour booking request has been submitted and is pending review in the admin dashboard.</p>
                
                <div style="background-color: #f5f5f4; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b; font-size: 14px; color: #44403c; line-height: 1.6;">
                  <p style="margin: 0 0 8px 0;"><strong>Parent Name:</strong> ${formData.name}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Parent Email:</strong> ${formData.email}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Parent Phone:</strong> ${formData.phone}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Campus Location:</strong> ${selectedBranchName}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${dayName}, ${selectedDate}</p>
                  <p style="margin: 0;"><strong>Time:</strong> ${selectedTime}</p>
                </div>
                
                <p style="font-size: 15px; color: #44403c; line-height: 1.6;">Please log in to your admin panel to approve or reject this tour request.</p>
                
                <div style="text-align: center; margin: 24px 0;">
                  <a href="${window.location.origin}/admin" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px;">Go to Admin Dashboard</a>
                </div>
              </div>
            `;
            sendEmail(opsEmail, 'Alert: New Pending Tour Booking Request', adminEmailHtml).catch(console.error);
          }
        }).catch(console.error);

      } catch (err) {
        console.error("Failed to construct/send emails:", err);
      }

      setSuccess(true);
    } catch (err) {
      console.error("Error creating booking", err);
      alert('Failed to book tour. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-transparent pt-20 pb-12 flex flex-col items-center">
      <div className="max-w-3xl w-full px-4 mt-8">
          <Link to="/" className="inline-flex items-center text-brand-green font-medium hover:underline mb-6">
            <ArrowLeft size={20} className="mr-2" /> {lang === 'en' ? 'Back to Home' : 'ወደ መነሻ ይመለሱ'}
          </Link>
          
          <div className="card-rounded p-8 md:p-12">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">{t.book || "Book a Tour"}</h1>
              <p className="text-stone-600 text-lg">{lang === 'en' ? 'Schedule a visit to Kidtopia and see our wonderful environment.' : 'ለጉብኝት ቀጠሮ ይያዙ'}</p>
            </div>
          
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
              </div>
            ) : success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-left max-w-2xl mx-auto py-6 space-y-6"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">{lang === 'en' ? 'Tour Booked Successfully!' : 'ጉብኝቱ በተሳካ ሁኔታ ተይዟል!'}</h2>
                  <p className="text-stone-600 text-lg mb-6">
                    {lang === 'en' 
                      ? `Thank you! We have successfully received your request for ${selectedDate} at ${selectedTime}. A confirmation email has been sent to ${formData.email}.` 
                      : `እናመሰግናለን! ለጉብኝት ያቀረቡት ጥያቄ በ ${selectedDate} በ ${selectedTime} ደርሶናል። የማረጋገጫ ኢሜይል ወደ ${formData.email} ተልኳል።`}
                  </p>
                </div>

                {/* Display selected branch location details & Map */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-stone-900 text-base border-b border-stone-200 pb-2 flex items-center gap-2">
                    <MapPin className="text-brand-orange" size={18} />
                    {lang === 'en' ? 'Selected Campus Location' : 'የተመረጠው የካምፓስ አድራሻ'}
                  </h3>
                  <div>
                    <div className="font-extrabold text-stone-800 text-sm">
                      {branches[selectedBranchIdx] 
                        ? (typeof branches[selectedBranchIdx] === 'string' ? `Campus Branch` : branches[selectedBranchIdx].locationName.split(',')[0])
                        : 'Kidtopia Campus'}
                    </div>
                    <div className="text-xs text-stone-500 mt-1">
                      {branches[selectedBranchIdx] 
                        ? (typeof branches[selectedBranchIdx] === 'string' ? branches[selectedBranchIdx] : branches[selectedBranchIdx].locationName)
                        : ''}
                    </div>
                  </div>
                  {branches[selectedBranchIdx] && (
                    <div className="rounded-xl overflow-hidden border border-stone-200 h-48 relative bg-stone-100 shadow-inner">
                      <iframe
                        title="Booked Branch Map"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(typeof branches[selectedBranchIdx] === 'string' ? branches[selectedBranchIdx] : (branches[selectedBranchIdx].googleMapsCoordinates || branches[selectedBranchIdx].locationName))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>

                <div className="text-center pt-4">
                  <button 
                    onClick={() => {
                      setSuccess(false);
                      setSelectedDate('');
                      setSelectedTime('');
                      setFormData({ name: '', email: '', phone: '' });
                    }}
                    className="btn-primary"
                  >
                    {lang === 'en' ? 'Book Another Tour' : 'ሌላ ጉብኝት ያስይዙ'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Branch/Campus Selection with Embedded Google Map */}
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 text-left space-y-4">
                  <label className="flex items-center text-stone-900 font-bold mb-2">
                    <MapPin className="mr-2 text-brand-orange animate-bounce" size={20} /> {lang === 'en' ? 'Select Kidtopia Campus/Branch' : 'ቅርንጫፍ ይምረጡ'}
                  </label>
                  
                  {branches.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {branches.map((addr: any, idx: number) => {
                        const locationStr = typeof addr === 'string' ? addr : addr.locationName;
                        const isSelected = selectedBranchIdx === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedBranchIdx(idx)}
                            className={`p-4 rounded-xl text-left border-2 transition-all flex items-start gap-3 ${
                              isSelected 
                                ? 'border-brand-green bg-brand-green/5 text-brand-green ring-1 ring-brand-green' 
                                : 'border-stone-200 text-stone-600 hover:border-brand-green bg-white'
                            }`}
                          >
                            <MapPin className={`shrink-0 mt-0.5 ${isSelected ? 'text-brand-green' : 'text-stone-400'}`} size={18} />
                            <div>
                              <div className="font-extrabold text-sm">{typeof addr === 'string' ? `Branch ${idx + 1}` : locationStr.split(',')[0]}</div>
                              <div className="text-xs mt-1 text-stone-500 leading-relaxed">{locationStr}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {branches[selectedBranchIdx] && (
                    <div className="mt-4">
                      <div className="rounded-xl overflow-hidden border border-stone-200 h-44 relative bg-stone-100 shadow-inner">
                        <iframe
                          title="Selected Branch Location Map"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(typeof branches[selectedBranchIdx] === 'string' ? branches[selectedBranchIdx] : (branches[selectedBranchIdx].googleMapsCoordinates || branches[selectedBranchIdx].locationName))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen={false}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Date Selection */}
                  <div className="space-y-4">
                    <label className="flex items-center text-stone-900 font-bold mb-2">
                      <Calendar className="mr-2 text-brand-green" size={20} /> {lang === 'en' ? 'Select Date' : 'ቀን ይምረጡ'}
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
                      <Clock className="mr-2 text-brand-green" size={20} /> {lang === 'en' ? 'Select Time' : 'ሰዓት ይምረጡ'}
                    </label>
                    {selectedDate ? (
                      loadingSlots ? (
                        <div className="py-3 text-stone-500">{lang === 'en' ? 'Loading available times...' : 'የሚገኙ ሰዓቶችን በመጫን ላይ...'}</div>
                      ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot.time}
                              type="button"
                              onClick={() => setSelectedTime(slot.time)}
                              className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors border-2 ${
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
                        <div className="py-3 text-amber-600 font-medium">{lang === 'en' ? 'No available slots for this date.' : 'ለዚህ ቀን ምንም ክፍት ቦታ የለም።'}</div>
                      )
                    ) : (
                      <div className="py-3 text-stone-400">{lang === 'en' ? 'Please select a date first.' : 'እባክዎ መጀመሪያ ቀን ይምረጡ።'}</div>
                    )}
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-6 pt-6 border-t border-stone-100">
                  <h3 className="text-xl font-bold text-stone-900">{lang === 'en' ? 'Your Details' : 'የእርስዎ ዝርዝር መረጃ'}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center text-sm font-bold text-stone-700 mb-2">
                        <User className="mr-2 text-stone-400" size={16} /> {lang === 'en' ? 'Full Name' : 'ሙሉ ስም'}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                        required
                        placeholder={lang === 'en' ? 'Abebe Kebede' : 'አበበ ከበደ'}
                        className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl outline-none focus:border-brand-green"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center text-sm font-bold text-stone-700 mb-2">
                          <Mail className="mr-2 text-stone-400" size={16} /> {lang === 'en' ? 'Email Address' : 'የኢሜይል አድራሻ'}
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                          required
                          placeholder="example@email.com"
                          className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl outline-none focus:border-brand-green"
                        />
                      </div>
                      <div>
                        <label className="flex items-center text-sm font-bold text-stone-700 mb-2">
                          <Phone className="mr-2 text-stone-400" size={16} /> {lang === 'en' ? 'Phone Number' : 'ስልክ ቁጥር'}
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                          required
                          placeholder="0911******"
                          className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl outline-none focus:border-brand-green"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={submitting || !selectedTime}
                  className="w-full btn-primary py-4 text-lg mt-8 disabled:opacity-50"
                >
                  {submitting ? (lang === 'en' ? 'Confirming...' : 'በማረጋገጥ ላይ...') : (lang === 'en' ? 'Confirm Booking' : 'ቀጠሮውን ያረጋግጡ')}
                </button>
              </form>
            )}
          </div>
      </div>
    </div>
  );
};
