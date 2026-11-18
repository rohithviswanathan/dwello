import { motion } from "motion/react";
import {
  forwardRef,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

interface SwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "type"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: {
    track: "h-5 w-9",
    thumb: "h-3.5 w-3.5",
    on: "translate-x-[17px]",
    off: "translate-x-[3px]",
  },
  md: {
    track: "h-6 w-11",
    thumb: "h-4 w-4",
    on: "translate-x-[22px]",
    off: "translate-x-[3px]",
  },
  lg: {
    track: "h-7 w-[50px]",
    thumb: "h-[18px] w-[18px]",
    on: "translate-x-[26px]",
    off: "translate-x-[4px]",
  },
};

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked = false,
      onChange,
      label,
      description,
      disabled = false,
      size = "md",
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const switchId = id ?? generatedId;

    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    const handleToggle = () => {
      if (disabled) return;

      const nextValue = !isChecked;

      if (!isControlled) {
        setInternalChecked(nextValue);
      }

      onChange?.(nextValue);
    };

    const styles = sizeStyles[size];

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <button
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          aria-checked={isChecked}
          aria-label={typeof label === "string" ? label : undefined}
          disabled={disabled}
          onClick={handleToggle}
          className={`
            relative inline-flex shrink-0 items-center
            rounded-full outline-none
            transition-colors duration-200
            focus-visible:ring-2 focus-visible:ring-brand/25
            focus-visible:ring-offset-2
            ${styles.track}
            ${isChecked ? "bg-brand" : "bg-border-strong"}
            ${disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"}
          `}
          {...props}
        >
          <motion.span
            className={`
              absolute rounded-full bg-white shadow-sm
              ${styles.thumb}
            `}
            animate={{
              x: isChecked
                ? size === "sm"
                  ? 17
                  : size === "md"
                    ? 22
                    : 26
                : size === "sm"
                  ? 3
                  : size === "md"
                    ? 3
                    : 4,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 32,
            }}
          />
        </button>

        {(label || description) && (
          <label
            htmlFor={switchId}
            className={`
              flex min-w-0 flex-col gap-0.5
              ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {label && (
              <span className="text-sm font-bold leading-5 text-ink">
                {label}
              </span>
            )}

            {description && (
              <span className="text-xs leading-relaxed text-muted">
                {description}
              </span>
            )}
          </label>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
