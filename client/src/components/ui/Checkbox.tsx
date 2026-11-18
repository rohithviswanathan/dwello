import { motion } from "motion/react";
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: ReactNode;
  description?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      id,
      disabled = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;
    const errorId = `${checkboxId}-error`;

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label
          htmlFor={checkboxId}
          className={`
            group flex w-fit items-start gap-3
            ${disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer"}
          `}
        >
          <span className="relative mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              disabled={disabled}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className="
                peer absolute inset-0 z-10 h-full w-full
                cursor-pointer appearance-none rounded-[5px]
                border-[1.5px] border-border-strong bg-white
                transition-[border-color,background-color,box-shadow]
                duration-200
                checked:border-brand checked:bg-brand
                focus-visible:outline-none
                focus-visible:ring-[3px] focus-visible:ring-brand/15
                disabled:cursor-not-allowed
                disabled:checked:border-muted
                disabled:checked:bg-muted
              "
              {...props}
            />

            <motion.span
              initial={false}
              className="
                pointer-events-none relative z-20
                text-white opacity-0
                peer-checked:opacity-100
                transition-opacity duration-150
              "
            >
              <Check size={13} strokeWidth={3} />
            </motion.span>
          </span>

          {(label || description) && (
            <span className="flex flex-col gap-0.5">
              {label && (
                <span className="text-sm font-semibold leading-5 text-ink transition-colors duration-150 group-hover:text-brand">
                  {label}
                </span>
              )}

              {description && (
                <span className="text-xs leading-relaxed text-muted">
                  {description}
                </span>
              )}
            </span>
          )}
        </label>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-danger"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
