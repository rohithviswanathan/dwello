import { forwardRef, useId, type TextareaHTMLAttributes } from "react";

type TextareaSize = "sm" | "md" | "lg";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  textareaSize?: TextareaSize;
}

const sizeStyles: Record<TextareaSize, string> = {
  sm: "min-h-[88px] text-xs",
  md: "min-h-[112px] text-sm",
  lg: "min-h-[144px] text-base",
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      textareaSize = "md",
      id,
      disabled = false,
      className = "",
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const messageId = `${textareaId}-message`;

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-bold text-ink">
            {label}
            {props.required && <span className="ml-1 text-brand">*</span>}
          </label>
        )}

        <div
          className={`
            overflow-hidden rounded-xl border bg-white
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
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? messageId : undefined}
            className={`
              block w-full resize-y bg-transparent
              px-4 py-3.5
              font-semibold leading-relaxed text-ink
              outline-none
              placeholder:font-medium placeholder:text-subtle
              disabled:cursor-not-allowed
              ${sizeStyles[textareaSize]}
              ${className}
            `}
            {...props}
          />
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

Textarea.displayName = "Textarea";

export default Textarea;
