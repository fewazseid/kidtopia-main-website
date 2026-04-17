import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBooking, getTourSchedule, updateBookingTime } from '../firebase';
import { Calendar, Clock, CheckCircle, ArrowLeft } from 'lucide-react';

export const RescheduleTourPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [bookData, schedData] = await Promise.all([
          getBooking(id),
          getTourSchedule()
        ]);
        
        if (!bookData) {
          setError('Booking not found.');
          return;
        }

        if (bookData.status !== 'pending') {
          setError('This booking has already been processed and cannot be rescheduled here. Please contact us directly.');
          return;
        }

        setBooking(bookData);
        setSchedule(schedData);
        setSelectedDate(bookData.date);
        setSelectedTime(bookData.time);
      } catch (err) {
        console.error(err);
        setError('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !selectedDate || !selectedTime) return;

    setLoading(true);
    try {
      await updateBookingTime(id, selectedDate, selectedTime);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to update booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const availableSlots = schedule?.slots?.filter((slot: any) => slot.active) || [];

  if (loading && !booking && !error) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-12 flex flex-col items-center">
      <div className="max-w-2xl w-full px-4 mt-8">
        <Link to="/" className="inline-flex items-center text-brand-green font-medium hover:underline mb-6">
          <ArrowLeft size={20} className="mr-2" /> Back to Home
        </Link>

        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-stone-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-4">Reschedule Your Tour</h1>
          </div>

          {error ? (
            <div className="text-center py-8 text-red-600 bg-red-50 rounded-2xl p-6">
              <p className="font-medium text-lg">{error}</p>
            </div>
          ) : success ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Tour Rescheduled Successfully!</h2>
              <p className="text-stone-600 text-lg">Your new requested tour time is {selectedDate} at {selectedTime}. We will notify you once your booking is approved.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-stone-50 p-6 rounded-2xl mb-6">
                <h3 className="font-bold text-stone-700 mb-2">Current Request:</h3>
                <p className="text-stone-900"><strong>Date:</strong> {booking?.date}</p>
                <p className="text-stone-900"><strong>Time:</strong> {booking?.time}</p>
              </div>

              {/* Date Selection */}
              <div className="space-y-4">
                <label className="flex items-center text-stone-900 font-bold mb-2">
                  <Calendar className="mr-2 text-brand-green" size={20} /> Select New Date
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
                  <Clock className="mr-2 text-brand-green" size={20} /> Select New Time
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
                    <div className="py-3 text-amber-600 font-medium">No available slots in schedule.</div>
                  )
                ) : (
                  <div className="py-3 text-stone-400">Please select a date first.</div>
                )}
              </div>

              <div className="pt-6 border-t border-stone-100">
                <button
                  type="submit"
                  disabled={loading || !selectedDate || !selectedTime}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Tour Time'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
