import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import PhotoScreen from '../PhotoScreen';
import ChatScreen from './ChatScreen';
import { useChatScript, type Step } from './chatScript';
import { SOFA } from './photos';

// One script per question, so a new choice in the list replays the conversation.
const useStep = (question: string, answer: string) => {
  const [steps, setSteps] = useState<Step[]>([]);
  useEffect(() => {
    setSteps([
      { type: 'compose', text: question, duration: 1400 },
      { type: 'send' },
      { type: 'ticks', value: 2, after: 350 },
      { type: 'ticks', value: 3, after: 450 },
      { type: 'typing', duration: 1300 },
      { type: 'reply', text: answer },
    ]);
  }, [question, answer]);
  return steps;
};

/** FAQ: the phone on the sofa sends the question that is open in the list and gets the answer. */
const FaqPhone = ({ question, answer }: { question: string; answer: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '0px 0px -15% 0px' });
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);

  const steps = useStep(question, answer);
  const state = useChatScript(steps, seen, false);

  return (
    <div ref={ref}>
      <PhotoScreen
        src="/images/blog/telemovel-sofa-1200.jpg"
        srcSet="/images/blog/telemovel-sofa-700.jpg 700w, /images/blog/telemovel-sofa-1200.jpg 1200w"
        sizes="(min-width: 1024px) 600px, 100vw"
        alt="Pessoa no sofá a receber no telemóvel a resposta da Rhulany Tech"
        photo={SOFA}
        aspect={4 / 5}
        zoom={2.6}
        focus={{ x: 0.567, y: 0.377 }}
        className="rounded-[28px] bg-mist"
      >
        <ChatScreen state={state} />
      </PhotoScreen>
    </div>
  );
};

export default FaqPhone;
