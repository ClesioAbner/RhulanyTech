import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EMAIL_PATTERN } from '../../lib/contact';
import { formatMobile, isMobile, localNumber } from '../../lib/checkout';
import { easeOutExpo } from '../../lib/motion';
import { useUserStore, type UserProfile } from '../../stores/userStore';
import { TextField } from '../ui/Field';
import { ButtonLoader } from '../ui/BrandLoader';

export type AuthMode = 'entrar' | 'criar';

const MODES: { id: AuthMode; label: string }[] = [
  { id: 'entrar', label: 'Entrar' },
  { id: 'criar', label: 'Criar conta' },
];

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'password' | 'form', string>>;

interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSuccess: (user: UserProfile) => void;
}

/** Sign in or create an account. */
const AuthForm = ({ mode, onModeChange, onSuccess }: AuthFormProps) => {
  const signIn = useUserStore((state) => state.signIn);
  const register = useUserStore((state) => state.register);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setErrors({});
    setShowPassword(false);
    const timer = window.setTimeout(() => firstFieldRef.current?.focus({ preventScroll: true }), 200);
    return () => window.clearTimeout(timer);
  }, [mode]);

  const set = (field: keyof typeof values) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = field === 'phone' ? formatMobile(event.target.value) : event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field] || errors.form) setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (mode === 'criar' && values.name.trim().length < 2) next.name = 'Indique o seu nome';
    if (!EMAIL_PATTERN.test(values.email.trim())) next.email = 'Indique um email válido';
    if (mode === 'criar' && values.phone && !isMobile(values.phone)) next.phone = 'Indique um número de telemóvel moçambicano';
    if (values.password.length < (mode === 'criar' ? 8 : 1)) {
      next.password = mode === 'criar' ? 'Use pelo menos 8 caracteres' : 'Indique a palavra-passe';
    }
    return next;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      const user =
        mode === 'entrar'
          ? await signIn(values.email, values.password)
          : await register({
              name: values.name.trim(),
              email: values.email.trim(),
              phone: values.phone ? localNumber(values.phone) : '',
              password: values.password,
            });
      onSuccess(user);
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Não foi possível continuar' });
      setBusy(false);
    }
  };

  return (
    <div>
      <div role="tablist" aria-label="Entrar ou criar conta" className="grid grid-cols-2 rounded-full bg-paper p-1">
        {MODES.map((item) => {
          const isActive = item.id === mode;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onModeChange(item.id)}
              className={`relative isolate h-11 rounded-full text-sm font-medium transition-colors duration-300 ${isActive ? 'text-paper' : 'text-ink/55 hover:text-ink'}`}
            >
              {isActive && (
                <motion.span
                  layoutId="auth-modo"
                  className="absolute inset-0 -z-10 rounded-full bg-ink"
                  transition={{ duration: 0.4, ease: easeOutExpo }}
                />
              )}
              {item.label}
            </button>
          );
        })}
      </div>

      <form noValidate onSubmit={submit} className="mt-8 space-y-4">
        <AnimatePresence initial={false}>
          {mode === 'criar' && (
            <motion.div
              key="nome"
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
            >
              <TextField
                ref={firstFieldRef}
                label="Nome"
                autoComplete="name"
                value={values.name}
                onChange={set('name')}
                error={errors.name}
                placeholder="Nome e apelido"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <TextField
          ref={mode === 'entrar' ? firstFieldRef : undefined}
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={set('email')}
          error={errors.email}
          placeholder="nome@exemplo.com"
        />
        <AnimatePresence initial={false}>
          {mode === 'criar' && (
            <motion.div
              key="telefone"
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
            >
              <TextField
                label="Telemóvel"
                optional
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                leading="+258"
                value={values.phone}
                onChange={set('phone')}
                error={errors.phone}
                placeholder="84 123 4567"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="relative">
          <TextField
            label="Palavra-passe"
            type={showPassword ? 'text' : 'password'}
            autoComplete={mode === 'entrar' ? 'current-password' : 'new-password'}
            value={values.password}
            onChange={set('password')}
            error={errors.password}
            hint={mode === 'criar' && !errors.password ? 'Pelo menos 8 caracteres' : undefined}
            className="pr-20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-pressed={showPassword}
            className="absolute right-2 top-[36px] h-9 rounded-full px-3 text-xs font-medium text-ink/55 transition-colors hover:text-ink"
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        <AnimatePresence>
          {errors.form && (
            <motion.p
              role="alert"
              className="rounded-2xl bg-[#b42318]/[0.06] px-4 py-3 text-sm text-[#b42318]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {errors.form}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={busy}
          className="!mt-6 h-14 w-full rounded-full bg-ink text-sm font-medium text-paper transition-[background-color,transform] duration-300 hover:bg-ink-soft active:scale-[0.99] disabled:cursor-progress disabled:opacity-80"
        >
          {busy ? <ButtonLoader label="Um momento" /> : mode === 'entrar' ? 'Entrar' : 'Criar conta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/55">
        {mode === 'entrar' ? 'Ainda não tem conta? ' : 'Já tem conta? '}
        <button
          type="button"
          onClick={() => onModeChange(mode === 'entrar' ? 'criar' : 'entrar')}
          className="link-underline font-medium text-ink"
        >
          {mode === 'entrar' ? 'Criar conta' : 'Entrar'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
