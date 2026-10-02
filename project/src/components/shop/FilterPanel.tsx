import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../../data/products';
import { easeOutExpo } from '../../lib/motion';
import { CATEGORY_LABELS, PRICE_RANGES, type ShopFilters, type facetCounts } from '../../lib/shopFilters';

interface FilterPanelProps {
  filters: ShopFilters;
  counts: ReturnType<typeof facetCounts>;
  brands: string[];
  onChange: (next: Partial<ShopFilters>) => void;
  /** Distinguishes the shared-layout highlight between the sidebar and the mobile drawer. */
  layoutScope: string;
}

const Group = ({ title, children }: { title: string; children: ReactNode }) => {
  const id = `filtro-${title.toLowerCase().replace(/s+/g, '-')}`;
  return (
    <div role="group" aria-labelledby={id} className="border-t border-ink/10 py-6 first:border-t-0 first:pt-0">
      <h3 id={id} className="mb-3 px-3 text-xs font-medium uppercase tracking-[0.16em] text-ink/45">
        {title}
      </h3>
      {children}
    </div>
  );
};

interface OptionProps {
  label: string;
  count?: number;
  selected: boolean;
  onSelect: () => void;
  kind: 'single' | 'multiple';
  layoutId?: string;
}

// A row in a facet list: the label, its result count, and a drawn selection mark (no icon fonts).
const Option = ({ label, count, selected, onSelect, kind, layoutId }: OptionProps) => {
  const disabled = count === 0 && !selected;
  return (
    <button
      type="button"
      role={kind === 'single' ? 'radio' : 'checkbox'}
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-35 ${
        selected ? 'text-ink' : 'text-ink/65 hover:text-ink'
      }`}
    >
      {selected && layoutId && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 -z-10 rounded-lg bg-ink/[0.05]"
          transition={{ duration: 0.45, ease: easeOutExpo }}
        />
      )}
      <span
        aria-hidden="true"
        className={`grid h-4 w-4 shrink-0 place-items-center border transition-colors duration-300 ${
          kind === 'single' ? 'rounded-full' : 'rounded-[4px]'
        } ${selected ? 'border-ink bg-ink' : 'border-ink/25 group-hover:border-ink/50'}`}
      >
        <span
          className={`bg-paper transition-transform duration-300 ease-out-expo ${
            kind === 'single' ? 'h-1.5 w-1.5 rounded-full' : 'h-1.5 w-1.5 rounded-[1px]'
          } ${selected ? 'scale-100' : 'scale-0'}`}
        />
      </span>
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="tabular-nums text-ink/40">{count}</span>}
    </button>
  );
};

const FilterPanel = ({ filters, counts, brands, onChange, layoutScope }: FilterPanelProps) => {
  const categories = Object.keys(CATEGORY_LABELS) as Product['category'][];

  return (
    <div>
      <Group title="Categoria">
        <div role="radiogroup" aria-label="Categoria" className="isolate space-y-0.5">
          <Option
            kind="single"
            label="Todas"
            selected={filters.category === null}
            onSelect={() => onChange({ category: null })}
            layoutId={`${layoutScope}-category`}
          />
          {categories
            .filter((id) => (counts.category[id] ?? 0) > 0 || filters.category === id)
            .map((id) => (
              <Option
                key={id}
                kind="single"
                label={CATEGORY_LABELS[id]}
                count={counts.category[id] ?? 0}
                selected={filters.category === id}
                onSelect={() => onChange({ category: id })}
                layoutId={`${layoutScope}-category`}
              />
            ))}
        </div>
      </Group>

      <Group title="Marca">
        <div className="space-y-0.5">
          {brands.map((brand) => {
            const selected = filters.brands.includes(brand);
            return (
              <Option
                key={brand}
                kind="multiple"
                label={brand}
                count={counts.brands[brand] ?? 0}
                selected={selected}
                onSelect={() =>
                  onChange({
                    brands: selected ? filters.brands.filter((b) => b !== brand) : [...filters.brands, brand],
                  })
                }
              />
            );
          })}
        </div>
      </Group>

      <Group title="Preço">
        <div role="radiogroup" aria-label="Preço" className="isolate space-y-0.5">
          <Option
            kind="single"
            label="Qualquer preço"
            selected={filters.price === null}
            onSelect={() => onChange({ price: null })}
            layoutId={`${layoutScope}-price`}
          />
          {PRICE_RANGES.map((range) => (
            <Option
              key={range.id}
              kind="single"
              label={range.label}
              count={counts.price[range.id] ?? 0}
              selected={filters.price === range.id}
              onSelect={() => onChange({ price: range.id })}
              layoutId={`${layoutScope}-price`}
            />
          ))}
        </div>
      </Group>

      <Group title="Disponibilidade">
        <button
          type="button"
          role="switch"
          aria-checked={filters.inStockOnly}
          onClick={() => onChange({ inStockOnly: !filters.inStockOnly })}
          className="flex w-full items-center justify-between gap-4 px-3 py-2 text-sm"
        >
          <span className={filters.inStockOnly ? 'text-ink' : 'text-ink/65'}>
            Apenas em stock <span className="tabular-nums text-ink/40">({counts.inStock})</span>
          </span>
          <span
            aria-hidden="true"
            className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-300 ${
              filters.inStockOnly ? 'bg-ink' : 'bg-ink/15'
            }`}
          >
            <motion.span
              className="absolute top-1 h-4 w-4 rounded-full bg-paper shadow-sm"
              animate={{ left: filters.inStockOnly ? 20 : 4 }}
              transition={{ duration: 0.35, ease: easeOutExpo }}
            />
          </span>
        </button>
      </Group>
    </div>
  );
};

export default FilterPanel;
