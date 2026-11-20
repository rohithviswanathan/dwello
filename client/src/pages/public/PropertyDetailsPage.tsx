import { useState, type FormEvent } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  Heart,
  MapPin,
  Maximize,
  ShieldCheck,
  Home,
  UserRound,
  LockKeyhole,
} from "lucide-react";
import { motion } from "motion/react";

import PropertyGallery from "../../components/property/PropertyGallery";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { useFavorites } from "../../hooks/FavouritesContext";
import { useEnquiries } from "../../hooks/EnquiriesContext";
import { useListings } from "../../hooks/ListingsContext";
import { useAuth } from "../../hooks/AuthContext";

const AMENITIES = [
  "24/7 Security",
  "Power Backup",
  "Parking",
  "Lift",
  "Water Supply",
  "Gym",
  "Swimming Pool",
  "Balcony",
];

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200",
];

export default function PropertyDetailsPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const { getListingById } = useListings();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addEnquiry } = useEnquiries();
  const { user } = useAuth();

  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  const property = getListingById(propertyId ?? "");

  const isTenant = user?.role === "tenant";
  const isLandlord = user?.role === "landlord";
  const isGuest = !user;

  const propertyPath = `/properties/${propertyId}`;

  const formatRent = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

  const handleAuthenticationRedirect = (
    path: "/login" | "/register",
    message = "Please sign in or create a tenant account to enquire about this property.",
  ) => {
    navigate(path, {
      state: {
        from: propertyPath,
        message,
      },
    });
  };

  const handleFavoriteClick = () => {
    if (!property) return;

    if (isGuest) {
      handleAuthenticationRedirect(
        "/login",
        "Please sign in to save this property to your favorites.",
      );

      return;
    }

    toggleFavorite(property.id);
  };

  const handleEnquirySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Prevent guests and landlords from submitting tenant enquiries.
    if (!isTenant) {
      return;
    }

    if (!property || !["available", "new"].includes(property.status)) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    addEnquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocation: property.location,
      city: property.city,
      propertyImage: property.image,
      rent: property.rent,
      tenantName: user.name,
      tenantEmail: user.email,
      moveInDate: String(formData.get("moveInDate") ?? ""),
      message: String(formData.get("message") ?? "").trim(),
    });

    setEnquirySubmitted(true);
  };

  // Landlords should not access tenant-facing property details.
  if (isLandlord) {
    return <Navigate to="/landlord/dashboard" replace />;
  }

  // Missing, draft and archived listings should not be visible to tenants.
  if (
    !property ||
    property.status === "draft" ||
    property.status === "archived"
  ) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-canvas px-5">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-brand">
            <MapPin size={28} />
          </div>

          <h1 className="font-display text-3xl font-semibold text-ink">
            Property not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            This property may have been removed, unpublished, or the link may be
            incorrect.
          </p>

          <Button
            variant="primary"
            className="mt-6"
            onClick={() => navigate("/properties")}
          >
            Browse properties
          </Button>
        </div>
      </main>
    );
  }

  // Rented properties remain identifiable but cannot receive new enquiries.
  if (property.status === "rented") {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-canvas px-5">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-warning-light text-warning">
            <Home size={28} />
          </div>

          <Badge variant="warning">Currently rented</Badge>

          <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
            This property is no longer available
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            "{property.title}" has already been rented. You can explore other
            available properties on Dwello.
          </p>

          <Button
            variant="primary"
            className="mt-6"
            onClick={() => navigate("/properties")}
          >
            Browse available properties
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => navigate("/properties")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand"
        >
          <ArrowLeft size={17} />
          Back to properties
        </button>

        {/* Property heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start"
        >
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="success">Available for rent</Badge>

              {property.status === "new" && (
                <Badge variant="brand">New listing</Badge>
              )}
            </div>

            <h1 className="pb-1 text-2xl font-semibold text-ink sm:text-3xl">
              {property.title}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-sm text-muted">
              <MapPin size={16} />
              {property.location}, {property.city}
            </p>
          </div>

          {user?.role !== "landlord" && (
            <button
              type="button"
              onClick={handleFavoriteClick}
              aria-pressed={isFavorite(property.id)}
              aria-label={
                isFavorite(property.id)
                  ? "Remove property from saved properties"
                  : "Save property"
              }
              className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition ${
                isFavorite(property.id)
                  ? "border-brand bg-brand-light text-brand"
                  : "border-border bg-white text-ink hover:border-brand hover:text-brand"
              }`}
            >
              <Heart
                size={17}
                fill={isFavorite(property.id) ? "currentColor" : "none"}
              />
              {isFavorite(property.id) ? "Saved" : "Save property"}
            </button>
          )}
        </motion.div>

        {/* Image gallery */}
        <PropertyGallery
          title={property.title}
          images={[property.image, ...GALLERY_IMAGES]}
        />

        {/* Main content */}
        <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Property information */}
          <div className="min-w-0 space-y-6">
            {/* Key details */}
            <section className="rounded-xl border border-border bg-white p-5 shadow-soft">
              <h2 className="text-lg font-bold text-ink pb-1">
                Property overview
              </h2>

              <div className="mt-3 grid grid-cols-2 gap-5 sm:grid-cols-4">
                <div className="flex items-center gap-3">
                  <BedDouble className="shrink-0 text-brand" size={21} />
                  <div>
                    <p className="text-lg font-bold text-ink">
                      {property.bedrooms}
                    </p>
                    <p className="text-xs text-muted">Bedrooms</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Bath className="shrink-0 text-brand" size={21} />
                  <div>
                    <p className="text-lg font-bold text-ink">
                      {property.bathrooms}
                    </p>
                    <p className="text-xs text-muted">Bathrooms</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Maximize className="shrink-0 text-brand" size={21} />
                  <div>
                    <p className="text-lg font-bold text-ink">
                      {property.area}
                    </p>
                    <p className="text-xs text-muted">Sq. ft.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck className="shrink-0 text-brand" size={21} />
                  <div>
                    <p className="text-sm font-bold text-ink">
                      {property.furnishing}
                    </p>
                    <p className="text-xs text-muted">Furnishing</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="rounded-xl border border-border bg-white p-5 shadow-soft">
              <h2 className="text-lg font-bold text-ink pb-1">
                About this property
              </h2>

              <p className="mt-6 text-sm leading-7 text-ink-secondary">
                Discover this {property.bedrooms} bedroom{" "}
                {property.propertyType.toLowerCase()} in {property.location},{" "}
                {property.city}. This home offers approximately {property.area}{" "}
                sq. ft. of living space and {property.furnishing.toLowerCase()}{" "}
                interiors. It is a great option for tenants looking for a
                comfortable home in a convenient neighbourhood.
              </p>
            </section>

            {/* Amenities */}
            <section className="rounded-xl border border-border bg-white p-5 shadow-soft">
              <h2 className="text-lg font-bold text-ink">Amenities</h2>

              <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3">
                {AMENITIES.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 text-sm text-ink-secondary"
                  >
                    <Check size={16} className="shrink-0 text-success" />
                    {amenity}
                  </div>
                ))}
              </div>
            </section>

            {/* Landlord information */}
            <section className="rounded-xl border border-border bg-white p-5 shadow-soft">
              <h2 className="text-lg font-bold text-ink">Property listed by</h2>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-lg font-bold text-brand">
                  L
                </div>

                <div>
                  <p className="font-bold text-ink">Property owner</p>
                  <p className="mt-1 text-xs text-muted">Landlord on Dwello</p>
                </div>
              </div>
            </section>
          </div>

          {/* Rental information and enquiry */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-xl border border-border bg-white p-5 shadow-card">
              <p className="text-sm text-muted pb-1">Monthly rent</p>

              <p className="mt-1 text-3xl font-extrabold text-ink">
                {formatRent(property.rent)}
                <span className="ml-1 text-sm font-medium text-muted">
                  / month
                </span>
              </p>

              <div className="my-5 border-t border-border" />

              <div className="flex justify-between text-sm">
                <span className="text-muted">Property type</span>
                <span className="font-semibold text-ink">
                  {property.propertyType}
                </span>
              </div>

              <div className="mt-4 flex justify-between text-sm">
                <span className="text-muted">Furnishing</span>
                <span className="font-semibold text-ink">
                  {property.furnishing}
                </span>
              </div>

              <div className="mt-4 flex justify-between text-sm">
                <span className="text-muted">Security deposit</span>
                <span className="font-semibold text-ink">To be confirmed</span>
              </div>

              <div className="my-5 border-t border-border" />

              <h2 className="text-base font-bold text-ink pb-1">
                Interested in this property?
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted">
                {isTenant
                  ? "Send an enquiry to let the landlord know you're interested."
                  : isGuest
                    ? "Create an account or sign in as a tenant to enquire about this property."
                    : "Landlord accounts cannot submit tenant enquiries."}
              </p>

              {/* Successful enquiry */}
              {enquirySubmitted ? (
                <div className="mt-4 rounded-lg border border-success/20 bg-success-light p-4">
                  <p className="font-bold text-success">Enquiry submitted!</p>

                  <p className="mt-1 text-sm text-ink-secondary">
                    This is a frontend demo. Your enquiry isn't being sent to a
                    landlord yet.
                  </p>

                  <button
                    type="button"
                    onClick={() => setEnquirySubmitted(false)}
                    className="mt-3 text-sm font-semibold text-success underline"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : isTenant ? (
                /* Tenant enquiry form */
                <form onSubmit={handleEnquirySubmit} className="mt-4 space-y-3">
                  <div>
                    <label
                      htmlFor="enquiry-name"
                      className="mb-1.5 block text-sm font-semibold text-ink"
                    >
                      Your name
                    </label>

                    <input
                      id="enquiry-name"
                      name="name"
                      type="text"
                      value={user.name}
                      readOnly
                      className="w-full cursor-not-allowed rounded-lg border border-border bg-surface-muted px-3 py-2.5 text-sm text-muted outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-email"
                      className="mb-1.5 block text-sm font-semibold text-ink"
                    >
                      Email address
                    </label>

                    <input
                      id="enquiry-email"
                      name="email"
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full cursor-not-allowed rounded-lg border border-border bg-surface-muted px-3 py-2.5 text-sm text-muted outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-date"
                      className="mb-1.5 block text-sm font-semibold text-ink"
                    >
                      Preferred move-in date
                    </label>

                    <input
                      id="enquiry-date"
                      name="moveInDate"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-message"
                      className="mb-1.5 block text-sm font-semibold text-ink"
                    >
                      Message
                    </label>

                    <textarea
                      id="enquiry-message"
                      name="message"
                      rows={3}
                      required
                      placeholder="Tell the landlord a little about your requirements..."
                      className="w-full resize-y rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full">
                    Send enquiry
                  </Button>
                </form>
              ) : isGuest ? (
                /* Guest registration prompt */
                <div className="mt-4 rounded-xl border border-brand/15 bg-brand-soft p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <LockKeyhole size={19} />
                  </div>

                  <h3 className="pl-0.5 mt-3 pt-3 text-base font-bold text-ink">
                    Sign in to enquire
                  </h3>

                  <p className="pl-0.5 mt-1 pt-1 text-xs leading-5 text-muted">
                    Join Dwello to contact landlords, track your enquiries, and
                    manage your rental interests.
                  </p>

                  <Button
                    variant="primary"
                    className="mt-4 w-full"
                    onClick={() => handleAuthenticationRedirect("/register")}
                  >
                    Create tenant account
                  </Button>

                  <Button
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={() => handleAuthenticationRedirect("/login")}
                  >
                    Already have an account? Sign in
                  </Button>
                </div>
              ) : isLandlord ? (
                /* Landlord restriction */
                <div className="mt-4 rounded-xl border border-border bg-surface-muted p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-muted">
                    <UserRound size={19} />
                  </div>

                  <p className="mt-3 pt-1.5 text-sm font-bold text-ink">
                    Tenant access only
                  </p>

                  <p className="mt-1 pt-1 text-xs leading-5 text-muted">
                    Enquiries are available to tenant accounts. You can manage
                    your own property listings and incoming enquiries from your
                    landlord dashboard.
                  </p>

                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => navigate("/landlord/dashboard")}
                  >
                    Go to landlord dashboard
                  </Button>
                </div>
              ) : null}

              <p className="mt-3 pt-3 text-center text-xs text-muted">
                No payment required to send an enquiry.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
