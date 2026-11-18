import { motion } from "motion/react";
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputSize?: InputSize;
}

const sizeStyles: Record<InputSize, string> = {
  sm: "h-10 text-xs",
  md: "h-12 text-sm",
  lg: "h-14 text-base",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      inputSize = "md",
      id,
      disabled = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-bold text-ink">
            {label}
            {props.required && <span className="ml-1 text-brand">*</span>}
          </label>
        )}

        <motion.div
          className={`
            group relative flex items-center
            overflow-hidden rounded-xl border bg-white
            transition-[border-color,box-shadow,background-color]
            duration-200
            ${
              error
                ? "border-danger bg-danger-light/20"
                : "border-border-strong hover:border-[#bdbdb8] focus-within:border-brand focus-within:ring-[3px] focus-within:ring-brand/10"
            }
            ${disabled ? "cursor-not-allowed bg-surface-muted opacity-60" : ""}
          `}
        >
          {leftIcon && (
            <span
              className="
                pointer-events-none ml-4 flex shrink-0
                items-center border-0
                text-muted transition-colors duration-200
                group-focus-within:text-brand
              "
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? messageId : undefined}
            className={`
                min-w-0 w-full appearance-none
                !border-0 !border-l-0
                bg-transparent px-4
                font-semibold text-ink
                !outline-none !ring-0 !shadow-none
                focus:!border-0 focus:!border-l-0
                focus:!outline-none focus:!ring-0
                focus:!shadow-none
                placeholder:font-medium placeholder:text-subtle
                disabled:cursor-not-allowed
                ${sizeStyles[inputSize]}
                ${leftIcon ? "pl-3" : ""}
                ${rightIcon ? "pr-2" : ""}
                ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <span className="mr-4 flex shrink-0 items-center text-muted">
              {rightIcon}
            </span>
          )}
        </motion.div>

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

Input.displayName = "Input";

export default Input;
