import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { STORE } from '../../data/store';
import { PROVINCES } from '../../lib/checkout';
import { SelectField, TextAreaField, TextField } from '../ui/Field';
import ChoiceCard from './ChoiceCard';
import { primaryButton } from './styles';
import type { DeliveryDetails, FormErrorsProps } from './types';

const METHODS = [
  { id: 'entrega', title: 'Entrega ao domicílio', note: 'Em todo o país, com o custo confirmado antes do envio' },
  { id: 'levantamento', title: 'Levantar na loja', note: `${STORE.address}, grátis` },
] as const;

const swap = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3 },
};

interface DeliveryFormProps extends FormErrorsProps {
  delivery: DeliveryDetails;
  onChange: (delivery: DeliveryDetails) => void;
  onSubmit: (event: FormEvent) => void;
}

/** Checkout step 2: home delivery with the address, or collection at the shop. */
const DeliveryForm = ({ delivery, onChange, onSubmit, errors, clearError }: DeliveryFormProps) => {
  const set = (changes: Partial<DeliveryDetails>, field?: string) => {
    onChange({ ...delivery, ...changes });
    if (field) clearError(field);
  };

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      <div role="radiogroup" aria-label="Forma de entrega" className="grid gap-3 sm:grid-cols-2">
        {METHODS.map((option) => (
          <ChoiceCard
            key={option.id}
            title={option.title}
            note={option.note}
            selected={delivery.method === option.id}
            onSelect={() => set({ method: option.id })}
            layoutId="entrega-escolha"
          />
        ))}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {delivery.method === 'entrega' ? (
          <motion.div key="morada" className="space-y-4" {...swap}>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Província"
                value={delivery.province}
                onChange={(event) => set({ province: event.target.value })}
              >
                {PROVINCES.map((province) => (
                  <option key={province}>{province}</option>
                ))}
              </SelectField>
              <TextField
                label="Cidade ou distrito"
                autoComplete="address-level2"
                value={delivery.city}
                onChange={(event) => set({ city: event.target.value }, 'city')}
                error={errors.city}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Bairro"
                value={delivery.neighbourhood}
                onChange={(event) => set({ neighbourhood: event.target.value }, 'neighbourhood')}
                error={errors.neighbourhood}
                placeholder="Por exemplo, Sommerschield"
              />
              <TextField
                label="Rua e número"
                optional
                autoComplete="address-line1"
                value={delivery.street}
                onChange={(event) => set({ street: event.target.value })}
                placeholder="Av. Julius Nyerere, 1234"
              />
            </div>
            <TextField
              label="Ponto de referência"
              value={delivery.reference}
              onChange={(event) => set({ reference: event.target.value }, 'reference')}
              error={errors.reference}
              placeholder="Perto da escola, prédio azul, segundo andar"
            />
            <TextAreaField
              label="Notas para a entrega"
              optional
              value={delivery.notes}
              onChange={(event) => set({ notes: event.target.value })}
              placeholder="Horário preferido ou outra indicação"
            />
          </motion.div>
        ) : (
          <motion.div key="loja" className="rounded-2xl bg-paper p-5 text-sm leading-relaxed text-ink/65" {...swap}>
            <p className="font-medium text-ink">{STORE.address}</p>
            <p className="mt-1">{STORE.hours}. Contactamos consigo quando a encomenda estiver pronta a levantar</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-2">
        <button type="submit" className={primaryButton}>
          Continuar para o pagamento
        </button>
      </div>
    </form>
  );
};

export default DeliveryForm;
