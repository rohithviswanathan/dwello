import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  MessageSquare,
  Search,
  X,
  XCircle,
  Home,
  Filter,
  Inbox,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

import {
  useEnquiries,
  type Enquiry,
  type EnquiryStatus,
} from "../../hooks/EnquiriesContext";

type FilterStatus = "all" | EnquiryStatus;

const FILTER_OPTIONS: { label: string; value: FilterStatus }[] = [
  { label: "All enquiries", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Closed", value: "closed" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_CONFIG: Record<
  EnquiryStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  accepted: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  closed: {
    label: "Closed",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-500 border-gray-200",
  },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not specified";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: string) {
  if (!date) return "Unknown date";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Unknown date";

  return parsed.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

interface EnquiryCardProps {
  enquiry: Enquiry;
  onView: (enquiry: Enquiry) => void;
  onStatusChange: (id: string, status: EnquiryStatus) => void;
}

function EnquiryCard({ enquiry, onView, onStatusChange }: EnquiryCardProps) {
  const status = STATUS_CONFIG[enquiry.status];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-xl border border-border bg-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-card"
    >
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        {/* Tenant and status */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-light text-sm font-extrabold text-brand">
              {getInitials(enquiry.tenantName || "Tenant")}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-extrabold text-ink sm:text-base">
                {enquiry.tenantName}
              </h3>
              <p className="mt-0.5 truncate text-xs text-muted sm:text-sm">
                {enquiry.tenantEmail}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status.label}
          </span>
        </div>

        {/* Property information */}
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-canvas/70 p-3 sm:flex-row sm:items-center">
          <div className="h-[76px] w-full shrink-0 overflow-hidden rounded-md bg-surface-muted sm:w-28">
            {enquiry.propertyImage ? (
              <img
                src={enquiry.propertyImage}
                alt={enquiry.propertyTitle}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted">
                <Home size={25} />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-1 text-sm font-extrabold text-ink">
              {enquiry.propertyTitle}
            </h4>

            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
              <MapPin size={13} className="shrink-0" />
              <span className="truncate">
                {enquiry.propertyLocation}, {enquiry.city}
              </span>
            </p>

            <p className="mt-2 text-sm font-extrabold text-brand">
              {formatCurrency(enquiry.rent)}
              <span className="ml-1 text-xs font-medium text-muted">
                / month
              </span>
            </p>
          </div>
        </div>

        {/* Enquiry details */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 rounded-md bg-brand-soft p-2 text-brand">
              <CalendarDays size={15} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Preferred move-in
              </p>
              <p className="mt-0.5 text-sm font-bold text-ink">
                {formatDate(enquiry.moveInDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 rounded-md bg-surface-muted p-2 text-muted">
              <Clock3 size={15} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Enquiry received
              </p>
              <p className="mt-0.5 text-sm font-bold text-ink">
                {formatDate(enquiry.submittedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Message preview */}
        <div className="rounded-lg border border-border/80 bg-white px-3.5 py-3">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-ink-secondary">
            <MessageSquare size={14} className="text-brand" />
            Tenant's message
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">
            {enquiry.message || "No message provided."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <button
            type="button"
            onClick={() => onView(enquiry)}
            className="inline-flex items-center gap-1.5 rounded-md py-2 text-xs font-bold text-ink-secondary transition-colors hover:text-brand"
          >
            <Eye size={15} />
            View details
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {enquiry.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange(enquiry.id, "rejected")}
                  leftIcon={<X size={14} />}
                >
                  Reject
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onStatusChange(enquiry.id, "accepted")}
                  leftIcon={<Check size={14} />}
                >
                  Accept
                </Button>
              </>
            )}

            {(enquiry.status === "accepted" ||
              enquiry.status === "rejected") && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onStatusChange(enquiry.id, "closed")}
              >
                Close enquiry
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

interface EnquiryDetailsModalProps {
  enquiry: Enquiry | null;
  onClose: () => void;
  onStatusChange: (id: string, status: EnquiryStatus) => void;
  onOpenProperty: (propertyId: string) => void;
}

function EnquiryDetailsModal({
  enquiry,
  onClose,
  onStatusChange,
  onOpenProperty,
}: EnquiryDetailsModalProps) {
  return (
    <AnimatePresence>
      {enquiry && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/55 p-3 backdrop-blur-[3px] sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-modal-title"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-border px-5 py-4 sm:px-6">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand">
                  Enquiry details
                </p>
                <h2
                  id="enquiry-modal-title"
                  className="mt-1 text-lg font-extrabold text-ink"
                >
                  Tenant enquiry
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-muted hover:text-ink"
              >
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-sm font-extrabold text-brand">
                  {getInitials(enquiry.tenantName)}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-ink">
                    {enquiry.tenantName}
                  </h3>
                  <p className="break-all text-sm text-muted">
                    {enquiry.tenantEmail}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${STATUS_CONFIG[enquiry.status].className}`}
                >
                  {STATUS_CONFIG[enquiry.status].label}
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-border">
                {enquiry.propertyImage && (
                  <img
                    src={enquiry.propertyImage}
                    alt={enquiry.propertyTitle}
                    className="h-40 w-full object-cover"
                  />
                )}

                <div className="p-4">
                  <h3 className="font-extrabold text-ink">
                    {enquiry.propertyTitle}
                  </h3>

                  <p className="mt-1 pt-1 flex items-center gap-1.5 text-sm text-muted">
                    <MapPin size={14} />
                    {enquiry.propertyLocation}, {enquiry.city}
                  </p>

                  <p className="mt-2 pt-1 pl-0.5 font-extrabold text-brand">
                    {formatCurrency(enquiry.rent)}
                    <span className="ml-1 text-xs font-medium text-muted">
                      / month
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={() => onOpenProperty(enquiry.propertyId)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand transition-colors hover:text-brand-dark"
                  >
                    View property
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-canvas p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                    Preferred move-in
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 text-sm font-bold text-ink">
                    <CalendarDays size={15} className="text-brand" />
                    {formatDate(enquiry.moveInDate)}
                  </p>
                </div>

                <div className="rounded-lg bg-canvas p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                    Submitted on
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 text-sm font-bold text-ink">
                    <Clock3 size={15} className="text-brand" />
                    {formatDateTime(enquiry.submittedAt)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 pl-1 flex items-center gap-2 text-sm font-extrabold text-ink">
                  <MessageSquare size={16} className="text-brand" />
                  Message from tenant
                </h3>

                <div className="rounded-lg border border-border bg-canvas/60 p-4 mt-3">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-secondary">
                    {enquiry.message || "No message provided."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-border bg-canvas/50 px-5 py-4 sm:px-6">
              {enquiry.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onStatusChange(enquiry.id, "rejected");
                      onClose();
                    }}
                    leftIcon={<X size={14} />}
                  >
                    Reject
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onStatusChange(enquiry.id, "accepted");
                      onClose();
                    }}
                    leftIcon={<Check size={14} />}
                  >
                    Accept enquiry
                  </Button>
                </>
              )}

              {(enquiry.status === "accepted" ||
                enquiry.status === "rejected") && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onStatusChange(enquiry.id, "closed");
                    onClose();
                  }}
                >
                  Close enquiry
                </Button>
              )}

              <Button variant="ghost" size="sm" onClick={onClose}>
                Done
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LandlordEnquiriesPage() {
  const navigate = useNavigate();

  const { enquiries, updateEnquiryStatus } = useEnquiries();

  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const stats = useMemo(
    () => ({
      total: enquiries.length,
      pending: enquiries.filter((item) => item.status === "pending").length,
      accepted: enquiries.filter((item) => item.status === "accepted").length,
      rejected: enquiries.filter((item) => item.status === "rejected").length,
      closed: enquiries.filter((item) => item.status === "closed").length,
    }),
    [enquiries],
  );

  const filteredEnquiries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return enquiries
      .filter((enquiry) => {
        const matchesStatus =
          activeFilter === "all" || enquiry.status === activeFilter;

        const matchesSearch =
          !query ||
          enquiry.tenantName.toLowerCase().includes(query) ||
          enquiry.tenantEmail.toLowerCase().includes(query) ||
          enquiry.propertyTitle.toLowerCase().includes(query) ||
          enquiry.city.toLowerCase().includes(query);

        return matchesStatus && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      );
  }, [enquiries, activeFilter, searchQuery]);

  const handleStatusChange = (enquiryId: string, status: EnquiryStatus) => {
    updateEnquiryStatus(enquiryId, status);

    setSelectedEnquiry((current) =>
      current?.id === enquiryId ? { ...current, status } : current,
    );
  };

  const statCards = [
    {
      label: "Total enquiries",
      value: stats.total,
      icon: <Inbox size={19} />,
      color: "bg-brand-light text-brand",
    },
    {
      label: "Awaiting response",
      value: stats.pending,
      icon: <Clock3 size={19} />,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Accepted",
      value: stats.accepted,
      icon: <CheckCircle2 size={19} />,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: <XCircle size={19} />,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
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

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1 w-7 rounded-full bg-brand" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand">
                  Landlord workspace
                </span>
              </div>

              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Enquiry management
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Review tenant enquiries, respond to interested renters, and keep
                track of every property conversation.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3.5 py-2.5 shadow-soft">
              <MessageSquare size={17} className="text-brand" />
              <span className="text-sm font-bold text-ink">
                {stats.pending}
              </span>
              <span className="text-xs text-muted">awaiting your response</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="rounded-xl border border-border bg-white p-4 shadow-soft transition-shadow hover:shadow-card"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-muted">{stat.label}</p>
                <span className={`rounded-lg p-2 ${stat.color}`}>
                  {stat.icon}
                </span>
              </div>
              <p className="mt-3 text-2xl font-extrabold tracking-tight text-ink">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Main panel */}
        <Card padding="none" className="overflow-hidden">
          <div className="border-b border-border p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-base font-extrabold text-ink">
                  Tenant enquiries
                </h2>
                <p className="mt-1 text-xs text-muted">
                  {filteredEnquiries.length}{" "}
                  {filteredEnquiries.length === 1 ? "enquiry" : "enquiries"}{" "}
                  found
                </p>
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search tenant or property..."
                  className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm text-ink outline-none transition-all placeholder:text-subtle focus:border-brand focus:ring-2 focus:ring-brand/10"
                />
              </div>
            </div>

            {/* Status filters */}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {FILTER_OPTIONS.map((option) => {
                const isActive = activeFilter === option.value;

                const count =
                  option.value === "all"
                    ? stats.total
                    : enquiries.filter((item) => item.status === option.value)
                        .length;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setActiveFilter(option.value)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? "border-brand bg-brand text-white shadow-sm"
                        : "border-border bg-white text-muted hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
                    }`}
                  >
                    {option.label}
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-surface-muted text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enquiry list */}
          <div className="p-4 sm:p-5">
            {filteredEnquiries.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 gap-4 xl:grid-cols-2"
              >
                <AnimatePresence mode="popLayout">
                  {filteredEnquiries.map((enquiry) => (
                    <EnquiryCard
                      key={enquiry.id}
                      enquiry={enquiry}
                      onView={setSelectedEnquiry}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-canvas/50 px-5 py-10 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand">
                  {searchQuery || activeFilter !== "all" ? (
                    <Filter size={25} />
                  ) : (
                    <Inbox size={25} />
                  )}
                </div>

                <h3 className="text-base font-extrabold text-ink">
                  {searchQuery || activeFilter !== "all"
                    ? "No matching enquiries"
                    : "No enquiries yet"}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                  {searchQuery || activeFilter !== "all"
                    ? "Try changing your search or selecting another status filter."
                    : "When tenants enquire about your published properties, their messages will appear here."}
                </p>

                {(searchQuery || activeFilter !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter("all");
                    }}
                  >
                    Clear filters
                  </Button>
                )}

                {!searchQuery && activeFilter === "all" && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-4"
                    onClick={() => navigate("/landlord/listings")}
                    rightIcon={<ArrowRight size={15} />}
                  >
                    Manage properties
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      <EnquiryDetailsModal
        enquiry={selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        onStatusChange={handleStatusChange}
        onOpenProperty={(propertyId) => {
          setSelectedEnquiry(null);
          navigate(`/properties/${propertyId}`);
        }}
      />
    </main>
  );
}
