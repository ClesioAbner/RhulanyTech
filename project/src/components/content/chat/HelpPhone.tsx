import { useRef } from 'react';
import { useInView } from 'framer-motion';
import PhotoScreen from '../PhotoScreen';
import AirFront from './AirFront';
import ChatScreen from './ChatScreen';
import { useChatScript, type Step } from './chatScript';
import { HAND } from './photos';

// The store opens the conversation.
const HELP_STEPS: Step[] = [
  { type: 'typing', duration: 1100 },
  { type: 'reply', text: 'Bro! 👋 Aqui é a Rhulany Tech. Em que te podemos ajudar?' },
  { type: 'compose', text: 'Epá bro, preciso de help 🙏', duration: 1000 },
  { type: 'send' },
  { type: 'ticks', value: 2, after: 300 },
  { type: 'ticks', value: 3, after: 400 },
  { type: 'compose', text: 'O meu laptop está a aquecer muito mal, meu chefe. A ventoinha até parece avião 😅', duration: 2400 },
  { type: 'send' },
  { type: 'ticks', value: 3, after: 600 },
  { type: 'typing', duration: 1500 },
  { type: 'reply', text: 'Fr bro! 😂 Estás a usar o gajo em cima da cama ou no sofá?' },
  { type: 'compose', text: 'Às vezes na cama', duration: 800 },
  { type: 'send' },
  { type: 'ticks', value: 3, after: 500 },
  { type: 'typing', duration: 1600 },
  { type: 'reply', text: 'Aí está! Assim tapas as entradas de ar. Usa-o numa mesa ou num suporte' },
  { type: 'typing', duration: 1300 },
  { type: 'reply', text: 'Se continuar, passa cá na loja e fazemos uma limpeza por dentro 👌' },
  { type: 'compose', text: 'Tá nice bro, amanhã passo aí. Valeu brada! 🔥', duration: 1500 },
  { type: 'send' },
  { type: 'ticks', value: 3, after: 500 },
  { type: 'react', emoji: '👍', after: 700 },
  { type: 'typing', duration: 1000 },
  { type: 'reply', text: 'Estamos à tua espera 👊' },
  { type: 'wait', duration: 6000 },
];

/** Help: a WhatsApp conversation with the store plays out while it is on screen. */
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
        alt="Mão a segurar um iPhone Air com uma conversa de WhatsApp com a Rhulany Tech"
        photo={HAND}
        aspect={wide ? HAND.width / HAND.height : 4 / 5}
        zoom={wide ? 1 : 2.5}
        focus={wide ? undefined : { x: 0.676, y: 0.477 }}
      >
        <AirFront>
          <ChatScreen state={state} />
        </AirFront>
      </PhotoScreen>
    </div>
  );
};

export default HelpPhone;
