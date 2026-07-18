import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Send, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

const translations = {
  en: {
    eyebrow: 'SECURE CHANNEL / EMAIL', title: 'Start a conversation', name: 'Name', email: 'Email', subject: 'Subject', message: 'Message',
    namePlaceholder: 'Your name', emailPlaceholder: 'you@example.com', subjectPlaceholder: 'Research collaboration', messagePlaceholder: 'Tell me about the problem, idea, or opportunity…',
    send: 'Prepare email', opening: 'Opening email app…', success: 'Email draft prepared', successDesc: 'Your email application should now contain the message. Review it and press send when ready.', close: 'Close',
  },
  sk: {
    eyebrow: 'ZABEZPEČENÝ KANÁL / E-MAIL', title: 'Začnime rozhovor', name: 'Meno', email: 'E-mail', subject: 'Predmet', message: 'Správa',
    namePlaceholder: 'Vaše meno', emailPlaceholder: 'vy@example.com', subjectPlaceholder: 'Výskumná spolupráca', messagePlaceholder: 'Opíšte problém, nápad alebo príležitosť…',
    send: 'Pripraviť e-mail', opening: 'Otváram e-mailovú aplikáciu…', success: 'Koncept e-mailu je pripravený', successDesc: 'V e-mailovej aplikácii by mala byť pripravená vaša správa. Skontrolujte ju a odošlite.', close: 'Zavrieť',
  },
} as const;

export default function ContactModal({ isOpen, onClose, lang }: { isOpen: boolean; onClose: () => void; lang: 'en' | 'sk' }) {
  const t = translations[lang];
  const titleId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const body = `From: ${formData.name} (${formData.email})\n\n${formData.message}`;
    const mailto = `mailto:jaroslav.venjarski@stuba.sk?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => {
      window.location.href = mailto;
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 320);
  };

  const handleClose = () => {
    onClose();
    window.setTimeout(() => setIsSuccess(false), 260);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="contact-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={handleClose}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="contact-modal cyber-panel"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="icon-button contact-modal__close" onClick={handleClose} aria-label={t.close}><X size={20} /></button>
            <p className="contact-modal__eyebrow">{t.eyebrow}</p>
            <h2 id={titleId}>{t.title}</h2>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div className="contact-success" key="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <CheckCircle2 size={42} />
                  <h3>{t.success}</h3>
                  <p>{t.successDesc}</p>
                  <button className="button-secondary" onClick={handleClose}>{t.close}<ArrowUpRight size={17} /></button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="contact-form__row">
                    <label><span>{t.name}</span><input required autoFocus name="name" autoComplete="name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder={t.namePlaceholder} /></label>
                    <label><span>{t.email}</span><input required type="email" name="email" autoComplete="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder={t.emailPlaceholder} /></label>
                  </div>
                  <label><span>{t.subject}</span><input required name="subject" value={formData.subject} onChange={(event) => setFormData({ ...formData, subject: event.target.value })} placeholder={t.subjectPlaceholder} /></label>
                  <label><span>{t.message}</span><textarea required name="message" rows={5} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder={t.messagePlaceholder} /></label>
                  <button className="contact-form__submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <span className="button-loader" /> : <Send size={18} />}{isSubmitting ? t.opening : t.send}<ArrowUpRight size={17} />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
