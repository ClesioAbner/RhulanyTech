import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { ChatMessage } from '../../stores/assistantStore';
import ChatMessageView from './ChatMessageView';

const show = (message: ChatMessage, isLast = true) => {
  const handlers = { onSuggestion: vi.fn(), onRetry: vi.fn(), onFollow: vi.fn() };
  render(
    <MemoryRouter>
      <ChatMessageView message={message} isLast={isLast} handoffHref="https://wa.me/258879596862" {...handlers} />
    </MemoryRouter>,
  );
  return { ...handlers, user: userEvent.setup() };
};

describe('mensagens do chat', () => {
  it('mostra os produtos sugeridos com nome, preço e ligação à página', () => {
    show({ id: '1', role: 'assistant', text: 'Veja este.', products: ['39'] });
    const card = screen.getByRole('link', { name: /iPhone 17 Pro/ });
    expect(card).toHaveAttribute('href', '/produto/iphone-17-pro');
    expect(card).toHaveTextContent(/Desde 140\s000\sMT/);
  });

  it('envia a sugestão escolhida', async () => {
    const { onSuggestion, user } = show({
      id: '1',
      role: 'assistant',
      text: 'Qual o orçamento?',
      suggestions: ['Até 60 000 MT'],
    });
    await user.click(screen.getByRole('button', { name: 'Até 60 000 MT' }));
    expect(onSuggestion).toHaveBeenCalledWith('Até 60 000 MT');
  });

  it('só mostra sugestões na mensagem mais recente', () => {
    show({ id: '1', role: 'assistant', text: 'Antiga.', suggestions: ['Até 60 000 MT'] }, false);
    expect(screen.queryByRole('button', { name: 'Até 60 000 MT' })).not.toBeInTheDocument();
  });

  it('mostra "A escrever" enquanto a resposta não chega', () => {
    show({ id: '1', role: 'assistant', text: '', status: 'streaming' });
    expect(screen.getByText('A escrever')).toBeInTheDocument();
  });

  it('numa falha, deixa tentar de novo ou falar no WhatsApp', async () => {
    const { onRetry, user } = show({ id: '1', role: 'assistant', text: '', status: 'error' });
    expect(screen.getByText(/Não consegui responder agora/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Falar no WhatsApp' })).toHaveAttribute('href', 'https://wa.me/258879596862');
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(onRetry).toHaveBeenCalled();
  });
});
