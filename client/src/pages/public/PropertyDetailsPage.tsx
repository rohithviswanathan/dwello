import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  Heart,
  MapPin,
  Maximize,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";

import PropertyGallery from "../../components/property/PropertyGallery";
import { MOCK_PROPERTIES } from "./PropertiesPage";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

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
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
    alt: "Modern living room",
  },
  {
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
    alt: "Property interior",
  },
  {
    src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200",
    alt: "Contemporary home interior",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200",
    alt: "Property interior details",
  },
];

export default function PropertyDetailsPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  const property = MOCK_PROPERTIES.find((item) => item.id === propertyId);

  if (!property) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-canvas px-5">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl font-semibold text-ink">
            Property not found
          </h1>
          <p className="mt-3 text-sm text-muted">
            This property may have been removed or the link may be incorrect.
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

  const handleEnquirySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEnquirySubmitted(true);
  };

  const formatRent = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

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

            <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              {property.title}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-sm text-muted">
              <MapPin size={16} />
              {property.location}, {property.city}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFavorite((current) => !current)}
            aria-pressed={isFavorite}
            className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition ${
              isFavorite
                ? "border-brand bg-brand-light text-brand"
                : "border-border bg-white text-ink hover:border-brand hover:text-brand"
            }`}
          >
            <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "Saved" : "Save property"}
          </button>
        </motion.div>

        {/* Image gallery */}
        <PropertyGallery
          title={property.title}
          images={[
            property.image,
            ...GALLERY_IMAGES.slice(1).map((image) => image.src),
          ]}
        />
        {/* Main content */}
        <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Property information */}
          <div className="min-w-0 space-y-6">
            {/* Key details */}
            <section className="rounded-xl border border-border bg-white p-5 shadow-soft">
              <h2 className="text-lg font-bold text-ink">Property overview</h2>

              <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
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
              <h2 className="text-lg font-bold text-ink">
                About this property
              </h2>

              <p className="mt-3 text-sm leading-7 text-ink-secondary">
                Discover this {property.bedrooms} bedroom{" "}
                {property.propertyType.toLowerCase()} in {property.location},{" "}
                {property.city}. This home offers approximately {property.area}{" "}
                sq. ft. of living space and
                {` ${property.furnishing.toLowerCase()} `}interiors. It is a
                great option for tenants looking for a comfortable home in a
                convenient neighbourhood.
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
              <p className="text-sm text-muted">Monthly rent</p>

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

              <h2 className="text-base font-bold text-ink">
                Interested in this property?
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted">
                Send an enquiry to let the landlord know you're interested.
              </p>

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
              ) : (
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
                      placeholder="Enter your name"
                      required
                      className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
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
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
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
              )}

              <p className="mt-3 text-center text-xs text-muted">
                No payment required to send an enquiry.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
