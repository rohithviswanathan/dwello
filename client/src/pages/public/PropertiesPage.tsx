import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowDownUp, Heart, Home, SlidersHorizontal } from "lucide-react";

import SearchBar from "../../components/property/SearchBar";
import FilterPanel, {
  type PropertyFilters,
} from "../../components/property/FilterPanel";
import PropertyGrid from "../../components/property/PropertyGrid";
import type { PropertyCardData } from "../../components/property/PropertyCard";
import Pagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";
import { useFavorites } from "../../hooks/FavouritesContext";

const PAGE_SIZE = 6;

const DEFAULT_FILTERS: PropertyFilters = {
  minRent: "",
  maxRent: "",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  furnishing: "",
};

// Temporary mock data. This will eventually come from the properties API.
export const MOCK_PROPERTIES: PropertyCardData[] = [
  {
    id: "property-1",
    title: "Modern Apartment with Spacious Balcony",
    location: "Indiranagar",
    city: "Bengaluru",
    rent: 28000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1150,
    propertyType: "Apartment",
    furnishing: "Fully furnished",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900",
    status: "new",
  },
  {
    id: "property-2",
    title: "Premium Family Home in a Quiet Community",
    location: "Whitefield",
    city: "Bengaluru",
    rent: 35000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    propertyType: "Apartment",
    furnishing: "Semi-furnished",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900",
    status: "available",
  },
  {
    id: "property-3",
    title: "Minimal Studio Apartment",
    location: "Koramangala",
    city: "Bengaluru",
    rent: 16000,
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    propertyType: "Studio",
    furnishing: "Fully furnished",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900",
    status: "available",
  },
  {
    id: "property-4",
    title: "Independent House with Private Garden",
    location: "Sarjapur Road",
    city: "Bengaluru",
    rent: 42000,
    bedrooms: 3,
    bathrooms: 3,
    area: 1850,
    propertyType: "Independent House",
    furnishing: "Unfurnished",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900",
    status: "available",
  },
  {
    id: "property-5",
    title: "Bright Apartment Close to City Centre",
    location: "HSR Layout",
    city: "Bengaluru",
    rent: 24000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1050,
    propertyType: "Apartment",
    furnishing: "Semi-furnished",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=900",
    status: "new",
  },
  {
    id: "property-6",
    title: "Elegant Villa with Contemporary Interiors",
    location: "Electronic City",
    city: "Bengaluru",
    rent: 55000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    propertyType: "Villa",
    furnishing: "Fully furnished",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900",
    status: "available",
  },
  {
    id: "property-7",
    title: "Comfortable Home for a Small Family",
    location: "JP Nagar",
    city: "Bengaluru",
    rent: 22000,
    bedrooms: 2,
    bathrooms: 1,
    area: 980,
    propertyType: "Apartment",
    furnishing: "Unfurnished",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900",
    status: "available",
  },
  {
    id: "property-8",
    title: "Spacious 3 BHK with Modern Kitchen",
    location: "Marathahalli",
    city: "Bengaluru",
    rent: 32000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1550,
    propertyType: "Apartment",
    furnishing: "Fully furnished",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900",
    status: "available",
  },
];

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

  const suggestions = useMemo(() => {
    const locations = Array.from(
      new Set(MOCK_PROPERTIES.map((property) => property.location)),
    );

    return locations
      .filter((location) =>
        location.toLowerCase().includes(searchValue.toLowerCase()),
      )
      .slice(0, 5)
      .map((location) => ({
        label: location,
        description: "Bengaluru",
      }));
  }, [searchValue]);

  const filteredProperties = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    const filtered = MOCK_PROPERTIES.filter((property) => {
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
  }, [searchValue, appliedFilters, sortBy]);

  const totalPages = Math.ceil(filteredProperties.length / PAGE_SIZE);

  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
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
      <div className="mx-auto max-w-[1280px] px-4 py-7 sm:px-6 lg:px-8">
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

            <p className="mt-2 text-sm text-muted sm:text-base">
              Discover places that feel like home.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted">
            <Home size={17} />
            <span>Properties across Bengaluru</span>
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
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
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
                  currentPage={currentPage}
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
