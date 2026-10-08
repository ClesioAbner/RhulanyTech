import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { formatMobile } from '../../lib/checkout';
import { TextField } from '../ui/Field';
import { primaryButton } from './styles';
import type { ContactDetails, FormErrorsProps } from './types';

interface ContactFormProps extends FormErrorsProps {
  contact: ContactDetails;
  onChange: (contact: ContactDetails) => void;
  onSubmit: (event: FormEvent) => void;
  /** Signed-in customers already have their details filled in. */
  signedIn: boolean;
}

/** Checkout step 1: who receives the order. */
const ContactForm = ({ contact, onChange, onSubmit, signedIn, errors, clearError }: ContactFormProps) => (
  <form noValidate onSubmit={onSubmit} className="space-y-4">
    {!signedIn && (
      <p className="rounded-2xl bg-paper px-5 py-4 text-sm text-ink/65">
        Já tem conta?{' '}
        <Link to="/entrar?voltar=/checkout" className="link-underline font-medium text-ink">
          Entre
        </Link>{' '}
        para usar os seus dados guardados
      </p>
    )}
    <TextField
      label="Nome completo"
      autoComplete="name"
      value={contact.name}
      onChange={(event) => {
        onChange({ ...contact, name: event.target.value });
        clearError('name');
      }}
      error={errors.name}
      placeholder="Nome e apelido"
    />
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={contact.email}
        onChange={(event) => {
          onChange({ ...contact, email: event.target.value });
          clearError('email');
        }}
        error={errors.email}
        placeholder="nome@exemplo.com"
      />
      <TextField
        label="Telemóvel"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        leading="+258"
        value={contact.phone}
        onChange={(event) => {
          onChange({ ...contact, phone: formatMobile(event.target.value) });
          clearError('phone');
        }}
        error={errors.phone}
        placeholder="84 123 4567"
      />
    </div>
    <div className="pt-2">
      <button type="submit" className={primaryButton}>
        Continuar para a entrega
      </button>
    </div>
  </form>
);

export default ContactForm;
