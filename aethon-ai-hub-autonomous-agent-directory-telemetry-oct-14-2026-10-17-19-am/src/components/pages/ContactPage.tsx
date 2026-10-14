import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  MessageSquare, 
  Clock, 
  MapPin, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import BrandLogo from '../BrandLogo';

interface ContactPageProps {
  onNavigateHome: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigateHome }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'Editorial Correction / Tool Update',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="w-full max-w-[1520px] mx-auto px-6 sm:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-left">
          <div className="flex items-center gap-4 mb-4">
            <BrandLogo size="lg" />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-2">
                <Mail className="w-3.5 h-3.5" />
                <span>Direct Communications & Editorial Desk</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Contact AI Directory (Zmpto Tool)
              </h1>
            </div>
          </div>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl">
            Have an update regarding your software listing? Want to challenge an editorial review score or propose a new benchmark test suite? We welcome dialogue from builders, researchers, and community members.
          </p>
        </div>

        {/* Quick Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0b0e17] border border-white/10 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Direct Editorial Email</h2>
            <p className="text-xs text-neutral-400 mb-3 font-mono">editorial@aidirectory.tool</p>
            <span className="text-[11px] text-neutral-500">For review disputes, correction requests & methodology questions.</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b0e17] border border-white/10 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Partnerships & Listings</h2>
            <p className="text-xs text-neutral-400 mb-3 font-mono">partnerships@aidirectory.tool</p>
            <span className="text-[11px] text-neutral-500">For sponsored placement, newsletter sponsorship, and developer inquiries.</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b0e17] border border-white/10 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Response Commitment</h2>
            <p className="text-xs text-emerald-400 mb-3 font-mono">&lt; 24h Business Day SLA</p>
            <span className="text-[11px] text-neutral-500">All genuine technical inquiries receive a personalized written response.</span>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <span>Send a Message to Our Editorial Desk</span>
          </h2>

          {isSubmitted ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Message Dispatched Successfully</h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto mb-6">
                Thank you for reaching out, {formData.name}. We have routed your inquiry to our editorial team at <strong>editorial@aidirectory.tool</strong>. You will receive a response at <strong>{formData.email}</strong> shortly.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    inquiryType: 'Editorial Correction / Tool Update',
                    subject: '',
                    message: ''
                  });
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                    Your Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="maya@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                    Inquiry Nature <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Editorial Correction / Tool Update">Editorial Correction / Tool Update</option>
                    <option value="Benchmark Test Suite Proposal">Benchmark Test Suite Proposal</option>
                    <option value="Sponsorship & Featured Placement">Sponsorship & Featured Placement</option>
                    <option value="Press & Media Inquiry">Press & Media Inquiry</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                    Subject Line <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Benchmark update for Claude 3.5 Sonnet context recall"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                  Detailed Message <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Provide context, references, links to documentation, or specific benchmark numbers..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-[11px] text-neutral-500 font-mono">
                  All correspondence is encrypted in transit and never shared with third parties.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Sending Transmission...</span>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
