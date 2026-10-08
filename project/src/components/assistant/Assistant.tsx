import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { assistantAvailable } from '../../lib/assistant/client';
import { useAssistantStore } from '../../stores/assistantStore';
import { useCartUi } from '../../stores/cartUi';
import AssistantLauncher from './AssistantLauncher';
import AssistantPanel from './AssistantPanel';

// Focused pages keep the visitor on the task at hand.
const HIDDEN_ON = ['/entrar', '/checkout'];

/** The help chat: a button in the corner that opens the conversation. */
const Assistant = () => {
  const { pathname } = useLocation();
  const isOpen = useAssistantStore((state) => state.isOpen);
  const cartOpen = useCartUi((state) => state.isOpen);

  if (!assistantAvailable || HIDDEN_ON.includes(pathname)) return null;

  return (
    <>
      <AssistantLauncher hidden={isOpen || cartOpen} />
      <AnimatePresence>{isOpen && <AssistantPanel key="assistente" />}</AnimatePresence>
    </>
  );
};

export default Assistant;
