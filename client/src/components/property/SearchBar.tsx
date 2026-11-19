import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Search, X, ArrowRight } from "lucide-react";

interface SearchSuggestion {
  label: string;
  description?: string;
}

interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch: (location: string) => void;
  suggestions?: SearchSuggestion[];
  placeholder?: string;
  loading?: boolean;
  className?: string;
}

function SearchBar({
  value,
  defaultValue = "",
  onChange,
  onSearch,
  suggestions = [],
  placeholder = "Enter city, locality or neighbourhood",
  loading = false,
  className = "",
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);

  const isControlled = value !== undefined;
  const searchValue = isControlled ? value : internalValue;

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.label.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const showSuggestions =
    focused && searchValue.trim().length > 0 && filteredSuggestions.length > 0;

  const updateValue = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const location = searchValue.trim();

    if (!location || loading) return;

    setFocused(false);
    onSearch(location);
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    updateValue(suggestion.label);
    setFocused(false);
    onSearch(suggestion.label);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        relative z-20 flex w-full flex-col gap-2
        rounded-xl border border-border bg-white p-2
        shadow-card transition-all duration-200
        focus-within:border-brand/40
        focus-within:shadow-[0_0_0_4px_rgba(217,54,54,0.07)]
        sm:flex-row sm:items-center
        ${className}
      `}
    >
      {/* Location input */}
      <div className="relative flex min-w-0 flex-1 items-center gap-3 px-3 py-2">
        <MapPin size={20} strokeWidth={1.8} className="shrink-0 text-brand" />

        <div className="min-w-0 flex-1">
          <input
            id="dwello-location-search"
            type="text"
            value={searchValue}
            onChange={(event) => updateValue(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              window.setTimeout(() => setFocused(false), 150);
            }}
            placeholder={placeholder}
            autoComplete="off"
            className="
              w-full min-w-0 border-0 bg-transparent p-0
              text-sm font-semibold text-ink outline-none
              placeholder:font-medium placeholder:text-subtle
              focus:border-0 focus:outline-none focus:ring-0
            "
          />
        </div>

        {searchValue && (
          <button
            type="button"
            onClick={() => updateValue("")}
            aria-label="Clear location"
            className="
              flex h-7 w-7 shrink-0 items-center justify-center
              rounded-full text-muted transition-colors
              hover:bg-surface-muted hover:text-ink
            "
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="
              absolute left-0 right-0 top-full mt-2
              overflow-hidden rounded-xl border border-border
              bg-white p-2 shadow-dropdown
            "
          >
            <p className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-muted">
              Suggested locations
            </p>

            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                onClick={() => handleSuggestionSelect(suggestion)}
                className="
                  flex w-full items-center gap-3 rounded-lg
                  px-3 py-2.5 text-left transition-colors
                  hover:bg-brand-light
                "
              >
                <MapPin size={16} className="shrink-0 text-brand" />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-ink">
                    {suggestion.label}
                  </span>

                  {suggestion.description && (
                    <span className="mt-0.5 block truncate text-xs text-muted">
                      {suggestion.description}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search button */}
      <motion.button
        type="submit"
        disabled={!searchValue.trim() || loading}
        whileHover={!loading && searchValue.trim() ? { y: -1 } : undefined}
        whileTap={!loading && searchValue.trim() ? { scale: 0.98 } : undefined}
        className="
          flex shrink-0 items-center justify-center gap-2
          rounded-lg bg-brand px-6 py-3
          text-sm font-extrabold text-white
          shadow-soft transition-colors duration-200
          hover:bg-brand-dark
          disabled:cursor-not-allowed disabled:opacity-45
          disabled:hover:bg-brand
          sm:min-w-[130px]
        "
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Searching
          </>
        ) : (
          <>
            <Search size={17} />
            Search
            <ArrowRight size={15} />
          </>
        )}
      </motion.button>
    </form>
  );
}

export default SearchBar;
