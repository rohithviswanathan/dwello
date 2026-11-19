import { useMemo, useState } from "react";

import { motion } from "motion/react";

import { ArrowDownUp, Heart, SlidersHorizontal } from "lucide-react";

import SearchBar from "../../components/property/SearchBar";

import FilterPanel, {
  type PropertyFilters,
} from "../../components/property/FilterPanel";

import PropertyGrid from "../../components/property/PropertyGrid";

import type { PropertyCardData } from "../../components/property/PropertyCard";

import Pagination from "../../components/ui/Pagination";

import Badge from "../../components/ui/Badge";

import { useFavorites } from "../../hooks/FavouritesContext";

import { INITIAL_LISTINGS, useListings } from "../../hooks/ListingsContext";

// Temporary compatibility export for pages that haven't migrated yet.
// These pages will be connected to ListingsContext in the next steps.
export const MOCK_PROPERTIES: PropertyCardData[] = INITIAL_LISTINGS;

const PAGE_SIZE = 6;

const DEFAULT_FILTERS: PropertyFilters = {
  minRent: "",
  maxRent: "",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  furnishing: "",
};

type SortOption = "recommended" | "rent-low" | "rent-high" | "area";

export default function PropertiesPage() {
  const [searchValue, setSearchValue] = useState("");

  const [draftFilters, setDraftFilters] =
    useState<PropertyFilters>(DEFAULT_FILTERS);

  const [appliedFilters, setAppliedFilters] =
    useState<PropertyFilters>(DEFAULT_FILTERS);

  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  const [currentPage, setCurrentPage] = useState(1);

  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();

  const { listings } = useListings();

  // Only published and available listings should appear to tenants.
  const publishedProperties = useMemo(
    () =>
      listings.filter(
        (property) =>
          property.status === "available" || property.status === "new",
      ),
    [listings],
  );

  // Location suggestions are now generated from shared listing data.
  const suggestions = useMemo(() => {
    const locations = Array.from(
      new Set(publishedProperties.map((property) => property.location)),
    );

    return locations
      .filter((location) =>
        location.toLowerCase().includes(searchValue.trim().toLowerCase()),
      )
      .slice(0, 5)
      .map((location) => ({
        label: location,
        description: "Bengaluru",
      }));
  }, [publishedProperties, searchValue]);

  // Search, filtering and sorting use the shared listings.
  const filteredProperties = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    const filtered = publishedProperties.filter((property) => {
      const matchesSearch =
        !query ||
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query);

      const matchesMinRent =
        !appliedFilters.minRent ||
        property.rent >= Number(appliedFilters.minRent);

      const matchesMaxRent =
        !appliedFilters.maxRent ||
        property.rent <= Number(appliedFilters.maxRent);

      const matchesType =
        !appliedFilters.propertyType ||
        property.propertyType === appliedFilters.propertyType;

      const matchesBedrooms =
        !appliedFilters.bedrooms ||
        (appliedFilters.bedrooms === "5+"
          ? property.bedrooms >= 5
          : property.bedrooms === Number(appliedFilters.bedrooms));

      const matchesBathrooms =
        !appliedFilters.bathrooms ||
        (appliedFilters.bathrooms === "4+"
          ? property.bathrooms >= 4
          : property.bathrooms === Number(appliedFilters.bathrooms));

      const matchesFurnishing =
        !appliedFilters.furnishing ||
        property.furnishing === appliedFilters.furnishing;

      return (
        matchesSearch &&
        matchesMinRent &&
        matchesMaxRent &&
        matchesType &&
        matchesBedrooms &&
        matchesBathrooms &&
        matchesFurnishing
      );
    });

    switch (sortBy) {
      case "rent-low":
        filtered.sort((a, b) => a.rent - b.rent);
        break;

      case "rent-high":
        filtered.sort((a, b) => b.rent - a.rent);
        break;

      case "area":
        filtered.sort((a, b) => b.area - a.area);
        break;

      default:
        break;
    }

    return filtered;
  }, [publishedProperties, searchValue, appliedFilters, sortBy]);

  const totalPages = Math.ceil(filteredProperties.length / PAGE_SIZE);

  // Prevent an empty page if listings are removed while the user
  // is viewing a later pagination page.
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const paginatedProperties = filteredProperties.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[1300px] px-4 py-7 sm:px-6 lg:px-8">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"
        >
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="brand">Find your next home</Badge>
            </div>

            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Explore rental properties
            </h1>

            <p className="mt-2 pt-1 text-sm text-muted sm:text-base">
              Discover places that feel like home.
            </p>
          </div>
        </motion.div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-border bg-white p-3 shadow-soft sm:p-4">
          <SearchBar
            value={searchValue}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            suggestions={suggestions}
            placeholder="Search by area, neighbourhood or property name..."
          />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Filters */}
          <aside className="min-w-0">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
              <SlidersHorizontal size={17} />
              Refine your search
            </div>

            <FilterPanel
              filters={draftFilters}
              onChange={setDraftFilters}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Results */}
          <section className="min-w-0">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-ink">
                  Available properties
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {filteredProperties.length} properties found
                </p>
              </div>

              <div className="flex items-center gap-2">
                <ArrowDownUp size={16} className="shrink-0 text-muted" />

                <label
                  htmlFor="property-sort"
                  className="whitespace-nowrap text-sm text-muted"
                >
                  Sort by
                </label>

                <select
                  id="property-sort"
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value as SortOption);
                    setCurrentPage(1);
                  }}
                  className="min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rent-low">Rent: Low to high</option>
                  <option value="rent-high">Rent: High to low</option>
                  <option value="area">Largest area</option>
                </select>
              </div>
            </div>

            {favoriteIds.length > 0 && (
              <div className="mb-4 flex items-center gap-2 text-sm text-muted">
                <Heart size={15} className="text-brand" />
                {favoriteIds.length} saved{" "}
                {favoriteIds.length === 1 ? "property" : "properties"}
              </div>
            )}

            <PropertyGrid
              properties={paginatedProperties}
              columns={3}
              loading={false}
              skeletonCount={PAGE_SIZE}
              emptyTitle="No properties found"
              emptyDescription="Try changing your search or adjusting the filters to discover more properties."
              onFavoriteToggle={toggleFavorite}
              isFavorite={isFavorite}
            />

            {totalPages > 1 && (
              <div className="mt-7 flex justify-center">
                <Pagination
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredProperties.length}
                  pageSize={PAGE_SIZE}
                  siblingCount={1}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
