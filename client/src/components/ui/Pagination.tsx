import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  siblingCount?: number;
  className?: string;
}

type PageItem = number | "ellipsis";

function getPageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PageItem[] {
  const totalNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + siblingCount * 2;

    return [
      ...Array.from({ length: leftCount }, (_, index) => index + 1),
      "ellipsis",
      totalPages,
    ];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + siblingCount * 2;
    const start = totalPages - rightCount + 1;

    return [
      1,
      "ellipsis",
      ...Array.from({ length: rightCount }, (_, index) => start + index),
    ];
  }

  return [
    1,
    "ellipsis",
    ...Array.from(
      { length: rightSibling - leftSibling + 1 },
      (_, index) => leftSibling + index,
    ),
    "ellipsis",
    totalPages,
  ];
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  siblingCount = 1,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const pages = getPageNumbers(safePage, totalPages, siblingCount);

  const startItem =
    totalItems !== undefined && pageSize !== undefined
      ? (safePage - 1) * pageSize + 1
      : undefined;

  const endItem =
    totalItems !== undefined && pageSize !== undefined
      ? Math.min(safePage * pageSize, totalItems)
      : undefined;

  const buttonBase = `
    inline-flex h-9 min-w-9 items-center justify-center
    rounded-lg border text-sm font-bold
    transition-[background-color,border-color,color,box-shadow]
    duration-200
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-brand/20
  `;

  const handlePageChange = (page: number) => {
    if (page === safePage || page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-between gap-3 ${className}`}
    >
      {startItem !== undefined && endItem !== undefined && (
        <p className="text-xs font-medium text-muted">
          Showing <span className="font-bold text-ink">{startItem}</span>
          {" – "}
          <span className="font-bold text-ink">{endItem}</span>
          {" of "}
          <span className="font-bold text-ink">{totalItems}</span>
        </p>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={safePage === 1}
          onClick={() => handlePageChange(safePage - 1)}
          className={`
            ${buttonBase}
            border-border bg-white text-ink-secondary
            hover:border-brand/30 hover:bg-brand-soft hover:text-brand
            disabled:cursor-not-allowed disabled:opacity-35
            disabled:hover:border-border disabled:hover:bg-white
            disabled:hover:text-ink-secondary
          `}
        >
          <ChevronLeft size={17} />
        </button>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 min-w-7 items-center justify-center text-muted"
              aria-hidden="true"
            >
              <MoreHorizontal size={17} />
            </span>
          ) : (
            <button
              key={page}
              type="button"
              aria-label={`Page ${page}`}
              aria-current={safePage === page ? "page" : undefined}
              onClick={() => handlePageChange(page)}
              className={`
                ${buttonBase}
                ${
                  safePage === page
                    ? "border-brand bg-brand text-white shadow-sm"
                    : "border-border bg-white text-ink-secondary hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                }
              `}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={safePage === totalPages}
          onClick={() => handlePageChange(safePage + 1)}
          className={`
            ${buttonBase}
            border-border bg-white text-ink-secondary
            hover:border-brand/30 hover:bg-brand-soft hover:text-brand
            disabled:cursor-not-allowed disabled:opacity-35
            disabled:hover:border-border disabled:hover:bg-white
            disabled:hover:text-ink-secondary
          `}
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
