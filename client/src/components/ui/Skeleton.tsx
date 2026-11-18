import type { HTMLAttributes } from "react";

type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "shimmer" | "none";
}

function Skeleton({
  variant = "rectangular",
  width,
  height,
  animation = "shimmer",
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const variantStyles: Record<SkeletonVariant, string> = {
    text: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-xl",
  };

  const animationStyles: Record<
    NonNullable<SkeletonProps["animation"]>,
    string
  > = {
    pulse: "animate-pulse",
    shimmer: "skeleton-shimmer",
    none: "",
  };

  return (
    <div
      aria-hidden="true"
      className={`
        block shrink-0 overflow-hidden
        bg-surface-muted
        ${variantStyles[variant]}
        ${animationStyles[animation]}
        ${className}
      `}
      style={{
        width,
        height: height ?? (variant === "text" ? "0.85em" : undefined),
        ...style,
      }}
      {...props}
    />
  );
}

export default Skeleton;
