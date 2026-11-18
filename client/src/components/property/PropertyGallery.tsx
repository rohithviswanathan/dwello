import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

function PropertyGallery({
  images,
  title,
  className = "",
}: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const totalImages = images.length;
  const activeImage = images[activeIndex];

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? totalImages - 1 : current - 1,
    );
  }, [totalImages]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === totalImages - 1 ? 0 : current + 1,
    );
  }, [totalImages]);

  const closeFullscreen = useCallback(() => {
    setFullscreen(false);
  }, []);

  useEffect(() => {
    if (!fullscreen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFullscreen();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [fullscreen, closeFullscreen, showPrevious, showNext]);

  if (totalImages === 0) {
    return (
      <div
        className={`
          flex aspect-[16/9] items-center justify-center
          rounded-xl bg-surface-muted text-sm font-semibold
          text-muted
          ${className}
        `}
      >
        No property images available
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Main image */}
      <div className="group relative aspect-[16/9] overflow-hidden rounded-xl bg-surface-muted">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={activeImage}
            alt={`${title} - Image ${activeIndex + 1}`}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Image counter */}
        <span className="absolute bottom-3 left-3 rounded-lg bg-black/65 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
          {activeIndex + 1} / {totalImages}
        </span>

        {/* Fullscreen */}
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          aria-label="View images fullscreen"
          className="
            absolute bottom-3 right-3 flex h-9 w-9
            items-center justify-center rounded-lg
            bg-black/60 text-white backdrop-blur-sm
            transition-colors hover:bg-black/80
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-white
          "
        >
          <Expand size={17} />
        </button>

        {/* Previous / Next */}
        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous image"
              className="
                absolute left-3 top-1/2 flex h-9 w-9
                -translate-y-1/2 items-center justify-center
                rounded-full bg-white/90 text-ink shadow-card
                transition-all hover:bg-white
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand
              "
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={showNext}
              aria-label="Next image"
              className="
                absolute right-3 top-1/2 flex h-9 w-9
                -translate-y-1/2 items-center justify-center
                rounded-full bg-white/90 text-ink shadow-card
                transition-all hover:bg-white
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand
              "
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail navigation */}
      {totalImages > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`
                relative h-[68px] w-[92px] shrink-0
                overflow-hidden rounded-lg border-2
                transition-all duration-200
                ${
                  activeIndex === index
                    ? "border-brand opacity-100"
                    : "border-transparent opacity-65 hover:opacity-100"
                }
              `}
            >
              <img
                src={image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen viewer */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed inset-0 z-[100] flex items-center
              justify-center bg-black/95 p-4
            "
            onClick={closeFullscreen}
          >
            <button
              type="button"
              onClick={closeFullscreen}
              aria-label="Close fullscreen viewer"
              className="
                absolute right-5 top-5 z-10 flex h-10 w-10
                items-center justify-center rounded-full
                bg-white/10 text-white transition-colors
                hover:bg-white/20
              "
            >
              <X size={21} />
            </button>

            <span className="absolute left-5 top-6 text-xs font-semibold text-white/70">
              {title} · {activeIndex + 1} of {totalImages}
            </span>

            <div
              className="flex h-full w-full items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              {totalImages > 1 && (
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous image"
                  className="
                    absolute left-3 flex h-11 w-11
                    items-center justify-center rounded-full
                    bg-white/10 text-white transition-colors
                    hover:bg-white/20 sm:left-6
                  "
                >
                  <ChevronLeft size={25} />
                </button>
              )}

              <motion.img
                key={activeImage}
                src={activeImage}
                alt={`${title} - Image ${activeIndex + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
              />

              {totalImages > 1 && (
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next image"
                  className="
                    absolute right-3 flex h-11 w-11
                    items-center justify-center rounded-full
                    bg-white/10 text-white transition-colors
                    hover:bg-white/20 sm:right-6
                  "
                >
                  <ChevronRight size={25} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PropertyGallery;
