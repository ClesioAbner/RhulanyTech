import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Composer from './Composer';

const setup = (busy = false) => {
  const onSend = vi.fn();
  const view = render(<Composer busy={busy} onSend={onSend} />);
  return {
    onSend,
    view,
    user: userEvent.setup(),
    box: screen.getByLabelText('Mensagem para o assistente'),
    send: screen.getByRole('button', { name: 'Enviar' }),
  };
};

describe('caixa de mensagem do chat', () => {
  it('só deixa enviar quando há texto', async () => {
    const { user, box, send } = setup();
    expect(send).toBeDisabled();
    await user.type(box, 'Olá');
    expect(send).toBeEnabled();
  });

  it('envia com Enter e limpa a caixa', async () => {
    const { user, box, onSend } = setup();
    await user.type(box, 'Têm o iPhone 17 Pro?{Enter}');
    expect(onSend).toHaveBeenCalledWith('Têm o iPhone 17 Pro?');
    expect(box).toHaveValue('');
  });

  it('muda de linha com Shift+Enter sem enviar', async () => {
    const { user, box, onSend } = setup();
    await user.type(box, 'linha 1{Shift>}{Enter}{/Shift}linha 2');
    expect(onSend).not.toHaveBeenCalled();
    expect(box).toHaveValue('linha 1\nlinha 2');
  });

  it('não envia enquanto a resposta anterior ainda está a chegar', async () => {
    const { user, box, send, onSend } = setup(true);
    await user.type(box, 'Outra pergunta{Enter}');
    expect(send).toBeDisabled();
    expect(onSend).not.toHaveBeenCalled();
  });
});
