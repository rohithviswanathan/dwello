import { motion } from "motion/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type CardVariant = "default" | "interactive" | "outlined";
type CardPadding = "none" | "sm" | "md" | "lg";

type NativeCardProps = Omit<
  ComponentPropsWithoutRef<typeof motion.div>,
  "children" | "className" | "initial" | "whileHover" | "transition"
>;

interface CardProps extends NativeCardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  header?: ReactNode;
  footer?: ReactNode;
  hover?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

const paddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

const variantStyles: Record<CardVariant, string> = {
  default: "border border-border bg-white shadow-soft",
  interactive:
    "border border-border bg-white shadow-soft hover:border-brand/25 hover:shadow-card",
  outlined: "border border-border-strong bg-white",
};

function Card({
  variant = "default",
  padding = "md",
  header,
  footer,
  hover = false,
  disabled = false,
  children,
  className = "",
  ...props
}: CardProps) {
  const interactive = variant === "interactive" || hover;

  return (
    <motion.div
      initial={false}
      whileHover={
        interactive && !disabled
          ? {
              y: -3,
              boxShadow: "0 12px 28px rgba(36, 36, 36, 0.08)",
            }
          : undefined
      }
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`
        overflow-hidden rounded-2xl
        transition-[border-color,box-shadow]
        duration-200
        ${variantStyles[variant]}
        ${disabled ? "cursor-not-allowed opacity-60" : ""}
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="border-b border-border px-4 py-3">{header}</div>
      )}

      <div className={paddingStyles[padding]}>{children}</div>

      {footer && (
        <div className="border-t border-border bg-surface-muted/40 px-4 py-3">
          {footer}
        </div>
      )}
    </motion.div>
  );
}

export default Card;
