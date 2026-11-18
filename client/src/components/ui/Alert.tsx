import { motion } from "motion/react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  icon?: ReactNode;
  className?: string;
  dismissible?: boolean;
}

const variantStyles: Record<
  AlertVariant,
  {
    container: string;
    icon: string;
    title: string;
    message: string;
    defaultIcon: ReactNode;
  }
> = {
  success: {
    container: "border-success/20 bg-success-light",
    icon: "text-success",
    title: "text-success",
    message: "text-ink-secondary",
    defaultIcon: <CheckCircle2 />,
  },
  error: {
    container: "border-danger/20 bg-danger-light",
    icon: "text-danger",
    title: "text-danger",
    message: "text-ink-secondary",
    defaultIcon: <AlertCircle />,
  },
  warning: {
    container: "border-warning/20 bg-warning-light",
    icon: "text-warning",
    title: "text-[#8A601F]",
    message: "text-ink-secondary",
    defaultIcon: <AlertTriangle />,
  },
  info: {
    container: "border-info/20 bg-info-light",
    icon: "text-info",
    title: "text-info",
    message: "text-ink-secondary",
    defaultIcon: <Info />,
  },
};

function Alert({
  variant = "info",
  title,
  children,
  onClose,
  icon,
  className = "",
  dismissible = false,
}: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`
        flex w-full items-start gap-3
        rounded-xl border px-4 py-3
        ${styles.container}
        ${className}
      `}
    >
      <span
        className={`
          mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center
          [&>svg]:h-5 [&>svg]:w-5
          ${styles.icon}
        `}
      >
        {icon ?? styles.defaultIcon}
      </span>

      <div className="min-w-0 flex-1">
        {title && (
          <p className={`text-sm font-extrabold leading-5 ${styles.title}`}>
            {title}
          </p>
        )}

        <div
          className={`
            text-sm leading-relaxed
            ${title ? "mt-1" : ""}
            ${styles.message}
          `}
        >
          {children}
        </div>
      </div>

      {dismissible && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          className="
            -mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center
            justify-center rounded-lg text-muted
            transition-colors duration-150
            hover:bg-black/5 hover:text-ink
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand/30
          "
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
}

export default Alert;
