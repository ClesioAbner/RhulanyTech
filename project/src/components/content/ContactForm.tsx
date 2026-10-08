import { useId, useState, type ChangeEvent, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { STORE } from '../../data/store';
import { EMAIL_PATTERN, sendContactMessage, type ContactMessage } from '../../lib/contact';
import { easeOutExpo } from '../../lib/motion';
import { ButtonLoader } from '../ui/BrandLoader';

const MESSAGE_MAX = 1000;
const MESSAGE_MIN = 10;

type Field = 'name' | 'email' | 'phone' | 'message';
type Errors = Partial<Record<Field, string>>;
type Status = 'idle' | 'sending' | 'sent' | 'mail-app' | 'error';

const validate = (values: ContactMessage): Errors => {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Indique o seu nome';
  if (!values.email.trim()) errors.email = 'Precisamos do email para responder';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Este email não parece completo';
  if (values.phone.trim() && values.phone.replace(/\D/g, '').length < 9) errors.phone = 'Confirme o número';
  if (values.message.trim().length < MESSAGE_MIN) errors.message = 'Conte-nos um pouco mais';
  return errors;
};

const fieldClass = (hasError: boolean) =>
  `w-full rounded-xl border bg-white px-5 text-[15px] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-ink/40 ${
    hasError
      ? 'border-[#b42318] focus:shadow-[0_0_0_4px_rgba(180,35,24,0.12)]'
      : 'border-ink/[0.14] hover:border-ink/30 focus:border-ink focus:shadow-[0_0_0_4px_rgba(12,12,13,0.07)]'
  }`;

const ErrorText = ({ id, text }: { id: string; text?: string }) => (
  <AnimatePresence initial={false}>
    {text && (
      <motion.p
        id={id}
        className="px-2 pt-2 text-xs text-[#b42318]"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25 }}
      >
        {text}
      </motion.p>
    )}
  </AnimatePresence>
);

/** The contact card: details and message, sent by email. */
const ContactForm = () => {
  const baseId = useId();
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '' });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [honeypot, setHoneypot] = useState('');

  const errors = validate(values);
  const shown = (field: Field) => (touched[field] ? errors[field] : undefined);
  const ids = (field: Field) => ({ input: `${baseId}-${field}`, error: `${baseId}-${field}-erro` });

  const update = (field: Field) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = field === 'message' ? event.target.value.slice(0, MESSAGE_MAX) : event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    if (status === 'error') setStatus('idle');
  };
  const blur = (field: Field) => () => setTouched((current) => ({ ...current, [field]: true }));

  const inputProps = (field: Field) => ({
    id: ids(field).input,
    name: field,
    value: values[field],
    onChange: update(field),
    onBlur: blur(field),
    'aria-invalid': Boolean(shown(field)),
    'aria-describedby': shown(field) ? ids(field).error : undefined,
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ name: true, email: true, phone: true, message: true });
    if (Object.keys(errors).length) {
      event.currentTarget.querySelector<HTMLElement>(`#${CSS.escape(ids(Object.keys(errors)[0] as Field).input)}`)?.focus();
      return;
    }
    if (honeypot) return; // only bots fill the hidden field
    setStatus('sending');
    try {
      setStatus(await sendContactMessage({ ...values, name: values.name.trim(), email: values.email.trim() }));
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setValues({ name: '', email: '', phone: '', message: '' });
    setTouched({});
    setStatus('idle');
  };

  const done = status === 'sent' || status === 'mail-app';

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-white p-6 sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="feito"
            className="flex min-h-[520px] flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            {/* A check drawn with a single stroke */}
            <svg viewBox="0 0 52 52" className="h-16 w-16" aria-hidden="true">
              <motion.circle
                cx="26"
                cy="26"
                r="24"
                fill="none"
                stroke="#0C0C0D"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: easeOutExpo }}
              />
              <motion.path
                d="M16 27 l7 7 l13 -15"
                fill="none"
                stroke="#0C0C0D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.5 }}
              />
            </svg>
            <h3 className="type-heading mt-8">{status === 'sent' ? 'Mensagem enviada' : 'A sua mensagem está pronta'}</h3>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink/60">
              {status === 'sent' ? (
                <>
                  Obrigado, {values.name.trim().split(' ')[0]}. Respondemos para{' '}
                  <span className="text-ink">{values.email.trim()}</span>
                </>
              ) : (
                <>
                  Abrimos o seu email com a mensagem escrita, só tem de a enviar. Se não abriu, escreva para{' '}
                  <a href={`mailto:${STORE.email}`} className="link-underline text-ink">
                    {STORE.email}
                  </a>
                </>
              )}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 inline-flex h-12 items-center rounded-full bg-paper px-6 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
            >
              Escrever outra mensagem
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="formulario"
            noValidate
            onSubmit={submit}
            aria-labelledby={`${baseId}-titulo`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            <h2 id={`${baseId}-titulo`} className="type-heading">
              Escreva-nos
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor={ids('name').input} className="sr-only">
                  Nome
                </label>
                <input
                  {...inputProps('name')}
                  type="text"
                  autoComplete="name"
                  placeholder="Nome"
                  className={`${fieldClass(Boolean(shown('name')))} h-14`}
                />
                <ErrorText id={ids('name').error} text={shown('name')} />
              </div>
              <div>
                <label htmlFor={ids('email').input} className="sr-only">
                  Email
                </label>
                <input
                  {...inputProps('email')}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Email"
                  className={`${fieldClass(Boolean(shown('email')))} h-14`}
                />
                <ErrorText id={ids('email').error} text={shown('email')} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={ids('phone').input} className="sr-only">
                  Telefone ou WhatsApp, opcional
                </label>
                <input
                  {...inputProps('phone')}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Telefone ou WhatsApp (opcional)"
                  className={`${fieldClass(Boolean(shown('phone')))} h-14`}
                />
                <ErrorText id={ids('phone').error} text={shown('phone')} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={ids('message').input} className="sr-only">
                  Mensagem
                </label>
                <div className="relative">
                  <textarea
                    {...inputProps('message')}
                    rows={6}
                    placeholder="Como podemos ajudar?"
                    className={`${fieldClass(Boolean(shown('message')))} block min-h-[180px] resize-none pb-9 pt-4`}
                  />
                  <span className="pointer-events-none absolute bottom-3 right-4 text-xs tabular-nums text-ink/35">
                    {values.message.length}/{MESSAGE_MAX}
                  </span>
                </div>
                <ErrorText id={ids('message').error} text={shown('message')} />
              </div>
            </div>

            {/* Spam trap: invisible to people, tempting to bots */}
            <input
              type="text"
              name="empresa"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              className="absolute -left-[9999px] h-px w-px opacity-0"
              aria-hidden="true"
            />

            <AnimatePresence>
              {status === 'error' && (
                <motion.p
                  role="alert"
                  className="mt-5 rounded-2xl bg-[#b42318]/[0.06] px-5 py-4 text-sm text-[#b42318]"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  Não foi possível enviar agora. Tente de novo ou fale connosco pelo WhatsApp
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="relative mt-6 h-14 w-full overflow-hidden rounded-full bg-ink text-sm font-medium text-paper transition-[background-color,transform] duration-300 hover:bg-ink-soft active:scale-[0.99] disabled:cursor-progress"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={status === 'sending' ? 'a-enviar' : 'enviar'}
                  className="block"
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {status === 'sending' ? <ButtonLoader label="A enviar" /> : 'Enviar mensagem'}
                </motion.span>
              </AnimatePresence>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
