import { motion } from "motion/react";
import PropertyCard, { type PropertyCardData } from "./PropertyCard";
import EmptyState from "../ui/EmptyState";
import Skeleton from "../ui/Skeleton";
import { SearchX } from "lucide-react";

interface PropertyGridProps {
  properties: PropertyCardData[];
  loading?: boolean;
  columns?: 2 | 3 | 4;
  skeletonCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  onFavoriteToggle?: (propertyId: string) => void;
  isFavorite?: (propertyId: string) => boolean;
  className?: string;
}

const columnStyles = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

function PropertyGrid({
  properties,
  loading = false,
  columns = 3,
  skeletonCount = 6,
  emptyTitle = "No properties found",
  emptyDescription = "Try changing your search or filters to discover more properties.",
  onFavoriteToggle,
  isFavorite,
  className = "",
}: PropertyGridProps) {
  if (loading) {
    return (
      <div className={`grid gap-5 ${columnStyles[columns]} ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-border bg-white"
          >
            <Skeleton variant="rectangular" width="100%" height={210} />

            <div className="space-y-3 p-4">
              <div className="flex justify-between gap-3">
                <Skeleton width="35%" height={12} />
                <Skeleton width="25%" height={12} />
              </div>

              <Skeleton width="80%" height={18} />
              <Skeleton width="65%" height={12} />

              <div className="flex gap-4 pt-2">
                <Skeleton width="20%" height={13} />
                <Skeleton width="20%" height={13} />
                <Skeleton width="25%" height={13} />
              </div>

              <div className="border-t border-border pt-3">
                <Skeleton width="45%" height={22} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="h-full w-full" strokeWidth={1.5} />}
        title={emptyTitle}
        description={emptyDescription}
        size="md"
        className={className}
      />
    );
  }

  return (
    <motion.div
      layout
      className={`grid items-stretch gap-5 ${columnStyles[columns]} ${className}`}
    >
      {properties.map((property, index) => (
        <motion.div
          key={property.id}
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            delay: Math.min(index * 0.04, 0.2),
          }}
          className="min-w-0"
        >
          <PropertyCard
            property={property}
            isFavorite={isFavorite?.(property.id) ?? false}
            onFavoriteToggle={onFavoriteToggle}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default PropertyGrid;
