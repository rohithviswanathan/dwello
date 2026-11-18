import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

type SelectSize = "sm" | "md" | "lg";

interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  selectSize?: SelectSize;
}

const sizeStyles: Record<SelectSize, string> = {
  sm: "h-10 text-xs",
  md: "h-12 text-sm",
  lg: "h-14 text-base",
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      placeholder = "Select an option",
      selectSize = "md",
      id,
      disabled = false,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const messageId = `${selectId}-message`;

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label htmlFor={selectId} className="text-sm font-bold text-ink">
            {label}
            {props.required && <span className="ml-1 text-brand">*</span>}
          </label>
        )}

        <div
          className={`
            group relative flex items-center overflow-hidden
            rounded-xl border bg-white
            transition-[border-color,box-shadow,background-color]
            duration-200
            ${
              error
                ? "border-danger bg-danger-light/20 focus-within:ring-[3px] focus-within:ring-danger/10"
                : "border-border-strong hover:border-[#bdbdb8] focus-within:border-brand focus-within:ring-[3px] focus-within:ring-brand/10"
            }
            ${disabled ? "cursor-not-allowed bg-surface-muted opacity-60" : ""}
          `}
        >
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? messageId : undefined}
            className={`
              w-full appearance-none bg-transparent
              px-4 pr-11 font-semibold text-ink
              outline-none
              disabled:cursor-not-allowed
              ${sizeStyles[selectSize]}
              ${className}
            `}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {children}
          </select>

          <span className="pointer-events-none absolute right-4 flex items-center text-muted transition-colors duration-200 group-focus-within:text-brand">
            <ChevronDown size={18} strokeWidth={2} />
          </span>
        </div>

        {(error || hint) && (
          <p
            id={messageId}
            role={error ? "alert" : undefined}
            className={`text-xs font-medium ${
              error ? "text-danger" : "text-muted"
            }`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
