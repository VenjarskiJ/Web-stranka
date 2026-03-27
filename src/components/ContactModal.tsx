import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'sk';
}

const translations = {
  en: {
    title: "Get in Touch",
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    send: "Send Message",
    sending: "Sending...",
    success: "Message sent successfully!",
    successDesc: "Thank you for reaching out. I'll get back to you as soon as possible.",
    close: "Close"
  },
  sk: {
    title: "Kontaktujte ma",
    name: "Meno",
    email: "Email",
    subject: "Predmet",
    message: "Správa",
    send: "Odoslať správu",
    sending: "Odosielanie...",
    success: "Správa bola úspešne odoslaná!",
    successDesc: "Ďakujem za správu. Ozvem sa vám hneď ako to bude možné.",
    close: "Zavrieť"
  }
};

export default function ContactModal({ isOpen, onClose, lang }: ContactModalProps) {
  const t = translations[lang];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Actually open mailto link
      const mailtoLink = `mailto:jaroslav.venjarski@stuba.sk?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
      window.location.href = mailtoLink;
      
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
        onClose();
      }, 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-6"
          >
            <div className="glass dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <button
                onClick={onClose}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white"
              >
                <X size={20} />
              </button>

              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.success}</h3>
                  <p className="text-gray-600 dark:text-white/70">{t.successDesc}</p>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t.title}</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-white/80">{t.name}</label>
                        <input
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-white/80">{t.email}</label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-white/80">{t.subject}</label>
                      <input
                        required
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30"
                        placeholder="Project Inquiry"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-white/80">{t.message}</label>
                      <textarea
                        required
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 resize-none"
                        placeholder="Hello Jaroslav..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={20} />
                          {t.send}
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
