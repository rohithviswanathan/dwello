import { motion } from "motion/react";
import { Bath, BedDouble, Heart, MapPin, Maximize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface PropertyCardData {
  id: string;
  title: string;
  location: string;
  city: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  furnishing: string;
  image: string;
  status?: "available" | "new" | "rented";
}

interface PropertyCardProps {
  property: PropertyCardData;
  isFavorite?: boolean;
  onFavoriteToggle?: (propertyId: string) => void;
  className?: string;
}

function PropertyCard({
  property,
  isFavorite = false,
  onFavoriteToggle,
  className = "",
}: PropertyCardProps) {
  const navigate = useNavigate();

  const handleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onFavoriteToggle?.(property.id);
  };

  const handleCardClick = () => {
    navigate(`/properties/${property.id}`);
  };

  const statusConfig = {
    available: {
      label: "Available",
      className: "bg-success-light text-success",
    },
    new: {
      label: "New listing",
      className: "bg-brand-light text-brand",
    },
    rented: {
      label: "Rented",
      className: "bg-surface-muted text-muted",
    },
  };

  const status = property.status ? statusConfig[property.status] : null;

  const formatRent = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onClick={handleCardClick}
      className={`
        group cursor-pointer overflow-hidden rounded-xl
        border border-border bg-white
        shadow-soft transition-all duration-300
        hover:-translate-y-1 hover:border-border-strong
        hover:shadow-hover
        ${className}
      `}
    >
      {/* Property image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          className="
            h-full w-full object-cover
            transition-transform duration-500
            group-hover:scale-[1.045]
          "
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" />

        {/* Status */}
        {status && (
          <span
            className={`
              absolute left-3 top-3 rounded-md px-2.5 py-1
              text-[10px] font-extrabold uppercase tracking-wide
              ${status.className}
            `}
          >
            {status.label}
          </span>
        )}

        {/* Favorite */}
        <button
          type="button"
          aria-label={
            isFavorite ? "Remove from saved properties" : "Save property"
          }
          aria-pressed={isFavorite}
          onClick={handleFavorite}
          className="
            absolute right-3 top-3 flex h-9 w-9
            items-center justify-center rounded-full
            bg-white/95 text-ink shadow-card
            backdrop-blur-sm transition-colors duration-200
            hover:bg-white hover:text-brand
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand/40
          "
        >
          <motion.span
            animate={{
              scale: isFavorite ? [1, 1.25, 1] : 1,
            }}
            transition={{ duration: 0.25 }}
            className="flex"
          >
            <Heart
              size={17}
              strokeWidth={2}
              className={
                isFavorite ? "fill-brand text-brand" : "text-ink-secondary"
              }
            />
          </motion.span>
        </button>
      </div>

      {/* Property information */}
      <div className="p-4">
        {/* Type and furnishing */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand">
            {property.propertyType}
          </span>

          <span className="truncate text-[11px] font-semibold text-muted">
            {property.furnishing}
          </span>
        </div>

        {/* Title */}
        <h3 className="truncate text-[15px] font-extrabold text-ink transition-colors duration-200 group-hover:text-brand">
          {property.title}
        </h3>

        {/* Location */}
        <div className="mt-2 flex items-center gap-1.5 text-muted">
          <MapPin size={14} className="shrink-0 text-brand" />

          <p className="truncate text-xs">
            {property.location}, {property.city}
          </p>
        </div>

        {/* Property details */}
        <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
          <div className="flex items-center gap-1.5 text-ink-secondary">
            <BedDouble size={15} className="text-muted" />
            <span className="text-xs font-semibold">
              {property.bedrooms} Beds
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-ink-secondary">
            <Bath size={15} className="text-muted" />
            <span className="text-xs font-semibold">
              {property.bathrooms} Baths
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-ink-secondary">
            <Maximize2 size={14} className="text-muted" />
            <span className="text-xs font-semibold">
              {property.area} sq.ft.
            </span>
          </div>
        </div>

        {/* Rent */}
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold text-muted">Monthly rent</p>

            <p className="mt-0.5 text-lg font-extrabold tracking-tight text-ink">
              {formatRent(property.rent)}
              <span className="ml-1 text-xs font-semibold text-muted">
                / month
              </span>
            </p>
          </div>

          <span className="mb-1 text-xs font-extrabold text-brand transition-transform duration-200 group-hover:translate-x-1">
            View details →
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default PropertyCard;
