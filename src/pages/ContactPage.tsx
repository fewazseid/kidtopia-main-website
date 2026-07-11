import React, { useState } from 'react';
import { CTASection } from '../components/CTASection';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

interface ContactPageProps {
  lang: Language;
}

export const ContactPage: React.FC<ContactPageProps> = ({ lang }) => {
  const content = useContent(lang);
  const t = content.footer;
  const nav = content.nav;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      const { getAdminConfig, sendEmail } = await import('../firebase');
      const config = await getAdminConfig();
      const operationsEmail = config.operationsEmail || 'admin@kidtopiaet.com';

      const subjectLine = formData.subject || 'New Contact Us Submission';
      const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #fafaf9;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #3a5b32; margin: 0; font-size: 24px; font-weight: 800;">KIDTOPIA</h1>
            <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px;">International Daycare & Preschool</p>
          </div>
          <h2 style="color: #1c1917; font-size: 18px; border-bottom: 1px solid #e7e5e4; padding-bottom: 12px; margin-top: 0;">New Message from Kidtopia Website</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #44403c; width: 100px; font-size: 14px;">Name:</td>
              <td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #44403c; font-size: 14px;">Email:</td>
              <td style="padding: 6px 0; color: #1c1917; font-size: 14px;"><a href="mailto:${formData.email}" style="color: #3a5b32; text-decoration: none;">${formData.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #44403c; font-size: 14px;">Subject:</td>
              <td style="padding: 6px 0; color: #1c1917; font-size: 14px;">${subjectLine}</td>
            </tr>
          </table>
          <p style="font-weight: bold; color: #44403c; margin-bottom: 8px; font-size: 14px;">Message Content:</p>
          <div style="background-color: #f5f5f4; border-left: 4px solid #3a5b32; padding: 16px; border-radius: 8px; color: #292524; font-size: 14px; line-height: 1.6; font-style: italic;">
            ${formData.message.replace(/\n/g, '<br/>')}
          </div>
          <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;" />
          <p style="font-size: 11px; color: #78716c; text-align: center; margin: 0;">This contact request was securely sent from your Kidtopia website's Contact Us widget.</p>
        </div>
      `;

      await sendEmail(operationsEmail, `Website Contact Form: ${subjectLine}`, htmlBody, formData.email);

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="pt-24">
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-4"
            >
              {nav.contact}
            </motion.h1>
            <div className="w-24 h-1 bg-brand-green mx-auto rounded-full"></div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <GlassCard delay={0.1} className="p-8 flex flex-row items-center gap-6 group text-left">
              <div className="w-16 h-16 rounded-full bg-brand-yellow/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Phone className="text-brand-yellow" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Phone</h3>
                <div className="space-y-1">
                  {t.phones && t.phones.map((ph: string, idx: number) => (
                    <motion.a 
                      key={idx}
                      href={`tel:${ph.replace(/\s+/g, '')}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="block text-stone-600 hover:text-brand-orange transition-colors"
                    >
                      {ph}
                    </motion.a>
                  ))}
                </div>
              </div>
            </GlassCard>

            <GlassCard delay={0.2} className="p-8 flex flex-row items-center gap-6 group text-left">
              <div className="w-16 h-16 rounded-full bg-brand-teal/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Mail className="text-brand-teal" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Email</h3>
                <div className="space-y-1">
                  {t.emails && t.emails.map((em: string, idx: number) => (
                    <motion.a 
                      key={idx}
                      href={`mailto:${em}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="block text-stone-600 hover:text-brand-orange transition-colors"
                    >
                      {em}
                    </motion.a>
                  ))}
                </div>
              </div>
            </GlassCard>

            <GlassCard delay={0.3} className="p-8 flex flex-row items-center gap-6 group text-left">
              <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <MapPin className="text-brand-orange" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Locations</h3>
                <div className="space-y-1">
                  {t.addresses && t.addresses.map((addr: any, idx: number) => {
                    const locationStr = typeof addr === 'string' ? addr : addr.locationName;
                    return (
                      <div
                        key={idx}
                        className="text-stone-600 text-sm font-medium"
                      >
                        {locationStr}
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Core Interactive Section: Center-Aligned Contact Form */}
          <div className="max-w-3xl mx-auto">
            
            {/* Dynamic Contact Email Form */}
            <div className="text-left">
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                <span className="text-[10px] font-extrabold tracking-widest text-brand-green uppercase">Direct Message</span>
                <h2 className="text-3xl font-serif font-bold text-stone-900 mt-1 mb-6">Write Us Directly</h2>

                {success && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-5 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-start gap-3.5 mb-6"
                  >
                    <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
                      <p className="text-xs text-green-700/90 mt-1">Thank you for contacting Kidtopia. We have received your email and will get back to you shortly.</p>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-5 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-3.5 mb-6"
                  >
                    <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-bold text-sm">Failed to Send Message</h4>
                      <p className="text-xs text-red-700/90 mt-1">{error}</p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Your Name</label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:bg-white focus:border-brand-green transition-all text-stone-800 text-sm font-medium"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Your Email</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:bg-white focus:border-brand-green transition-all text-stone-800 text-sm font-medium"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Subject</label>
                    <input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:bg-white focus:border-brand-green transition-all text-stone-800 text-sm font-medium"
                      placeholder="Inquiring about daycare admissions"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Your Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:bg-white focus:border-brand-green transition-all text-stone-800 text-sm font-medium resize-none leading-relaxed"
                      placeholder="Write your message here in detail..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-4.5 bg-brand-green text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-green/90 active:scale-[0.98] transition-all disabled:opacity-50 text-sm tracking-wider uppercase"
                  >
                    {sending ? (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-white/25 border-t-white animate-spin"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
      <CTASection lang={lang} />
    </main>
  );
};
