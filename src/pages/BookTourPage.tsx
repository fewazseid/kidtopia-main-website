import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getTourSchedule, getBookingsByDate, createBooking } from '../firebase';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language } from '../translations';
import { useContent } from '../ContentContext';

interface BookTourPageProps {
  lang: Language;
}

export const BookTourPage: React.FC<BookTourPageProps> = ({ lang }) => {
  const t = useContent(lang).leadCapture;
  
  const [schedule, setSchedule] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
          // Display all active slots in the schedule
          // We removed the booked filter so multiple users can book the same spot
          const available = schedule.slots.filter((slot: any) => slot.active);
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
      const bookingId = await createBooking({
        ...formData,
        date: selectedDate,
        time: selectedTime,
      });

      // Send confirmation email via Firebase Trigger Email extension
      try {
        const rescheduleLink = `${window.location.origin}/reschedule/${bookingId}`;
        const emailHtml = `
          <h2>Kidtopia Tour Booking Request</h2>
          <p>Hi ${formData.name},</p>
          <p>We have successfully received your request for a physical tour at Kidtopia International Daycare and Preschool.</p>
          <p><strong>Requested Date:</strong> ${selectedDate}</p>
          <p><strong>Requested Time:</strong> ${selectedTime}</p>
          <p>Our team will review your request and send you an email once it is approved.</p>
          <br/>
          <p>If you need to change your tour time before it is finalized, <a href="${rescheduleLink}">click here to reschedule</a>.</p>
          <br/>
          <p>Best regards,</p>
          <p>Kidtopia Team</p>
        `;
        
        await fetch('/api/dummy-ignore-just-to-skip', { method: 'GET' }).catch(() => {}); // Stub for extension
        import('../firebase').then(({ sendEmail }) => {
           sendEmail(formData.email, 'Kidtopia Tour Booking Request Received', emailHtml).catch(console.error);
        });
      } catch (err) {
        console.error("Failed to enqueue email", err);
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
    <div className="min-h-screen bg-stone-50 pt-20 pb-12 flex flex-col items-center">
      <div className="max-w-3xl w-full px-4 mt-8">
        <Link to="/" className="inline-flex items-center text-brand-green font-medium hover:underline mb-6">
          <ArrowLeft size={20} className="mr-2" /> Back to Home
        </Link>
        
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-stone-100">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">{t.book || "Book a Tour"}</h1>
            <p className="text-stone-600 text-lg">Schedule a visit to Kidtopia and see our wonderful environment.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
            </div>
          ) : success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-bold text-stone-900 mb-4">Tour Booked Successfully!</h2>
              <p className="text-stone-600 text-lg mb-8">We have received your request for {selectedDate} at {selectedTime}. We will contact you shortly to confirm.</p>
              <button 
                onClick={() => {
                  setSuccess(false);
                  setSelectedDate('');
                  setSelectedTime('');
                  setFormData({ name: '', email: '', phone: '' });
                }}
                className="btn-primary"
              >
                Book Another Tour
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div className="space-y-4">
                  <label className="flex items-center text-stone-900 font-bold mb-2">
                    <Calendar className="mr-2 text-brand-green" size={20} /> Select Date
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
                    <Clock className="mr-2 text-brand-green" size={20} /> Select Time
                  </label>
                  {selectedDate ? (
                    loadingSlots ? (
                      <div className="py-3 text-stone-500">Loading available times...</div>
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
                      <div className="py-3 text-amber-600 font-medium">No available slots for this date.</div>
                    )
                  ) : (
                    <div className="py-3 text-stone-400">Please select a date first.</div>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6 pt-6 border-t border-stone-100">
                <h3 className="text-xl font-bold text-stone-900">Your Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-bold text-stone-700 mb-2">
                      <User className="mr-2 text-stone-400" size={16} /> Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      required
                      placeholder="Abebe Kebede"
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl outline-none focus:border-brand-green"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center text-sm font-bold text-stone-700 mb-2">
                        <Mail className="mr-2 text-stone-400" size={16} /> Email Address
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
                        <Phone className="mr-2 text-stone-400" size={16} /> Phone Number
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
                {submitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
