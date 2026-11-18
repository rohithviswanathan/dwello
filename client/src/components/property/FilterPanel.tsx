import { motion } from "motion/react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

export interface PropertyFilters {
  minRent: string;
  maxRent: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  furnishing: string;
}

interface FilterPanelProps {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
  onApply: () => void;
  onReset: () => void;
  className?: string;
}

const propertyTypes = ["Apartment", "Independent House", "Villa", "Studio"];

const bedroomOptions = ["1", "2", "3", "4", "5+"];

const bathroomOptions = ["1", "2", "3", "4+"];

const furnishingOptions = ["Fully furnished", "Semi-furnished", "Unfurnished"];

function FilterPanel({
  filters,
  onChange,
  onApply,
  onReset,
  className = "",
}: FilterPanelProps) {
  const updateFilter = (key: keyof PropertyFilters, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const selectedCount = Object.values(filters).filter(
    (value) => value !== "",
  ).length;

  const renderOptions = (
    options: string[],
    selected: string,
    onSelect: (value: string) => void,
  ) => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected === option;

        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(active ? "" : option)}
            className={`
              rounded-lg border px-3 py-2
              text-xs font-bold transition-all duration-200
              ${
                active
                  ? "border-brand bg-brand-light text-brand"
                  : "border-border bg-white text-ink-secondary hover:border-brand/40 hover:text-brand"
              }
            `}
          >
            {option}
          </button>
        );
      })}
    </div>
  );

  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`
        w-full rounded-xl border border-border
        bg-white shadow-soft
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={17} className="text-brand" />

          <h3 className="text-sm font-extrabold text-ink">Filters</h3>

          {selectedCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-light px-1.5 text-[10px] font-extrabold text-brand">
              {selectedCount}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={selectedCount === 0}
          className="
            inline-flex items-center gap-1.5
            text-xs font-bold text-muted
            transition-colors duration-200
            hover:text-brand
            disabled:cursor-not-allowed disabled:opacity-40
            disabled:hover:text-muted
          "
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div className="space-y-5 p-4">
        {/* Rent range */}
        <section>
          <h4 className="mb-3 text-xs font-extrabold text-ink">Monthly rent</h4>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold text-muted">
                Minimum (₹)
              </span>

              <input
                type="number"
                min="0"
                value={filters.minRent}
                onChange={(event) =>
                  updateFilter("minRent", event.target.value)
                }
                placeholder="e.g. 10000"
                className="
                  w-full rounded-lg border border-border
                  bg-white px-3 py-2.5 text-sm font-semibold
                  text-ink outline-none transition-all
                  placeholder:font-medium placeholder:text-subtle
                  focus:border-brand focus:ring-2 focus:ring-brand/10
                "
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold text-muted">
                Maximum (₹)
              </span>

              <input
                type="number"
                min="0"
                value={filters.maxRent}
                onChange={(event) =>
                  updateFilter("maxRent", event.target.value)
                }
                placeholder="e.g. 30000"
                className="
                  w-full rounded-lg border border-border
                  bg-white px-3 py-2.5 text-sm font-semibold
                  text-ink outline-none transition-all
                  placeholder:font-medium placeholder:text-subtle
                  focus:border-brand focus:ring-2 focus:ring-brand/10
                "
              />
            </label>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Property type */}
        <section>
          <h4 className="mb-3 text-xs font-extrabold text-ink">
            Property type
          </h4>

          {renderOptions(propertyTypes, filters.propertyType, (value) =>
            updateFilter("propertyType", value),
          )}
        </section>

        <div className="border-t border-border" />

        {/* Bedrooms */}
        <section>
          <h4 className="mb-3 text-xs font-extrabold text-ink">Bedrooms</h4>

          {renderOptions(bedroomOptions, filters.bedrooms, (value) =>
            updateFilter("bedrooms", value),
          )}
        </section>

        <div className="border-t border-border" />

        {/* Bathrooms */}
        <section>
          <h4 className="mb-3 text-xs font-extrabold text-ink">Bathrooms</h4>

          {renderOptions(bathroomOptions, filters.bathrooms, (value) =>
            updateFilter("bathrooms", value),
          )}
        </section>

        <div className="border-t border-border" />

        {/* Furnishing */}
        <section>
          <h4 className="mb-3 text-xs font-extrabold text-ink">Furnishing</h4>

          {renderOptions(furnishingOptions, filters.furnishing, (value) =>
            updateFilter("furnishing", value),
          )}
        </section>
      </div>

      {/* Footer actions */}
      <div className="border-t border-border p-4">
        <button
          type="button"
          onClick={onApply}
          className="
            flex w-full items-center justify-center
            rounded-lg bg-brand px-4 py-3
            text-sm font-extrabold text-white
            shadow-soft transition-all duration-200
            hover:bg-brand-dark hover:shadow-card
            active:scale-[0.99]
          "
        >
          Apply filters
        </button>
      </div>
    </motion.aside>
  );
}

export default FilterPanel;
