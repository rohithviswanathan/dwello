import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  MessageSquare,
  XCircle,
} from "lucide-react";

import Button from "../../components/ui/Button";
import { useEnquiries, type EnquiryStatus } from "../../hooks/EnquiriesContext";

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
  if (!date) return "Not specified";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatRent(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function MyEnquiriesPage() {
  const { enquiries, cancelEnquiry } = useEnquiries();

  const sortedEnquiries = useMemo(
    () =>
      [...enquiries].sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      ),
    [enquiries],
  );

  const pendingCount = enquiries.filter(
    (enquiry) => enquiry.status === "pending",
  ).length;

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[1280px] px-4 py-7 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand">
              <MessageSquare size={17} />
              Tenant dashboard
            </div>

            <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              My enquiries
            </h1>

            <p className="mt-2 pt-1 text-sm text-muted">
              Keep track of your property enquiries and their latest status.
            </p>
          </div>

          <Link to="/properties">
            <Button size="sm">Explore properties</Button>
          </Link>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-4 shadow-soft">
            <p className="text-sm text-muted">Total enquiries</p>
            <p className="mt-1 text-2xl font-bold text-ink">
              {enquiries.length}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-4 shadow-soft">
            <p className="text-sm text-muted">Awaiting response</p>
            <p className="mt-1 text-2xl font-bold text-warning">
              {pendingCount}
            </p>
          </div>

          <div className="col-span-2 rounded-xl border border-border bg-white p-4 shadow-soft sm:col-span-1">
            <p className="text-sm text-muted">Other statuses</p>
            <p className="mt-1 text-2xl font-bold text-ink">
              {enquiries.length - pendingCount}
            </p>
          </div>
        </div>

        {/* Enquiry list */}
        {sortedEnquiries.length > 0 ? (
          <div className="space-y-4">
            {sortedEnquiries.map((enquiry) => {
              const status = STATUS_STYLES[enquiry.status];

              return (
                <article
                  key={enquiry.id}
                  className="overflow-hidden rounded-xl border border-border bg-white shadow-soft transition-shadow duration-200 hover:shadow-card"
                >
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                    {/* Property image */}
                    <Link
                      to={`/properties/${enquiry.propertyId}`}
                      className="h-44 shrink-0 overflow-hidden rounded-lg bg-surface-muted sm:h-[150px] sm:w-[190px]"
                    >
                      <img
                        src={enquiry.propertyImage}
                        alt={enquiry.propertyTitle}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </Link>

                    {/* Property information */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to={`/properties/${enquiry.propertyId}`}
                            className="font-semibold text-ink transition-colors hover:text-brand"
                          >
                            {enquiry.propertyTitle}
                          </Link>

                          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                            <MapPin size={14} className="shrink-0" />
                            {enquiry.propertyLocation}, {enquiry.city}
                          </p>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <p className="mt-3 text-lg font-extrabold text-ink">
                        {formatRent(enquiry.rent)}
                        <span className="ml-1 text-xs font-medium text-muted">
                          / month
                        </span>
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-3 text-xs text-muted sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={15} className="shrink-0" />
                          Move-in: {formatDate(enquiry.moveInDate)}
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock3 size={15} className="shrink-0" />
                          Submitted: {formatDateTime(enquiry.submittedAt)}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                        <p className="max-w-full truncate text-xs text-muted">
                          <span className="font-semibold text-ink-secondary">
                            Your message:
                          </span>{" "}
                          {enquiry.message}
                        </p>

                        {enquiry.status === "pending" && (
                          <Button
                            variant="danger"
                            size="sm"
                            leftIcon={<XCircle size={14} />}
                            onClick={() => cancelEnquiry(enquiry.id)}
                          >
                            Cancel enquiry
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[340px] flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-white px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-light text-brand">
              <MessageSquare size={26} />
            </div>

            <h2 className="font-display text-2xl font-semibold text-ink">
              No enquiries yet
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
              When you enquire about a property, you can track its status and
              details here.
            </p>

            <Link to="/properties" className="mt-5">
              <Button>Browse properties</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
