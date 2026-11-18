import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "brand";

type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  danger: "bg-danger-light text-danger",
  info: "bg-info-light text-info",
  neutral: "bg-surface-muted text-ink-secondary",
  brand: "bg-brand-light text-brand",
};

const dotStyles: Record<BadgeVariant, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  neutral: "bg-muted",
  brand: "bg-brand",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
};

function Badge({
  variant = "neutral",
  size = "sm",
  dot = false,
  children,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex w-fit shrink-0 items-center
        rounded-full font-bold leading-tight
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotStyles[variant]}`}
        />
      )}

      {children}
    </span>
  );
}

export default Badge;
