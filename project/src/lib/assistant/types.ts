/*
 * Contract between the site and the assistant backend, which holds the actual "brain".
 *
 * The site sends one POST (JSON, AssistantRequest) per visitor message. The backend answers either
 * as a stream, Content-Type application/x-ndjson with one AssistantEvent per line (text arrives as it
 * is written), or in one go, Content-Type application/json with an AssistantReply.
 */

export interface AssistantTurn {
  role: 'user' | 'assistant';
  text: string;
}

export interface AssistantRequest {
  /** Random id kept for the browser session, so the backend can tie a conversation together. */
  sessionId: string;
  /** The conversation so far, oldest first; the last entry is the visitor's new message. */
  messages: AssistantTurn[];
  /** Where the visitor is and what is in the cart, so answers can take them into account. */
  context: {
    path: string;
    cart: { id: string; name: string; price: number; quantity: number }[];
  };
}

/** A link shown as a button under a reply, e.g. "Falar no WhatsApp" or a filtered shop page. */
export interface AssistantAction {
  label: string;
  href: string;
}

/** One piece of a streamed reply. */
export type AssistantEvent =
  | { type: 'text'; delta: string }
  /** Catalogue product ids, shown as cards with photo and price. */
  | { type: 'products'; ids: string[] }
  /** Short replies the visitor can tap to continue. */
  | { type: 'suggestions'; items: string[] }
  | ({ type: 'action' } & AssistantAction)
  | { type: 'done' };

/** A whole reply, for backends that answer in one go. */
export interface AssistantReply {
  text: string;
  products?: string[];
  suggestions?: string[];
  actions?: AssistantAction[];
}
