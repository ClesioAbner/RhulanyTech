import { useEffect } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { unsplash, unsplashSrcSet } from '../lib/images';
import { easeOutExpo } from '../lib/motion';
import { useUserStore } from '../stores/userStore';
import AuthForm, { type AuthMode } from '../components/account/AuthForm';

// One photo per mode; switching tabs crossfades between them.
const PHOTOS: Record<AuthMode, { id: string; alt: string; caption: string }> = {
  entrar: {
    id: '1616440347437-b1c73416efc2',
    alt: 'Secretária de trabalho com monitor, colunas e plantas',
    caption: 'As suas encomendas, recibos e dados de entrega num só lugar',
  },
  criar: {
    id: '1603025832572-c5ba1fb6be8b',
    alt: 'Secretária clara com portátil, monitor e plantas',
    caption: 'Compre mais depressa, com a morada e o contacto já preenchidos',
  },
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
  const photo = PHOTOS[mode];

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
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        {/* Both photos load up front and crossfade, so switching tabs never shows an empty frame */}
        {(Object.keys(PHOTOS) as AuthMode[]).map((key) => (
          <motion.img
            key={key}
            src={unsplash(PHOTOS[key].id, 1600)}
            srcSet={unsplashSrcSet(PHOTOS[key].id)}
            sizes="50vw"
            alt={key === mode ? PHOTOS[key].alt : ''}
            aria-hidden={key !== mode}
            className="absolute inset-0 h-full w-full object-cover"
            initial={false}
            animate={{ opacity: key === mode ? 1 : 0, scale: key === mode ? 1 : 1.06 }}
            transition={{ duration: 1.1, ease: easeOutExpo }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-paper xl:p-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={mode}
              className="type-title max-w-md"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
            >
              {photo.caption}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col justify-center px-5 pb-16 pt-28 sm:px-10 lg:px-14 lg:pt-32 xl:px-20">
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
