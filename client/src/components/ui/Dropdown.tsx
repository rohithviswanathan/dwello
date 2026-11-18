import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  dividerBefore?: boolean;
}

type DropdownAlign = "left" | "right";

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: DropdownAlign;
  width?: string;
  className?: string;
}

function Dropdown({
  trigger,
  items,
  align = "right",
  width = "w-56",
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;

    item.onClick();
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="
          inline-flex items-center justify-center gap-2
          rounded-lg outline-none
          focus-visible:ring-2 focus-visible:ring-brand/25
        "
      >
        {trigger}

        <ChevronDown
          size={15}
          className={`
            shrink-0 text-muted transition-transform duration-200
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={`
              absolute top-full z-50 mt-2
              ${align === "right" ? "right-0" : "left-0"}
              ${width}
              overflow-hidden rounded-xl border border-border
              bg-white p-1.5 shadow-dropdown
            `}
          >
            {items.map((item, index) => (
              <div key={`${item.label}-${index}`}>
                {item.dividerBefore && (
                  <div className="my-1.5 border-t border-border" />
                )}

                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => handleItemClick(item)}
                  className={`
                    flex w-full items-center gap-2.5
                    rounded-lg px-3 py-2.5
                    text-left text-sm font-semibold
                    transition-colors duration-150
                    ${
                      item.danger
                        ? "text-danger hover:bg-danger-light"
                        : "text-ink hover:bg-surface-muted"
                    }
                    ${
                      item.disabled
                        ? "cursor-not-allowed opacity-40 hover:bg-transparent"
                        : ""
                    }
                  `}
                >
                  {item.icon && (
                    <span className="flex shrink-0 items-center">
                      {item.icon}
                    </span>
                  )}

                  <span>{item.label}</span>
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dropdown;
