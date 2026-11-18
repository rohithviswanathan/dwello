import { motion } from "motion/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

type ButtonSize = "sm" | "md" | "lg";

// Use Motion's native button props instead of React's
// ButtonHTMLAttributes to avoid conflicting event handlers.

type NativeButtonProps = Omit<
  ComponentPropsWithoutRef<typeof motion.button>,
  "children" | "className" | "disabled" | "type"
>;

interface ButtonProps extends NativeButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-sm hover:bg-brand-dark hover:shadow-[0_6px_18px_rgba(217,54,54,0.22)]",

  secondary: "bg-ink text-white hover:bg-ink-secondary",

  outline:
    "border border-border-strong bg-white text-ink hover:border-brand hover:bg-brand-soft hover:text-brand",

  ghost:
    "bg-transparent text-ink-secondary hover:bg-surface-muted hover:text-ink",

  danger: "bg-danger text-white hover:bg-[#c9433f]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3.5 text-xs rounded-lg",
  md: "min-h-11 px-5 text-sm rounded-xl",
  lg: "min-h-12 px-6 text-sm rounded-xl",
};

function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      whileHover={
        isDisabled
          ? undefined
          : {
              y: -2,
              scale: 1.015,
            }
      }
      whileTap={
        isDisabled
          ? undefined
          : {
              scale: 0.975,
              y: 0,
            }
      }
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      className={`
        inline-flex items-center justify-center gap-2.5
        whitespace-nowrap font-bold
        transition-colors duration-200
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-brand
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:shadow-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}

          <span>{children}</span>

          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
}

export default Button;
