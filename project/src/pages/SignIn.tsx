import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { easeOutExpo } from '../lib/motion';
import { useUserStore } from '../stores/userStore';
import AuthForm, { type AuthMode } from '../components/account/AuthForm';
import PhotoScreen from '../components/content/PhotoScreen';
import { FRONT } from '../components/content/chat/photos';
import AccountScreen from '../components/content/screens/AccountScreen';
import SavedCheckoutScreen from '../components/content/screens/SavedCheckoutScreen';

// One hand and phone for both tabs; only the screen changes: the account, or a checkout already filled in.
const SCREENS: Record<AuthMode, { caption: string; screen: () => JSX.Element }> = {
  entrar: { caption: 'As suas encomendas, recibos e dados de entrega num só lugar', screen: AccountScreen },
  criar: { caption: 'Compre mais depressa, com a morada e o contacto já preenchidos', screen: SavedCheckoutScreen },
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

/** /entrar: sign in or create an account, with a photo beside the form. */
const SignIn = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.currentUser);
  const mode: AuthMode = params.get('modo') === 'criar' ? 'criar' : 'entrar';
  const back = safeReturn(params.get('voltar'));
  const leave = params.get('voltar') && back !== '/conta' ? back : '/';
  const { caption, screen: Screen } = SCREENS[mode];
  const [panelRef, aspect] = useAspect();

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
      {/* The photo stays in view while a longer form scrolls beside it */}
      <div
        ref={panelRef}
        className="relative hidden overflow-hidden bg-[#ece9e4] lg:sticky lg:top-0 lg:block lg:h-[100svh] lg:self-start"
      >
        <Link
          to="/"
          className="absolute left-12 top-10 z-10 font-display text-xl font-semibold tracking-tight xl:left-16"
          aria-label="Rhulany Tech, página inicial"
        >
          Rhulany<span className="text-ink/40">Tech</span>
        </Link>
        {aspect > 0 && (
          <div className="absolute inset-0">
            <PhotoScreen
              src="/images/telemovel/mao-frente-960.jpg"
              srcSet="/images/telemovel/mao-frente-600.jpg 600w, /images/telemovel/mao-frente-960.jpg 960w"
              sizes="50vw"
              alt="Mão a segurar um telemóvel com a conta da Rhulany Tech no ecrã"
              photo={FRONT}
              aspect={aspect}
              // Never narrower than the panel, whatever its shape.
              zoom={Math.max(1, FRONT.width / FRONT.height / aspect)}
              focus={{ x: 0.5, y: 0.395 }}
              target={{ x: 0.5, y: 0.42 }}
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
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#ece9e4] via-[#ece9e4]/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12 xl:p-16">
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

      <div className="relative flex flex-col justify-center px-5 pb-16 pt-24 sm:px-10 lg:px-14 lg:pt-28 xl:px-20">
        <div className="absolute inset-x-5 top-7 flex items-center justify-between sm:inset-x-10 lg:inset-x-14 lg:top-9 xl:inset-x-20">
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
              <h1 className="type-display">{mode === 'entrar' ? 'Bem-vindo de volta' : 'Crie a sua conta'}</h1>
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
