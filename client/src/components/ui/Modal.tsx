import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  showCloseButton = true,
  className = "",
}: ModalProps) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const descriptionId = `${generatedId}-description`;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            overflow-y-auto bg-ink/50
            px-4 py-6 backdrop-blur-[3px]
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (closeOnBackdrop && event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{
              duration: 0.22,
              ease: [0.2, 0.7, 0.3, 1],
            }}
            className={`
              relative my-auto w-full ${sizeStyles[size]}
              overflow-hidden rounded-2xl
              border border-white/70 bg-white
              shadow-[0_24px_80px_rgba(0,0,0,0.20)]
              ${className}
            `}
          >
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                <div className="min-w-0">
                  {title && (
                    <h2
                      id={titleId}
                      className="text-lg font-extrabold tracking-tight text-ink"
                    >
                      {title}
                    </h2>
                  )}

                  {description && (
                    <p
                      id={descriptionId}
                      className="mt-1 text-sm leading-relaxed text-muted"
                    >
                      {description}
                    </p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="
                      flex h-9 w-9 shrink-0 items-center
                      justify-center rounded-lg
                      text-muted transition-all duration-200
                      hover:bg-surface-muted hover:text-ink
                      focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-brand/30
                    "
                  >
                    <X size={19} />
                  </button>
                )}
              </div>
            )}

            <div className="px-5 py-5">{children}</div>

            {footer && (
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border bg-surface-muted/40 px-5 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
