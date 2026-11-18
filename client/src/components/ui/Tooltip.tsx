import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type ReactNode } from "react";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: TooltipPlacement;
  disabled?: boolean;
  className?: string;
}

const placementStyles: Record<TooltipPlacement, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

const animationOffsets: Record<TooltipPlacement, { x: number; y: number }> = {
  top: { x: 0, y: 5 },
  bottom: { x: 0, y: -5 },
  left: { x: 5, y: 0 },
  right: { x: -5, y: 0 },
};

function Tooltip({
  content,
  children,
  placement = "top",
  disabled = false,
  className = "",
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, 250);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setOpen(false);
  };

  const offset = animationOffsets[placement];

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      <AnimatePresence>
        {open && !disabled && (
          <motion.span
            role="tooltip"
            initial={{
              opacity: 0,
              x: offset.x,
              y: offset.y,
              scale: 0.96,
            }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              x: offset.x,
              y: offset.y,
              scale: 0.96,
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`
              pointer-events-none absolute z-[120]
              w-max max-w-[220px]
              rounded-lg bg-ink px-3 py-2
              text-xs font-semibold leading-relaxed text-white
              shadow-dropdown
              ${placementStyles[placement]}
            `}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export default Tooltip;
