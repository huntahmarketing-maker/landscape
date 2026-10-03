import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { supabase } from '@/lib/supabase';

const services = [
  'Landscape Design',
  'Hardscape Installation',
  'Tree & Shrub Care',
  'Irrigation & Drainage',
  'Lawn Maintenance',
  'Outdoor Living',
  'Other / Not Sure',
];

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!form.email.trim()) e.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.message.trim()) e.message = 'Please tell us about your project';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    const { error } = await supabase.from('contact_submissions').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      service: form.service || null,
      message: form.message.trim(),
    });

    if (error) {
      setStatus('error');
      return;
    }

    setStatus('success');
    setForm({ name: '', email: '', phone: '', service: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold uppercase tracking-wide">
            Get In Touch
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-sand-900">
            Ready to Transform Your Yard?
          </h2>
          <p className="mt-4 text-lg text-sand-600 leading-relaxed">
            Call us directly or fill out the form below for a free, no-obligation consultation. We'll get back to you within one business day.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <Reveal animation="slide-in-left" className="lg:col-span-2">
            <div className="bg-emerald-800 rounded-3xl p-8 lg:p-10 text-white h-full flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/40 rounded-full blur-3xl" />
              <div className="relative">
                <h3 className="font-display text-2xl font-bold">Contact Information</h3>
                <p className="mt-2 text-emerald-100/80 text-sm leading-relaxed">
                  Reach out anytime — we're happy to answer questions or schedule a visit.
                </p>

                <div className="mt-8 space-y-5">
                  <a href="tel:8432885870" className="flex items-center gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-700/50 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                      <Phone className="w-5 h-5 text-emerald-200" strokeWidth={2.2} />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-200/70 uppercase tracking-wide">Phone</div>
                      <div className="text-lg font-semibold group-hover:text-emerald-200 transition-colors">(843) 288-5870</div>
                    </div>
                  </a>

                  <a href="mailto:emeraldlandscapinghardscaping@gmail.com" className="flex items-center gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-700/50 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                      <Mail className="w-5 h-5 text-emerald-200" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-emerald-200/70 uppercase tracking-wide">Email</div>
                      <div className="text-sm font-semibold group-hover:text-emerald-200 transition-colors break-all">
                        emeraldlandscapinghardscaping@gmail.com
                      </div>
                    </div>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-700/50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-emerald-200" strokeWidth={2.2} />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-200/70 uppercase tracking-wide">Service Area</div>
                      <div className="text-lg font-semibold">Myrtle Beach & Grand Strand</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-700/50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-emerald-200" strokeWidth={2.2} />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-200/70 uppercase tracking-wide">Hours</div>
                      <div className="text-sm font-semibold">Mon–Fri: 7am–6pm</div>
                      <div className="text-sm font-semibold">Sat: 8am–2pm</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-8 pt-8 border-t border-emerald-700/40">
                <p className="text-emerald-100/80 text-sm italic">
                  "Every great landscape starts with a conversation."
                </p>
              </div>
            </div>
          </Reveal>

          {/* Contact Form */}
          <Reveal animation="slide-in-right" delay={150} className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-sand-100">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center text-center py-16 animate-scale-in">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-sand-900">Message Sent!</h3>
                  <p className="mt-3 text-sand-600 max-w-md">
                    Thank you for reaching out. We'll get back to you within one business day. For urgent inquiries, please call us at (843) 288-5870.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 px-6 py-3 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <h3 className="font-display text-2xl font-bold text-sand-900 mb-2">Request a Free Estimate</h3>

                  {status === 'error' && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 animate-fade-in">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">Something went wrong. Please try again or call us at (843) 288-5870.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-sand-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-sand-200 focus:border-emerald-500'
                        }`}
                        placeholder="John Smith"
                      />
                      {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-sand-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-sand-200 focus:border-emerald-500 transition-colors focus:outline-none"
                        placeholder="(843) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-sand-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-sand-200 focus:border-emerald-500'
                      }`}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-sand-700 mb-2">
                      Service Interested In
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => handleChange('service', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-sand-200 focus:border-emerald-500 transition-colors focus:outline-none bg-white"
                    >
                      <option value="">Select a service...</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-sand-700 mb-2">
                      Project Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none resize-none ${
                        errors.message ? 'border-red-300 bg-red-50' : 'border-sand-200 focus:border-emerald-500'
                      }`}
                      placeholder="Tell us about your project, timeline, and any specific needs..."
                    />
                    {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-700 text-white font-semibold text-lg hover:bg-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" strokeWidth={2.2} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
