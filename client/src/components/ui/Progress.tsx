import { motion } from "motion/react";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger";
  showLabel?: boolean;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

const variantStyles = {
  default: "bg-brand",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

function Progress({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  label,
  showPercentage = false,
  animated = true,
  className = "",
}: ProgressProps) {
  const safeMax = Math.max(0, max);
  const safeValue = Math.min(
    Math.max(0, Number.isFinite(value) ? value : 0),
    safeMax,
  );

  const percentage = safeMax > 0 ? (safeValue / safeMax) * 100 : 0;

  const displayPercentage = Math.round(percentage);

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || showPercentage) && (
        <div className="mb-2 flex items-center justify-between gap-3">
          {showLabel && (
            <span className="text-sm font-bold text-ink">
              {label ?? "Progress"}
            </span>
          )}

          {showPercentage && (
            <span className="shrink-0 text-xs font-extrabold tabular-nums text-ink-secondary">
              {displayPercentage}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-label={label ?? "Progress"}
        aria-valuemin={0}
        aria-valuemax={safeMax || 100}
        aria-valuenow={safeValue}
        className={`
          w-full overflow-hidden rounded-full
          bg-surface-muted
          ${sizeStyles[size]}
        `}
      >
        <motion.div
          className={`
            h-full rounded-full
            ${variantStyles[variant]}
          `}
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={
            animated
              ? {
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }
              : { duration: 0 }
          }
        />
      </div>
    </div>
  );
}

export default Progress;
