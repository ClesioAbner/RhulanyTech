import { STORE } from '../data/store';

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// .env.example ships placeholders ("your_service_id"); treat those as not configured.
const isSet = (value?: string): value is string => Boolean(value && !value.startsWith('your_'));
const emailServiceConfigured = isSet(SERVICE_ID) && isSet(TEMPLATE_ID) && isSet(PUBLIC_KEY);

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const subjectFor = (message: ContactMessage) => `Mensagem de ${message.name}`;

/**
 * Sends the message through EmailJS when it is configured (VITE_EMAILJS_* in .env).
 * Otherwise opens the visitor's email app with the message written, addressed to the store.
 */
export const sendContactMessage = async (message: ContactMessage): Promise<'sent' | 'mail-app'> => {
  if (emailServiceConfigured) {
    const { default: emailjs } = await import('emailjs-com');
    await emailjs.send(
      SERVICE_ID as string,
      TEMPLATE_ID as string,
      {
        subject: subjectFor(message),
        from_name: message.name,
        reply_to: message.email,
        phone: message.phone || 'Não indicado',
        message: message.message,
      },
      PUBLIC_KEY,
    );
    return 'sent';
  }

  const body = [message.message, '', `${message.name}`, message.email, message.phone].filter(Boolean).join('\n');
  window.location.href = `mailto:${STORE.email}?subject=${encodeURIComponent(subjectFor(message))}&body=${encodeURIComponent(body)}`;
  return 'mail-app';
};
