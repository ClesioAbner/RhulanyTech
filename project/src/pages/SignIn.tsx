import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { easeOutExpo } from '../lib/motion';
import { useMediaQuery } from '../lib/useMediaQuery';
import { useUserStore } from '../stores/userStore';
import AuthForm, { type AuthMode } from '../components/account/AuthForm';
import PhotoScreen from '../components/content/PhotoScreen';
import { FRONT } from '../components/content/chat/photos';
import AccountScreen from '../components/content/screens/AccountScreen';
import PaymentStoryScreen from '../components/content/screens/PaymentStoryScreen';

// One hand and phone for both tabs; only the screen changes: paying in the checkout, or the account.
const SCREENS: Record<AuthMode, { caption: string; alt: string; screen: () => JSX.Element }> = {
  entrar: {
    caption: 'Pague com M-Pesa, e-Mola, mKesh, cartão ou PayPal, e a encomenda segue logo',
    alt: 'Mão a segurar um telemóvel com o pagamento da Rhulany Tech no ecrã',
    screen: PaymentStoryScreen,
  },
  criar: {
    caption: 'As suas encomendas, recibos e dados de entrega num só lugar',
    alt: 'Mão a segurar um telemóvel com a conta da Rhulany Tech no ecrã',
    screen: AccountScreen,
  },
};

/** Width over height of an element, kept up to date, so a photo can be framed to fill it. */
const useAspect = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState(0);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setAspect(element.clientHeight ? element.clientWidth / element.clientHeight : 0);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, aspect] as const;
};

// Only follow redirects inside the site.
const safeReturn = (value: string | null) => (value && value.startsWith('/') && !value.startsWith('//') ? value : '/conta');

/** /entrar: sign in or create an account, with a photo beside the form (above it on phones and tablets). */
const SignIn = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.currentUser);
  const mode: AuthMode = params.get('modo') === 'criar' ? 'criar' : 'entrar';
  const back = safeReturn(params.get('voltar'));
  const leave = params.get('voltar') && back !== '/conta' ? back : '/';
  const { caption, alt, screen: Screen } = SCREENS[mode];
  const [panelRef, aspect] = useAspect();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    document.title = `${mode === 'entrar' ? 'Entrar' : 'Criar conta'} | Rhulany Tech`;
    return () => {
      document.title = 'Rhulany Tech | Tecnologia original em Maputo';
    };
  }, [mode]);

  const setMode = (next: AuthMode) => {
    const updated = new URLSearchParams(params);
    if (next === 'criar') updated.set('modo', 'criar');
    else updated.delete('modo');
    setParams(updated, { replace: true });
  };

  if (currentUser) return <Navigate to={back} replace />;

  return (
    <div className="grid min-h-[100svh] lg:grid-cols-2">
      {/* Desktop: the photo stays in view while a longer form scrolls beside it. Phones: a banner over the form. */}
      <div
        ref={panelRef}
        className="relative h-[46svh] min-h-[360px] overflow-hidden bg-[#ece9e4] sm:h-[52svh] lg:sticky lg:top-0 lg:h-[100svh] lg:min-h-0 lg:self-start"
      >
        <Link
          to="/"
          className="absolute left-5 top-7 z-10 font-display text-lg font-semibold tracking-tight sm:left-10 lg:left-12 lg:top-10 lg:text-xl xl:left-16"
          aria-label="Rhulany Tech, página inicial"
        >
          Rhulany<span className="text-ink/40">Tech</span>
        </Link>
        <Link
          to={leave}
          className="absolute right-5 top-5 z-10 inline-flex h-10 items-center rounded-full bg-white/90 px-5 text-sm font-medium backdrop-blur sm:right-10 lg:hidden"
        >
          Voltar
        </Link>
        {aspect > 0 && (
          <div className="absolute inset-0">
            <PhotoScreen
              src="/images/telemovel/mao-frente-960.jpg"
              srcSet="/images/telemovel/mao-frente-600.jpg 600w, /images/telemovel/mao-frente-960.jpg 960w"
              sizes="50vw"
              alt={alt}
              photo={FRONT}
              aspect={aspect}
              // A little more contrast and warmth than the stock photo, and light on the glass.
              imageClassName="[filter:contrast(1.06)_saturate(1.1)_sepia(0.06)]"
              glare
              // Never narrower than the panel, whatever its shape; closer in on the shorter phone banner.
              zoom={Math.max(isDesktop ? 1 : 1.15, FRONT.width / FRONT.height / aspect)}
              focus={{ x: 0.5, y: 0.395 }}
              target={{ x: 0.5, y: isDesktop ? 0.42 : 0.62 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mode}
                  className="h-full"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <Screen />
                </motion.div>
              </AnimatePresence>
            </PhotoScreen>
          </div>
        )}
        {/* Soft vignette that draws the eye to the phone */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_65%_at_50%_42%,transparent_50%,rgba(70,52,36,0.14)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#ece9e4] via-[#ece9e4]/80 to-transparent max-lg:hidden" />
        {/* Phones: the photo melts into the page above the form */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper to-transparent lg:hidden" />
        <div className="absolute inset-x-0 bottom-0 hidden p-12 lg:block xl:p-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={mode}
              className="type-title max-w-md"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
            >
              {caption}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative flex flex-col px-5 pb-14 pt-9 sm:px-10 sm:pt-12 lg:justify-center lg:px-14 lg:pb-16 lg:pt-28 xl:px-20">
        <div className="absolute inset-x-14 top-9 hidden items-center justify-between lg:flex xl:inset-x-20">
          <Link
            to="/"
            className="font-display text-lg font-semibold tracking-tight lg:invisible"
            aria-label="Rhulany Tech, página inicial"
          >
            Rhulany<span className="text-ink/40">Tech</span>
          </Link>
          <Link
            to={leave}
            className="inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
          >
            Voltar
          </Link>
        </div>
        <motion.div
          className="mx-auto w-full max-w-[460px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
            >
              <h1 className="type-banner">{mode === 'entrar' ? 'Bem-vindo de volta' : 'Crie a sua conta'}</h1>
              <p className="type-lead mt-3 text-ink/55">
                {mode === 'entrar' ? 'Entre para acompanhar as suas encomendas' : 'Leva menos de um minuto'}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 rounded-[32px] bg-white p-6 shadow-[0_40px_80px_-60px_rgba(12,12,13,0.35)] sm:p-8">
            <AuthForm
              mode={mode}
              onModeChange={setMode}
              onSuccess={(user) => {
                toast(`Olá, ${user.name.split(' ')[0]}`);
                navigate(back, { replace: true });
              }}
            />
          </div>

          <p className="mt-10 text-center text-xs leading-relaxed text-ink/40">
            Precisa de ajuda?{' '}
            <Link to="/contacto" className="link-underline text-ink/60">
              Fale connosco
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
