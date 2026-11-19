import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  FileText,
  Home,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useListings, type ListingStatus } from "../../hooks/ListingsContext";
import Button from "../../components/ui/Button";

type StatusFilter = "all" | ListingStatus;

const formatRupee = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const statusConfig: Record<
  ListingStatus,
  { label: string; className: string }
> = {
  new: {
    label: "New",
    className: "bg-info-light text-info",
  },
  available: {
    label: "Available",
    className: "bg-success-light text-success",
  },
  draft: {
    label: "Draft",
    className: "bg-warning-light text-warning",
  },
  rented: {
    label: "Rented",
    className: "bg-surface-muted text-muted",
  },
  archived: {
    label: "Archived",
    className: "bg-surface-muted text-muted",
  },
};

const filterOptions: { label: string; value: StatusFilter }[] = [
  { label: "All listings", value: "all" },
  { label: "Available", value: "available" },
  { label: "New", value: "new" },
  { label: "Drafts", value: "draft" },
  { label: "Rented", value: "rented" },
  { label: "Archived", value: "archived" },
];

function ManageListingsPage() {
  const navigate = useNavigate();

  const { listings, updateListingStatus, deleteListing } = useListings();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const listingCounts = useMemo(
    () => ({
      total: listings.length,
      available: listings.filter(
        (item) => item.status === "available" || item.status === "new",
      ).length,
      drafts: listings.filter((item) => item.status === "draft").length,
      rented: listings.filter((item) => item.status === "rented").length,
      archived: listings.filter((item) => item.status === "archived").length,
    }),
    [listings],
  );

  const filteredListings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesSearch =
        !normalizedSearch ||
        listing.title.toLowerCase().includes(normalizedSearch) ||
        listing.location.toLowerCase().includes(normalizedSearch) ||
        listing.city.toLowerCase().includes(normalizedSearch) ||
        listing.propertyType.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        activeFilter === "all" || listing.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [listings, search, activeFilter]);

  const handleStatusChange = (id: string, status: ListingStatus) => {
    updateListingStatus(id, status);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    deleteListing(deleteTarget);
    setDeleteTarget(null);
  };

  const summaryCards = [
    {
      label: "Total listings",
      value: listingCounts.total,
      icon: Building2,
      style: "bg-brand-light text-brand",
    },
    {
      label: "Published",
      value: listingCounts.available,
      icon: CheckCircle2,
      style: "bg-success-light text-success",
    },
    {
      label: "Drafts",
      value: listingCounts.drafts,
      icon: FileText,
      style: "bg-warning-light text-warning",
    },
    {
      label: "Rented",
      value: listingCounts.rented,
      icon: Home,
      style: "bg-info-light text-info",
    },
  ];

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Page header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/landlord/dashboard")}
            className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-muted transition-colors hover:text-brand"
          >
            <ArrowLeft size={15} />
            Back to dashboard
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-muted">
                <span>Landlord</span>
                <span>/</span>
                <span className="font-semibold text-ink">Manage listings</span>
              </div>

              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-[34px]">
                Your properties
              </h1>

              <p className="mt-1.5 text-sm text-muted">
                Manage your rental portfolio and listing availability.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => navigate("/landlord/listings/new")}
              leftIcon={<Plus size={16} />}
            >
              Add property
            </Button>
          </div>
        </div>

        {/* Portfolio summary */}
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {summaryCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-border bg-white p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-muted">
                    {item.label}
                  </span>

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.style}`}
                  >
                    <Icon size={17} />
                  </span>
                </div>

                <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
                  {item.value}
                </p>
              </div>
            );
          })}
        </section>

        {/* Search and filters */}
        <section className="mb-5 rounded-2xl border border-border bg-white p-4 shadow-soft">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search properties, locations..."
                className="h-11 w-full rounded-xl border border-border bg-surface-muted/50 pl-10 pr-10 text-sm text-ink outline-none transition-all placeholder:text-subtle focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition-colors hover:bg-brand-light hover:text-brand"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden text-xs font-bold text-muted sm:block">
                Status:
              </span>

              <div className="relative w-full sm:w-48">
                <select
                  value={activeFilter}
                  onChange={(event) =>
                    setActiveFilter(event.target.value as StatusFilter)
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-border bg-white px-3.5 pr-9 text-sm font-semibold text-ink outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/10"
                >
                  {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            <div className="flex flex-wrap gap-1.5">
              {filterOptions.map((option) => {
                const isActive = activeFilter === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setActiveFilter(option.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-brand text-white shadow-soft"
                        : "bg-surface-muted text-muted hover:bg-brand-light hover:text-brand"
                    }`}
                  >
                    {option.label}
                    {option.value === "all" && (
                      <span className="ml-1.5 opacity-75">
                        {listingCounts.total}
                      </span>
                    )}
                    {option.value === "draft" && (
                      <span className="ml-1.5 opacity-75">
                        {listingCounts.drafts}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-xs font-medium text-muted">
              Showing{" "}
              <span className="font-extrabold text-ink">
                {filteredListings.length}
              </span>{" "}
              of {listings.length} properties
            </p>
          </div>
        </section>

        {/* Listings */}
        {filteredListings.length > 0 ? (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredListings.map((property) => {
              const status = property.status;
              const statusInfo = statusConfig[status];

              return (
                <article
                  key={property.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-brand/20 hover:shadow-card"
                >
                  {/* Property image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-extrabold ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>

                    <span className="absolute right-3 top-3 rounded-lg bg-black/55 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur-sm">
                      {property.propertyType}
                    </span>
                  </div>

                  {/* Property details */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h2
                        className="truncate text-base font-extrabold text-ink"
                        title={property.title}
                      >
                        {property.title}
                      </h2>

                      <p className="mt-1 truncate text-xs text-muted">
                        {property.location}, {property.city}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-semibold text-ink-secondary">
                      <span>{property.bedrooms} Beds</span>
                      <span className="text-border-strong">|</span>
                      <span>{property.bathrooms} Baths</span>
                      <span className="text-border-strong">|</span>
                      <span>
                        {property.area.toLocaleString("en-IN")} sq.ft.
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                      <div>
                        <p className="text-lg font-extrabold text-brand">
                          {formatRupee(property.rent)}
                        </p>
                        <p className="text-[10px] font-medium text-muted">
                          Monthly rent
                        </p>
                      </div>

                      {status !== "draft" && status !== "archived" && (
                        <button
                          type="button"
                          onClick={() => navigate(`/properties/${property.id}`)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-bold text-ink-secondary transition-all hover:border-brand/30 hover:bg-brand-light hover:text-brand"
                        >
                          <Eye size={14} />
                          Preview
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Listing actions */}
                  <div className="border-t border-border bg-surface-muted/40 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {status === "draft" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(property.id, "available")
                          }
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-white transition-all hover:bg-brand-dark"
                        >
                          <CheckCircle2 size={14} />
                          Publish
                        </button>
                      )}

                      {(status === "available" || status === "new") && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(property.id, "draft")
                            }
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-bold text-ink-secondary transition-all hover:border-warning/40 hover:bg-warning-light hover:text-warning"
                          >
                            <FileText size={14} />
                            Unpublish
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(property.id, "rented")
                            }
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-bold text-ink-secondary transition-all hover:border-success/40 hover:bg-success-light hover:text-success"
                          >
                            <Home size={14} />
                            Mark rented
                          </button>
                        </>
                      )}

                      {status === "rented" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(property.id, "available")
                          }
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-success px-3 py-2 text-xs font-bold text-white transition-all hover:bg-success/90"
                        >
                          <CheckCircle2 size={14} />
                          Mark available
                        </button>
                      )}

                      {status === "archived" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(property.id, "draft")
                          }
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-white transition-all hover:bg-brand-dark"
                        >
                          <Clock3 size={14} />
                          Restore to drafts
                        </button>
                      )}

                      {status !== "archived" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(property.id, "archived")
                          }
                          title="Archive listing"
                          aria-label={`Archive ${property.title}`}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-muted transition-all hover:border-warning/40 hover:bg-warning-light hover:text-warning"
                        >
                          <Archive size={15} />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(property.id)}
                        title="Delete listing"
                        aria-label={`Delete ${property.title}`}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-muted transition-all hover:border-danger/40 hover:bg-danger-light hover:text-danger"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <p className="mt-2 text-[10px] text-muted">
                      {status === "draft" &&
                        "This property is not visible to tenants."}
                      {(status === "available" || status === "new") &&
                        "This property is visible to tenants."}
                      {status === "rented" &&
                        "This property is currently marked as rented."}
                      {status === "archived" &&
                        "This property is archived and hidden from tenants."}
                    </p>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-border-strong bg-white px-5 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-muted">
              {search || activeFilter !== "all" ? (
                <Search size={24} />
              ) : (
                <Building2 size={24} />
              )}
            </span>

            <h2 className="mt-4 text-base font-extrabold text-ink">
              {search || activeFilter !== "all"
                ? "No matching properties"
                : "No properties yet"}
            </h2>

            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted">
              {search || activeFilter !== "all"
                ? "Try changing your search term or selecting a different status filter."
                : "Your property listings will appear here once you add your first property."}
            </p>

            {(search || activeFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                }}
                className="mt-4 rounded-lg bg-brand-light px-4 py-2.5 text-xs font-bold text-brand transition-colors hover:bg-brand hover:text-white"
              >
                Clear filters
              </button>
            )}
          </section>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-listing-title"
            className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-hover"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger-light text-danger">
              <Trash2 size={22} />
            </div>

            <h2
              id="delete-listing-title"
              className="mt-4 text-lg font-extrabold text-ink"
            >
              Delete this property?
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              This listing will be permanently removed from your current Dwello
              workspace. This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-ink-secondary transition-colors hover:bg-surface-muted"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-danger px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-danger/90"
              >
                Delete property
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ManageListingsPage;
