import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileText,
  Home,
  MessageSquare,
  Plus,
  Settings2,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { useListings, type ListingStatus } from "../../hooks/ListingsContext";
import { useEnquiries } from "../../hooks/EnquiriesContext";

const formatRupee = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Recently";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const statusStyles: Record<string, string> = {
  pending: "bg-warning-light text-warning",
  accepted: "bg-success-light text-success",
  rejected: "bg-danger-light text-danger",
  closed: "bg-surface-muted text-muted",
  cancelled: "bg-surface-muted text-muted",
};

const listingStatusStyles: Record<ListingStatus, string> = {
  available: "bg-success-light text-success",
  new: "bg-info-light text-info",
  rented: "bg-surface-muted text-muted",
  draft: "bg-warning-light text-warning",
  archived: "bg-surface-muted text-muted",
};

function LandLordDashboardPage() {
  const navigate = useNavigate();

  const { listings } = useListings();
  const { enquiries } = useEnquiries();

  // Listing statistics are calculated from the shared ListingsContext.
  const listingStats = useMemo(() => {
    const total = listings.length;

    const published = listings.filter(
      (property) =>
        property.status === "available" || property.status === "new",
    ).length;

    const drafts = listings.filter(
      (property) => property.status === "draft",
    ).length;

    const rented = listings.filter(
      (property) => property.status === "rented",
    ).length;

    return {
      total,
      published,
      drafts,
      rented,
    };
  }, [listings]);

  // Enquiry statistics remain connected to EnquiriesContext.
  const enquiryStats = useMemo(
    () => ({
      total: enquiries.length,
      pending: enquiries.filter((item) => item.status === "pending").length,
      accepted: enquiries.filter((item) => item.status === "accepted").length,
      rejected: enquiries.filter((item) => item.status === "rejected").length,
    }),
    [enquiries],
  );

  // Show the five most recently submitted enquiries.
  const recentEnquiries = useMemo(
    () =>
      [...enquiries]
        .sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime(),
        )
        .slice(0, 5),
    [enquiries],
  );

  // ListingsContext places newly created listings at the beginning.
  const recentListings = useMemo(() => listings.slice(0, 4), [listings]);

  const statCards = [
    {
      label: "Total listings",
      value: listingStats.total,
      description: "Properties in your portfolio",
      icon: Building2,
      iconStyle: "bg-brand-light text-brand",
      trend: "Your property portfolio",
      trendIcon: Building2,
    },
    {
      label: "Published",
      value: listingStats.published,
      description: "Currently listed properties",
      icon: CheckCircle2,
      iconStyle: "bg-success-light text-success",
      trend: "Visible to tenants",
      trendIcon: ArrowUpRight,
    },
    {
      label: "Drafts",
      value: listingStats.drafts,
      description: "Unpublished properties",
      icon: FileText,
      iconStyle: "bg-warning-light text-warning",
      trend: "Awaiting publication",
      trendIcon: Clock3,
    },
    {
      label: "Rented",
      value: listingStats.rented,
      description: "Properties marked as rented",
      icon: Home,
      iconStyle: "bg-info-light text-info",
      trend: "Completed listings",
      trendIcon: TrendingUp,
    },
  ];

  const enquiryCards = [
    {
      label: "Total enquiries",
      value: enquiryStats.total,
      icon: MessageSquare,
      iconStyle: "bg-brand-light text-brand",
    },
    {
      label: "Pending",
      value: enquiryStats.pending,
      icon: Clock3,
      iconStyle: "bg-warning-light text-warning",
    },
    {
      label: "Accepted",
      value: enquiryStats.accepted,
      icon: CheckCircle2,
      iconStyle: "bg-success-light text-success",
    },
    {
      label: "Rejected",
      value: enquiryStats.rejected,
      icon: XCircle,
      iconStyle: "bg-danger-light text-danger",
    },
  ];

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted">
              <span>Landlord</span>
              <ChevronRight size={14} />
              <span className="font-semibold text-ink">Dashboard</span>
            </div>

            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-[34px]">
              Welcome back!
            </h1>

            <p className="mt-1.5 text-sm text-muted">
              Here's an overview of your properties and tenant enquiries.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/landlord/listings/new")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
          >
            <Plus size={17} strokeWidth={2.5} />
            Add new property
          </button>
        </div>

        {/* Listing statistics */}
        <section aria-labelledby="listing-overview-title" className="mb-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2
                id="listing-overview-title"
                className="text-base font-extrabold text-ink"
              >
                Property overview
              </h2>
              <p className="mt-0.5 text-xs text-muted">
                Your listing portfolio at a glance
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/landlord/listings")}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand transition-colors hover:text-brand-dark"
            >
              View listings
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              const TrendIcon = stat.trendIcon;

              return (
                <div
                  key={stat.label}
                  className="group rounded-2xl border border-border bg-white p-4 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-brand/20 hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-muted">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
                        {stat.value}
                      </p>
                    </div>

                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle}`}
                    >
                      <Icon size={20} />
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-muted">{stat.description}</p>

                  <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-[11px] font-semibold text-muted">
                    <TrendIcon size={13} />
                    {stat.trend}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Enquiry overview */}
        <section aria-labelledby="enquiry-overview-title" className="mb-7">
          <div className="mb-4">
            <h2
              id="enquiry-overview-title"
              className="text-base font-extrabold text-ink"
            >
              Enquiry overview
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Keep track of tenant interest and responses
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {enquiryCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-white p-3.5 transition-all duration-200 hover:border-brand/20 hover:shadow-soft sm:p-4"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconStyle}`}
                  >
                    <Icon size={18} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-2xl font-extrabold leading-none text-ink">
                      {item.value}
                    </p>
                    <p className="mt-1.5 truncate text-xs font-semibold text-muted">
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Main dashboard content */}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.85fr)]">
          {/* Recent enquiries */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <h2 className="text-base font-extrabold text-ink">
                  Recent enquiries
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Latest messages from interested tenants
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/landlord/enquiries")}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand transition-colors hover:text-brand-dark"
              >
                View all
                <ArrowRight size={14} />
              </button>
            </div>

            {recentEnquiries.length > 0 ? (
              <div className="divide-y divide-border">
                {recentEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-surface-muted/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-sm font-extrabold text-brand">
                        T
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-ink">
                            Tenant enquiry
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
                              statusStyles[enquiry.status] ??
                              "bg-surface-muted text-muted"
                            }`}
                          >
                            {enquiry.status}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-xs font-semibold text-ink-secondary">
                          {enquiry.propertyTitle}
                        </p>

                        <p className="mt-1 line-clamp-1 text-xs text-muted">
                          {enquiry.message}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays size={12} />
                            {formatDate(enquiry.submittedAt)}
                          </span>

                          <span>Move-in: {formatDate(enquiry.moveInDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <span className="text-sm font-extrabold text-ink">
                        {formatRupee(enquiry.rent)}
                        <span className="ml-1 text-[10px] font-medium text-muted">
                          /mo
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() => navigate("/landlord/enquiries")}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand transition-colors hover:text-brand-dark"
                      >
                        Review
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-12 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted text-muted">
                  <MessageSquare size={21} />
                </span>
                <h3 className="mt-3 text-sm font-bold text-ink">
                  No enquiries yet
                </h3>
                <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted">
                  Tenant enquiries will appear here when someone expresses
                  interest in a property.
                </p>
              </div>
            )}
          </section>

          {/* Right column */}
          <div className="space-y-5">
            {/* Quick actions */}
            <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
              <div className="mb-4">
                <h2 className="text-base font-extrabold text-ink">
                  Quick actions
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Manage your rental business
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => navigate("/landlord/listings/new")}
                  className="flex w-full items-center gap-3 rounded-xl border border-brand/20 bg-brand-soft p-3 text-left transition-all duration-200 hover:border-brand/40 hover:bg-brand-light"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                    <Plus size={19} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-ink">
                      Add property
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      Create a new rental listing
                    </span>
                  </span>

                  <ChevronRight size={16} className="text-brand" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/landlord/listings")}
                  className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition-all duration-200 hover:border-brand/25 hover:bg-surface-muted"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-ink-secondary">
                    <Building2 size={18} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-ink">
                      Manage listings
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      Edit and manage your properties
                    </span>
                  </span>

                  <ChevronRight size={16} className="text-muted" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/landlord/enquiries")}
                  className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition-all duration-200 hover:border-brand/25 hover:bg-surface-muted"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success-light text-success">
                    <MessageSquare size={18} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-ink">
                      Manage enquiries
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      Review and respond to tenants
                    </span>
                  </span>

                  {enquiryStats.pending > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-extrabold text-white">
                      {enquiryStats.pending}
                    </span>
                  )}

                  <ChevronRight size={16} className="text-muted" />
                </button>
              </div>
            </section>

            {/* Portfolio summary */}
            <section className="overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-ink">
                    Portfolio summary
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    Listing distribution
                  </p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-light text-accent">
                  <CircleDollarSign size={18} />
                </span>
              </div>

              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-ink-secondary">
                  Published properties
                </span>
                <span className="font-extrabold text-ink">
                  {listingStats.published} / {listingStats.total}
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-brand transition-all duration-500"
                  style={{
                    width: `${
                      listingStats.total > 0
                        ? (listingStats.published / listingStats.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-success-light/70 p-3">
                  <p className="text-lg font-extrabold text-success">
                    {listingStats.published}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-success">
                    Published
                  </p>
                </div>

                <div className="rounded-xl bg-surface-muted p-3">
                  <p className="text-lg font-extrabold text-ink">
                    {listingStats.rented}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-muted">
                    Rented
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Recent properties */}
        <section className="mt-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-ink">
                Recent properties
              </h2>
              <p className="mt-0.5 text-xs text-muted">
                A quick look at your property portfolio
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/landlord/listings")}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand transition-colors hover:text-brand-dark"
            >
              Manage all properties
              <ArrowRight size={14} />
            </button>
          </div>

          {recentListings.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {recentListings.map((property) => {
                const isManageOnly =
                  property.status === "draft" || property.status === "archived";

                return (
                  <Link
                    key={property.id}
                    to={
                      isManageOnly
                        ? "/landlord/listings"
                        : `/landlord/dashboard`
                    }
                    className="group overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-brand/20 hover:shadow-card"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <span
                        className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-extrabold capitalize ${
                          listingStatusStyles[property.status]
                        }`}
                      >
                        {property.status}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="truncate text-sm font-extrabold text-ink transition-colors group-hover:text-brand">
                        {property.title}
                      </h3>

                      <p className="mt-1 truncate text-xs text-muted">
                        {property.location}, {property.city}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                        <p className="text-sm font-extrabold text-brand">
                          {formatRupee(property.rent)}
                          <span className="ml-1 text-[10px] font-medium text-muted">
                            / month
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-strong bg-white px-5 py-10 text-center">
              <Building2 size={25} className="mx-auto text-muted" />
              <h3 className="mt-3 text-sm font-bold text-ink">
                No properties yet
              </h3>
              <p className="mt-1 text-xs text-muted">
                Add your first rental property to get started.
              </p>
              <button
                type="button"
                onClick={() => navigate("/landlord/listings/new")}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-dark"
              >
                <Plus size={15} />
                Add property
              </button>
            </div>
          )}
        </section>

        {/* Footer note */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Settings2 size={15} />
            <span>
              Dashboard data is synced with your current Dwello workspace.
            </span>
          </div>

          <span className="text-[11px] font-semibold text-muted">
            Dwello Landlord Workspace
          </span>
        </div>
      </div>
    </main>
  );
}

export default LandLordDashboardPage;
