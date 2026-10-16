import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import PhotoScreen from '../PhotoScreen';
import ChatScreen from './ChatScreen';
import { useChatScript, type Step } from './chatScript';
import { TILTED } from './photos';

// Asked first, then recommended: the right phone for the use, not the most expensive (prices from the catalogue).
const ADVICE_STEPS: Step[] = [
  { type: 'compose', text: 'Boa tarde! Procuro um telemóvel bom para fotografias, até 100 mil', duration: 2200 },
  { type: 'send' },
  { type: 'ticks', value: 2, after: 300 },
  { type: 'ticks', value: 3, after: 450 },
  { type: 'typing', duration: 1300 },
  { type: 'reply', text: 'Boa tarde! Fotografa mais pessoas ou paisagens?' },
  { type: 'compose', text: 'Mais a família, e muitos vídeos dos miúdos', duration: 1600 },
  { type: 'send' },
  { type: 'ticks', value: 3, after: 500 },
  { type: 'typing', duration: 1700 },
  {
    type: 'reply',
    text: 'Então não precisa de um Pro. O iPhone 15 tem câmara de 48MP, grava vídeos excelentes e custa 90\u00a0000\u00a0MT',
  },
  { type: 'typing', duration: 1200 },
  { type: 'reply', text: 'Fica com margem para uma capa e um carregador 👌' },
  { type: 'compose', text: 'Perfeito, amanhã passo na loja', duration: 1200 },
  { type: 'send' },
  { type: 'ticks', value: 3, after: 500 },
  { type: 'react', emoji: '👍', after: 700 },
];

/** About, "Aconselhamento honesto": a customer asks on WhatsApp and gets the honest recommendation. */
const AdvicePhone = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '0px 0px -20% 0px' });
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);
  const state = useChatScript(ADVICE_STEPS, seen, false);

  return (
    <div ref={ref}>
      <PhotoScreen
        src="/images/telemovel/mao-inclinado-960.jpg"
        srcSet="/images/telemovel/mao-inclinado-600.jpg 600w, /images/telemovel/mao-inclinado-960.jpg 960w"
        sizes="(min-width: 1024px) 740px, 100vw"
        alt="Mão a segurar um telemóvel com uma conversa no WhatsApp com a Rhulany Tech a recomendar um modelo"
        photo={TILTED}
        aspect={4 / 3}
        focus={{ x: 0.5, y: 0.435 }}
      >
        <ChatScreen state={state} />
      </PhotoScreen>
    </div>
  );
};

export default AdvicePhone;
