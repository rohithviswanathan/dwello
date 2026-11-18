import { motion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  variant?: "underline" | "pills";
  size?: "sm" | "md";
  className?: string;
}

function Tabs({
  tabs,
  value,
  onChange,
  variant = "underline",
  size = "md",
  className = "",
}: TabsProps) {
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeTabRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [value]);

  const isUnderline = variant === "underline";

  return (
    <div
      role="tablist"
      aria-label="Sections"
      className={`
        flex w-full items-center gap-1
        overflow-x-auto whitespace-nowrap
        scrollbar-none
        ${
          isUnderline
            ? "border-b border-border"
            : "rounded-xl bg-surface-muted p-1"
        }
        ${className}
      `}
    >
      {tabs.map((tab) => {
        const active = value === tab.value;

        return (
          <button
            key={tab.value}
            ref={active ? activeTabRef : null}
            type="button"
            role="tab"
            aria-selected={active}
            aria-disabled={tab.disabled || undefined}
            disabled={tab.disabled}
            onClick={() => onChange(tab.value)}
            className={`
              relative inline-flex shrink-0 items-center justify-center
              gap-2 font-bold transition-colors duration-200
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-brand/20
              disabled:cursor-not-allowed disabled:opacity-40
              ${size === "sm" ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"}
              ${
                isUnderline
                  ? active
                    ? "text-brand"
                    : "text-muted hover:text-ink"
                  : active
                    ? "rounded-lg bg-white text-brand shadow-soft"
                    : "rounded-lg text-muted hover:text-ink"
              }
            `}
          >
            {tab.icon && (
              <span className="flex shrink-0 items-center">{tab.icon}</span>
            )}

            <span>{tab.label}</span>

            {tab.count !== undefined && (
              <span
                className={`
                  rounded-full px-2 py-0.5 text-[10px] font-extrabold
                  ${
                    active
                      ? "bg-brand-light text-brand"
                      : "bg-surface-muted text-muted"
                  }
                `}
              >
                {tab.count}
              </span>
            )}

            {isUnderline && active && (
              <motion.span
                layoutId="dwello-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-brand"
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 35,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
