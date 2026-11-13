import { useRef } from 'react';
import { useInView } from 'framer-motion';
import PhotoScreen from '../PhotoScreen';
import AirFront from './AirFront';
import ChatScreen, { type ChatGroup } from './ChatScreen';
import { useChatScript, type Step } from './chatScript';
import { HAND } from './photos';

// The friends' group: Ivan Mombi wants to chip in for Kiba's album and asks where to buy speakers;
// Clesio (the phone's owner) recommends the store with a sticker. Edilson Malache always ends with a
// full stop; João signs off with "lets goo" or "GG".
const GOAT: ChatGroup = {
  name: "G.O.A.T 's",
  photo: '/images/ajuda/goat-grupo.png',
  members: {
    'Edilson Malache': '#1d8fd1',
    'Ivan Mombi': '#1a9e4b',
    'João Roberto': '#d6337e',
  },
};

const HELP_STEPS: Step[] = [
  { type: 'typing', name: 'Ivan Mombi', duration: 1400 },
  { type: 'reply', name: 'Ivan Mombi', text: 'Bro, vamos lá juntar 100 mts cada gajo, compramos o álbum Tio Santos do Kiba' },
  { type: 'typing', name: 'Ivan Mombi', duration: 1200 },
  { type: 'reply', name: 'Ivan Mombi', text: 'Edjo, preciso de uma loja onde vendem colunas para escutar o álbum 🔊' },
  { type: 'typing', name: 'Edilson Malache', duration: 1000 },
  { type: 'reply', name: 'Edilson Malache', text: 'Boa pergunta, também quero saber.' },
  { type: 'typing', name: 'João Roberto', duration: 900 },
  { type: 'reply', name: 'João Roberto', text: 'Kiba no volume máximo, lets goo 🔥' },
  { type: 'compose', text: 'Rhulany Tech, meus. Colunas originais com garantia e entregam em casa', duration: 2200 },
  { type: 'send' },
  { type: 'ticks', value: 3, after: 500 },
  { type: 'sticker', src: '/images/ajuda/sticker-recomendo.png', alt: 'Sticker de um amigo a sorrir' },
  { type: 'typing', name: 'Ivan Mombi', duration: 1000 },
  { type: 'reply', name: 'Ivan Mombi', text: 'Vou já ver, valeu brada 🙌' },
  { type: 'typing', name: 'Edilson Malache', duration: 1100 },
  { type: 'reply', name: 'Edilson Malache', text: 'Mandem os 100 mts no meu M-Pesa.' },
  { type: 'typing', name: 'João Roberto', duration: 800 },
  { type: 'reply', name: 'João Roberto', text: 'Já mandei, GG 🎮' },
  { type: 'wait', duration: 6000 },
];

/** Help: a WhatsApp group conversation that ends with the store recommended, played while on screen. */
const HelpPhone = ({ variant }: { variant: 'wide' | 'compact' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '0px 0px -20% 0px' });
  const state = useChatScript(HELP_STEPS, inView, true);
  const wide = variant === 'wide';

  return (
    <div ref={ref}>
      <PhotoScreen
        src="/images/blog/telemovel-mao-1400.png"
        srcSet="/images/blog/telemovel-mao-800.png 800w, /images/blog/telemovel-mao-1400.png 1400w"
        sizes={wide ? '(min-width: 1360px) 1264px, 100vw' : '100vw'}
        alt="Mão a segurar um iPhone Air com um grupo de WhatsApp onde um amigo recomenda a Rhulany Tech"
        photo={HAND}
        aspect={wide ? HAND.width / HAND.height : 4 / 5}
        zoom={wide ? 1 : 2.5}
        focus={wide ? undefined : { x: 0.676, y: 0.477 }}
      >
        <AirFront>
          <ChatScreen state={state} group={GOAT} />
        </AirFront>
      </PhotoScreen>
    </div>
  );
};

export default HelpPhone;
