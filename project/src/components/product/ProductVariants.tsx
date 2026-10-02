import { motion } from 'framer-motion';
import type { CatalogProduct } from '../../lib/catalog';
import { formatPrice } from '../../lib/format';
import { easeOutExpo } from '../../lib/motion';

interface ProductVariantsProps {
  product: CatalogProduct;
  finishIndex: number;
  optionIndex: number;
  onFinishChange: (index: number) => void;
  onOptionChange: (index: number) => void;
}

const ProductVariants = ({ product, finishIndex, optionIndex, onFinishChange, onOptionChange }: ProductVariantsProps) => {
  const finish = product.finishes[finishIndex];

  return (
    <div className="space-y-8">
      {product.finishes.length > 0 && (
        <fieldset>
          <legend className="text-sm">
            <span className="text-ink/55">Acabamento</span>{' '}
            <span className="font-medium">{finish?.name}</span>
          </legend>
          <div role="radiogroup" aria-label="Acabamento" className="mt-4 flex flex-wrap gap-3">
            {product.finishes.map((item, index) => {
              const isActive = index === finishIndex;
              return (
                <button
                  key={item.name}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={item.name}
                  title={item.name}
                  onClick={() => onFinishChange(index)}
                  className={`grid h-10 w-10 place-items-center rounded-full ring-1 transition-all duration-300 ${
                    isActive ? 'ring-ink' : 'ring-transparent hover:ring-ink/25'
                  }`}
                >
                  <span
                    className="h-7 w-7 rounded-full ring-1 ring-inset ring-ink/15"
                    style={{ backgroundColor: item.hex }}
                  />
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {product.option && (
        <fieldset>
          <legend className="text-sm text-ink/55">{product.option.name}</legend>
          <div role="radiogroup" aria-label={product.option.name} className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {product.option.choices.map((choice, index) => {
              const isActive = index === optionIndex;
              return (
                <button
                  key={choice.label}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => onOptionChange(index)}
                  className={`relative isolate rounded-2xl border px-4 py-3.5 text-left transition-colors duration-300 ${
                    isActive ? 'border-ink' : 'border-ink/15 hover:border-ink/40'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId={`option-${product.id}`}
                      className="absolute inset-0 -z-10 rounded-2xl bg-ink/[0.04]"
                      transition={{ duration: 0.4, ease: easeOutExpo }}
                    />
                  )}
                  <span className="block font-medium">{choice.label}</span>
                  <span className="mt-0.5 block text-xs tabular-nums text-ink/50">
                    {choice.priceDelta > 0 ? `+ ${formatPrice(choice.priceDelta)}` : 'Incluído'}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
};

export default ProductVariants;
