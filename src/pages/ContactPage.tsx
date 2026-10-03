import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { storageService } from '../services/storage';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Building,
  PhoneCall,
  Globe,
  Share2,
} from 'lucide-react';

interface ContactPageProps {
  settings: SiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim() || !formData.message.trim()) {
      setError('Please fill in your Name, Mobile Number, and Message.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      storageService.submitEnquiry({
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim() || 'Not Provided',
        subject: formData.subject.trim() || 'General Admission Enquiry',
        message: formData.message.trim(),
      });

      setSubmitted(true);
      setFormData({
        name: '',
        mobile: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError('Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
            Get In Touch
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            CONTACT INSTITUTION
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed font-light">
            We welcome prospective students, parents, and community members. Reach out to our campus
            admission office at Khireitangiri, Kendujhar for guidance and assistance.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info & Address Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Campus Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                  Central Campus
                </span>
                <h2 className="font-heading text-xl font-bold text-slate-900 mt-1">
                  VISHWA VINAYAK TRUST
                </h2>
                <p className="text-xs font-semibold text-slate-500">Group of Institutions</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Campus Address:</strong>
                    <p className="leading-relaxed text-slate-600">
                      At/Po-Khireitangiri
                      <br />
                      Dist-Kendujhar, State-Odisha
                      <br />
                      PIN-758046, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Helpline Numbers:</strong>
                    <div className="flex flex-col gap-1 mt-1">
                      <a
                        href="tel:+919437238689"
                        className="font-bold text-red-700 hover:underline flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>+91 9437238689</span>
                      </a>
                      <a
                        href="tel:+919437614185"
                        className="font-bold text-red-700 hover:underline flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>+91 9437614185</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Email Desk:</strong>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-amber-800 hover:underline font-medium block break-all"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Office Hours:</strong>
                    <p className="text-xs text-slate-600 leading-relaxed">{settings.officeHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wing Direct Phone Directory */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-400">
                Direct Wing Extensions
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <div>
                    <p className="font-bold text-slate-200">Vishwa Vinayak Degree College (VVDC)</p>
                    <span className="text-[11px] text-slate-400">+3 Arts, Science & Commerce</span>
                  </div>
                  <a
                    href="tel:+919437238689"
                    className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold hover:bg-amber-500/30"
                  >
                    Call
                  </a>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-bold text-slate-200">
                      Vishwa Vinayak Higher Secondary School (VVHSS)
                    </p>
                    <span className="text-[11px] text-slate-400">+2 CHSE Science, Arts & Commerce</span>
                  </div>
                  <a
                    href="tel:+919437614185"
                    className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold hover:bg-amber-500/30"
                  >
                    Call
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Enquiry Form & Map (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Form Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div>
                <h3 className="font-heading text-xl font-bold text-slate-900">
                  Send Us An Enquiry
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Fill in your requirements below. Our academic counseling cell will respond promptly.
                </p>
              </div>

              {submitted && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <p className="text-xs sm:text-sm font-bold">
                      Thank You! Your enquiry has been received.
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Our administrative desk at Khireitangiri has logged your enquiry and will
                      contact you soon.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="e.g. 9437XXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subject / Enquiry Type
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. +2 Science Admission, Hostel, etc."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Message / Query <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your details, student's qualification, or question here..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Enquiry'}</span>
                </button>
              </form>
            </div>

            {/* Google Maps / Campus Location Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Campus Location Map
                  </h3>
                  <p className="text-xs text-slate-500">
                    At/Po-Khireitangiri, Dist-Kendujhar, Odisha - 758046
                  </p>
                </div>
                <a
                  href="https://maps.google.com/?q=Khireitangiri+Kendujhar+Odisha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
                >
                  <span>Open in Google Maps</span>
                  <Globe className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Embedded Map Representation */}
              <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                <iframe
                  title="Campus Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118000!2d85.6!3d21.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1e50529d29f8f7%3A0x6b4a3c10a4b7f92!2sKeonjhar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
