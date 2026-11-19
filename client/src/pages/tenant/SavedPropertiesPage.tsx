import { useMemo } from "react";
import { Bookmark, Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../../components/ui/Button";
import PropertyGrid from "../../components/property/PropertyGrid";
import { useFavorites } from "../../hooks/FavouritesContext";
import { useListings } from "../../hooks/ListingsContext";

export default function SavedPropertiesPage() {
  const { favoriteIds, isFavorite, toggleFavorite, clearFavorites } =
    useFavorites();

  const { listings } = useListings();

  // Get saved properties from the shared listings context.
  // Exclude deleted, draft and archived listings.
  // Keep rented properties visible so tenants can see their updated status.
  const savedProperties = useMemo(
    () =>
      listings.filter(
        (property) =>
          favoriteIds.includes(property.id) &&
          property.status !== "draft" &&
          property.status !== "archived",
      ),
    [listings, favoriteIds],
  );

  return (
    <main className="min-h-[70vh] bg-canvas">
      <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:py-10">
        {/* Page Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-brand">
                <Bookmark size={17} />
              </span>

              <span className="text-sm font-semibold text-brand">
                Your collection
              </span>
            </div>

            <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Saved properties
            </h1>

            <p className="mt-2 text-sm text-muted sm:text-base">
              Keep track of the homes you love and revisit them anytime.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-brand-light px-3 py-1.5 text-sm font-semibold text-brand">
              {savedProperties.length} saved
            </span>

            {savedProperties.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Trash2 size={15} />}
                onClick={clearFavorites}
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Saved Properties */}
        {savedProperties.length > 0 ? (
          <PropertyGrid
            properties={savedProperties}
            columns={3}
            loading={false}
            isFavorite={isFavorite}
            onFavoriteToggle={toggleFavorite}
            emptyTitle="No saved properties"
            emptyDescription="Save properties using the heart icon to keep them here."
          />
        ) : (
          /* Empty State */
          <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-white px-6 py-12 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-brand">
              <Heart size={29} strokeWidth={1.7} />
            </div>

            <h2 className="font-display text-2xl font-semibold text-ink">
              Nothing saved yet
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
              Found a property you like? Tap the heart icon on any listing and
              it will show up here.
            </p>

            <Link to="/properties" className="mt-6">
              <Button size="md">Explore properties</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
