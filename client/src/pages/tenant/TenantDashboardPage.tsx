import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Clock3,
  Heart,
  Home,
  MessageSquare,
  Search,
  Send,
} from "lucide-react";

import Button from "../../components/ui/Button";
import PropertyGrid from "../../components/property/PropertyGrid";
import { useFavorites } from "../../hooks/FavouritesContext";
import { useEnquiries, type EnquiryStatus } from "../../hooks/EnquiriesContext";
import { MOCK_PROPERTIES } from "../public/PropertiesPage";

const STATUS_STYLES: Record<
  EnquiryStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-warning-light text-warning",
  },
  accepted: {
    label: "Accepted",
    className: "bg-success-light text-success",
  },
  rejected: {
    label: "Rejected",
    className: "bg-danger-light text-danger",
  },
  closed: {
    label: "Closed",
    className: "bg-surface-muted text-muted",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-surface-muted text-muted",
  },
};

function formatDate(date: string) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatRent(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function TenantDashboardPage() {
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
  const { enquiries } = useEnquiries();

  const recentSavedProperties = useMemo(() => {
    const recentIds = favoriteIds.slice(-3).reverse();

    return recentIds
      .map((id) => MOCK_PROPERTIES.find((property) => property.id === id))
      .filter((property) => property !== undefined);
  }, [favoriteIds]);

  const recentEnquiries = useMemo(
    () =>
      [...enquiries]
        .sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime(),
        )
        .slice(0, 4),
    [enquiries],
  );

  const pendingCount = enquiries.filter(
    (enquiry) => enquiry.status === "pending",
  ).length;

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[1280px] px-4 py-7 sm:px-6 lg:px-8">
        {/* Welcome heading */}
        <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold text-brand">
              TENANT OVERVIEW
            </p>
            <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Your dashboard
            </h1>
            <p className="mt-2 text-sm text-muted">
              Keep track of your saved homes and property enquiries.
            </p>
          </div>

          <Link to="/properties">
            <Button leftIcon={<Search size={16} />} size="md">
              Find a home
            </Button>
          </Link>
        </section>

        {/* Summary cards */}
        <section className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            to="/saved"
            className="group rounded-xl border border-border bg-white p-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-brand">
                <Heart size={19} />
              </span>
              <ArrowRight
                size={17}
                className="text-subtle transition group-hover:translate-x-1 group-hover:text-brand"
              />
            </div>
            <p className="mt-4 text-sm text-muted">Saved properties</p>
            <p className="mt-1 text-2xl font-extrabold text-ink">
              {favoriteIds.length}
            </p>
          </Link>

          <Link
            to="/my-enquiries"
            className="group rounded-xl border border-border bg-white p-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-info-light text-info">
                <MessageSquare size={19} />
              </span>
              <ArrowRight
                size={17}
                className="text-subtle transition group-hover:translate-x-1 group-hover:text-brand"
              />
            </div>
            <p className="mt-4 text-sm text-muted">Total enquiries</p>
            <p className="mt-1 text-2xl font-extrabold text-ink">
              {enquiries.length}
            </p>
          </Link>

          <Link
            to="/my-enquiries"
            className="group rounded-xl border border-border bg-white p-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-warning/40 hover:shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-light text-warning">
                <Clock3 size={19} />
              </span>
              <ArrowRight
                size={17}
                className="text-subtle transition group-hover:translate-x-1 group-hover:text-brand"
              />
            </div>
            <p className="mt-4 text-sm text-muted">Awaiting response</p>
            <p className="mt-1 text-2xl font-extrabold text-warning">
              {pendingCount}
            </p>
          </Link>
        </section>

        {/* Recently saved properties */}
        <section className="mb-9">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Bookmark size={18} className="text-brand" />
                <h2 className="text-lg font-bold text-ink">Recently saved</h2>
              </div>
              <p className="mt-1 text-sm text-muted">
                Properties you've added to your collection.
              </p>
            </div>

            {favoriteIds.length > 0 && (
              <Link
                to="/saved"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand transition hover:text-brand-dark"
              >
                View all <ArrowRight size={15} />
              </Link>
            )}
          </div>

          {recentSavedProperties.length > 0 ? (
            <PropertyGrid
              properties={recentSavedProperties}
              columns={3}
              loading={false}
              isFavorite={isFavorite}
              onFavoriteToggle={toggleFavorite}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-white px-5 py-8 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                <Heart size={21} />
              </span>
              <h3 className="mt-3 font-semibold text-ink">
                No saved properties yet
              </h3>
              <p className="mt-1 text-sm text-muted">
                Save properties you're interested in and they'll appear here.
              </p>
              <Link to="/properties" className="mt-4">
                <Button size="sm" variant="outline">
                  Explore properties
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Recent enquiries */}
        <section className="mb-9">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Send size={18} className="text-brand" />
                <h2 className="text-lg font-bold text-ink">Recent enquiries</h2>
              </div>
              <p className="mt-1 text-sm text-muted">
                A quick look at your latest property enquiries.
              </p>
            </div>

            {enquiries.length > 0 && (
              <Link
                to="/my-enquiries"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand transition hover:text-brand-dark"
              >
                View all <ArrowRight size={15} />
              </Link>
            )}
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-soft">
              {recentEnquiries.map((enquiry, index) => {
                const status = STATUS_STYLES[enquiry.status];

                return (
                  <div
                    key={enquiry.id}
                    className={`flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center ${
                      index !== 0 ? "border-t border-border" : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-muted">
                        {enquiry.propertyImage ? (
                          <img
                            src={enquiry.propertyImage}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Home size={19} className="text-muted" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <Link
                          to={`/properties/${enquiry.propertyId}`}
                          className="block truncate text-sm font-bold text-ink transition hover:text-brand"
                        >
                          {enquiry.propertyTitle}
                        </Link>
                        <p className="mt-1 text-xs text-muted">
                          {formatRent(enquiry.rent)} / month
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                          <CalendarDays size={12} />
                          Submitted {formatDate(enquiry.submittedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
                      >
                        {status.label}
                      </span>

                      <Link
                        to="/my-enquiries"
                        className="text-xs font-semibold text-brand hover:text-brand-dark"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-white px-5 py-8 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-info-light text-info">
                <MessageSquare size={21} />
              </span>
              <h3 className="mt-3 font-semibold text-ink">
                No enquiries submitted
              </h3>
              <p className="mt-1 text-sm text-muted">
                Your property enquiry activity will appear here.
              </p>
              <Link to="/properties" className="mt-4">
                <Button size="sm" variant="outline">
                  Browse properties
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Quick navigation */}
        <section className="rounded-xl border border-border bg-white p-5 shadow-soft">
          <h2 className="text-base font-bold text-ink">Quick access</h2>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link
              to="/properties"
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition hover:border-brand/40 hover:bg-brand-soft"
            >
              <Search size={19} className="text-brand" />
              <span className="text-sm font-semibold text-ink">
                Find a home
              </span>
              <ArrowRight size={15} className="ml-auto text-muted" />
            </Link>

            <Link
              to="/saved"
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition hover:border-brand/40 hover:bg-brand-soft"
            >
              <Heart size={19} className="text-brand" />
              <span className="text-sm font-semibold text-ink">
                Saved properties
              </span>
              <ArrowRight size={15} className="ml-auto text-muted" />
            </Link>

            <Link
              to="/my-enquiries"
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition hover:border-brand/40 hover:bg-brand-soft"
            >
              <MessageSquare size={19} className="text-brand" />
              <span className="text-sm font-semibold text-ink">
                My enquiries
              </span>
              <ArrowRight size={15} className="ml-auto text-muted" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
