import { motion } from "motion/react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: {
    container: "py-7 px-4",
    icon: "h-12 w-12",
    iconWrapper: "h-14 w-14",
    title: "text-base",
    description: "text-xs max-w-xs",
    gap: "gap-2",
  },
  md: {
    container: "py-10 px-5",
    icon: "h-14 w-14",
    iconWrapper: "h-[68px] w-[68px]",
    title: "text-lg",
    description: "text-sm max-w-sm",
    gap: "gap-3",
  },
  lg: {
    container: "py-14 px-6",
    icon: "h-16 w-16",
    iconWrapper: "h-20 w-20",
    title: "text-xl",
    description: "text-sm max-w-md",
    gap: "gap-4",
  },
};

function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  className = "",
}: EmptyStateProps) {
  const styles = sizeStyles[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`
        flex w-full flex-col items-center justify-center
        text-center
        ${styles.container}
        ${styles.gap}
        ${className}
      `}
    >
      {icon && (
        <div
          className={`
            mb-1 flex shrink-0 items-center justify-center
            rounded-2xl bg-brand-light text-brand
            ${styles.iconWrapper}
          `}
        >
          <span className={styles.icon}>{icon}</span>
        </div>
      )}

      <div className="flex flex-col items-center gap-1.5">
        <h3
          className={`
            font-extrabold tracking-tight text-ink
            ${styles.title}
          `}
        >
          {title}
        </h3>

        {description && (
          <p
            className={`
              leading-relaxed text-muted
              ${styles.description}
            `}
          >
            {description}
          </p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </motion.div>
  );
}

export default EmptyState;
