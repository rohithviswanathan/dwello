import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CheckCircle2,
  Home,
  Image as ImageIcon,
  IndianRupee,
  MapPin,
  Ruler,
  Save,
} from "lucide-react";
import { useListings } from "../../hooks/ListingsContext";

interface PropertyForm {
  title: string;
  location: string;
  city: string;
  rent: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  propertyType: string;
  furnishing: string;
  image: string;
}

interface FormErrors {
  title?: string;
  location?: string;
  city?: string;
  rent?: string;
  bedrooms?: string;
  bathrooms?: string;
  area?: string;
  image?: string;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85";

const fieldClassName =
  "w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-medium text-ink outline-none transition placeholder:font-normal placeholder:text-subtle hover:border-border-strong focus:border-brand focus:ring-4 focus:ring-brand/10";

const labelClassName = "mb-1.5 block text-sm font-bold text-ink-secondary";

function EditPropertyPage() {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const { getListingById, updateListing } = useListings();

  const listing = getListingById(listingId ?? "");

  const [form, setForm] = useState<PropertyForm>(() => ({
    title: listing?.title ?? "",
    location: listing?.location ?? "",
    city: listing?.city ?? "",
    rent: listing ? String(listing.rent) : "",
    bedrooms: listing ? String(listing.bedrooms) : "2",
    bathrooms: listing ? String(listing.bathrooms) : "1",
    area: listing ? String(listing.area) : "",
    propertyType: listing?.propertyType ?? "Apartment",
    furnishing: listing?.furnishing ?? "Unfurnished",
    image: listing?.image ?? "",
  }));

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep the form in sync if the route changes to another listing.
  useEffect(() => {
    if (!listing) return;

    setForm({
      title: listing.title,
      location: listing.location,
      city: listing.city,
      rent: String(listing.rent),
      bedrooms: String(listing.bedrooms),
      bathrooms: String(listing.bathrooms),
      area: String(listing.area),
      propertyType: listing.propertyType,
      furnishing: listing.furnishing,
      image: listing.image,
    });
    setErrors({});
  }, [listingId, listing?.id]);

  const updateField = (field: keyof PropertyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));

    if (field in errors) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!form.title.trim()) nextErrors.title = "Enter a property title.";
    if (!form.location.trim())
      nextErrors.location = "Enter the property locality or address.";
    if (!form.city.trim()) nextErrors.city = "Enter the city.";
    if (!form.rent || Number(form.rent) <= 0)
      nextErrors.rent = "Enter a valid monthly rent.";
    if (form.bedrooms === "" || Number(form.bedrooms) < 0) {
      nextErrors.bedrooms = "Enter a valid bedroom count.";
    }
    if (form.bathrooms === "" || Number(form.bathrooms) <= 0) {
      nextErrors.bathrooms = "Enter a valid bathroom count.";
    }
    if (!form.area || Number(form.area) <= 0)
      nextErrors.area = "Enter a valid property area.";

    if (form.image.trim()) {
      try {
        const parsedUrl = new URL(form.image.trim());
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          nextErrors.image = "Enter a valid image URL.";
        }
      } catch {
        nextErrors.image = "Enter a valid image URL.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!listing || isSubmitting || !validateForm()) return;

    setIsSubmitting(true);

    try {
      updateListing(listing.id, {
        title: form.title.trim(),
        location: form.location.trim(),
        city: form.city.trim(),
        rent: Number(form.rent),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area: Number(form.area),
        propertyType: form.propertyType,
        furnishing: form.furnishing,
        image: form.image.trim() || DEFAULT_IMAGE,
        // Deliberately preserve the existing listing status.
        status: listing.status,
      });

      navigate("/landlord/listings", {
        state: { message: "Property details updated successfully." },
      });
    } catch (error) {
      console.error("Unable to update property:", error);
      setIsSubmitting(false);
    }
  };

  if (!listing) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-canvas px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-7 text-center shadow-soft">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-brand">
            <Home size={22} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Property not found
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            This listing may have been deleted or the link may be incorrect.
          </p>
          <button
            type="button"
            onClick={() => navigate("/landlord/listings")}
            className="mt-5 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            Back to listings
          </button>
        </div>
      </main>
    );
  }

  const previewImage = form.image.trim() || DEFAULT_IMAGE;

  return (
    <main className="min-h-screen bg-canvas pb-12">
      <div className="mx-auto w-full max-w-[1120px] px-4 pt-7 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/landlord/listings")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-brand"
        >
          <ArrowLeft size={17} />
          Back to listings
        </button>

        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brand">
              <Home size={15} />
              Landlord workspace
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Edit property
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Update your property information. Your listing status will remain
              unchanged.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 text-xs font-semibold text-muted">
            <span
              className={`h-2 w-2 rounded-full ${
                listing.status === "available" || listing.status === "new"
                  ? "bg-success"
                  : listing.status === "rented"
                    ? "bg-warning"
                    : "bg-subtle"
              }`}
            />
            Current status: {listing.status}
          </span>
        </div>

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              {/* Basic information */}
              <section className="rounded-2xl border border-border bg-white p-5 shadow-soft sm:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <Home size={19} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-ink">
                      Basic information
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      Edit the title and property type.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelClassName} htmlFor="edit-title">
                      Property title <span className="text-brand">*</span>
                    </label>
                    <input
                      id="edit-title"
                      className={fieldClassName}
                      value={form.title}
                      onChange={(event) =>
                        updateField("title", event.target.value)
                      }
                      placeholder="e.g. Spacious 2 BHK apartment"
                      maxLength={100}
                    />
                    {errors.title && (
                      <p className="mt-1.5 text-xs font-semibold text-danger">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClassName} htmlFor="edit-type">
                        Property type
                      </label>
                      <select
                        id="edit-type"
                        className={fieldClassName}
                        value={form.propertyType}
                        onChange={(event) =>
                          updateField("propertyType", event.target.value)
                        }
                      >
                        <option>Apartment</option>
                        <option>Independent House</option>
                        <option>Villa</option>
                        <option>Studio</option>
                        <option>Builder Floor</option>
                        <option>PG</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={labelClassName}
                        htmlFor="edit-furnishing"
                      >
                        Furnishing
                      </label>
                      <select
                        id="edit-furnishing"
                        className={fieldClassName}
                        value={form.furnishing}
                        onChange={(event) =>
                          updateField("furnishing", event.target.value)
                        }
                      >
                        <option>Unfurnished</option>
                        <option>Semi-furnished</option>
                        <option>Fully furnished</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Location */}
              <section className="rounded-2xl border border-border bg-white p-5 shadow-soft sm:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <MapPin size={19} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-ink">
                      Property location
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      Update the locality and city.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClassName} htmlFor="edit-location">
                      Locality / Address <span className="text-brand">*</span>
                    </label>
                    <input
                      id="edit-location"
                      className={fieldClassName}
                      value={form.location}
                      onChange={(event) =>
                        updateField("location", event.target.value)
                      }
                      placeholder="e.g. Whitefield"
                    />
                    {errors.location && (
                      <p className="mt-1.5 text-xs font-semibold text-danger">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="edit-city">
                      City <span className="text-brand">*</span>
                    </label>
                    <input
                      id="edit-city"
                      className={fieldClassName}
                      value={form.city}
                      onChange={(event) =>
                        updateField("city", event.target.value)
                      }
                      placeholder="e.g. Bengaluru"
                    />
                    {errors.city && (
                      <p className="mt-1.5 text-xs font-semibold text-danger">
                        {errors.city}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Property details */}
              <section className="rounded-2xl border border-border bg-white p-5 shadow-soft sm:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <Ruler size={19} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-ink">
                      Property details
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      Update rent, area and room counts.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClassName} htmlFor="edit-rent">
                      Monthly rent <span className="text-brand">*</span>
                    </label>
                    <div className="relative">
                      <IndianRupee
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        id="edit-rent"
                        type="number"
                        min="1"
                        className={`${fieldClassName} pl-9`}
                        value={form.rent}
                        onChange={(event) =>
                          updateField("rent", event.target.value)
                        }
                        placeholder="25000"
                      />
                    </div>
                    {errors.rent && (
                      <p className="mt-1.5 text-xs font-semibold text-danger">
                        {errors.rent}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="edit-area">
                      Area (sq. ft.) <span className="text-brand">*</span>
                    </label>
                    <input
                      id="edit-area"
                      type="number"
                      min="1"
                      className={fieldClassName}
                      value={form.area}
                      onChange={(event) =>
                        updateField("area", event.target.value)
                      }
                      placeholder="1200"
                    />
                    {errors.area && (
                      <p className="mt-1.5 text-xs font-semibold text-danger">
                        {errors.area}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="edit-bedrooms">
                      Bedrooms <span className="text-brand">*</span>
                    </label>
                    <div className="relative">
                      <BedDouble
                        size={17}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        id="edit-bedrooms"
                        type="number"
                        min="0"
                        className={`${fieldClassName} pl-9`}
                        value={form.bedrooms}
                        onChange={(event) =>
                          updateField("bedrooms", event.target.value)
                        }
                      />
                    </div>
                    {errors.bedrooms && (
                      <p className="mt-1.5 text-xs font-semibold text-danger">
                        {errors.bedrooms}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="edit-bathrooms">
                      Bathrooms <span className="text-brand">*</span>
                    </label>
                    <div className="relative">
                      <Bath
                        size={17}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        id="edit-bathrooms"
                        type="number"
                        min="1"
                        className={`${fieldClassName} pl-9`}
                        value={form.bathrooms}
                        onChange={(event) =>
                          updateField("bathrooms", event.target.value)
                        }
                      />
                    </div>
                    {errors.bathrooms && (
                      <p className="mt-1.5 text-xs font-semibold text-danger">
                        {errors.bathrooms}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Image */}
              <section className="rounded-2xl border border-border bg-white p-5 shadow-soft sm:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <ImageIcon size={19} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-ink">
                      Property image
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      Change the image using a public URL.
                    </p>
                  </div>
                </div>

                <label className={labelClassName} htmlFor="edit-image">
                  Image URL{" "}
                  <span className="font-medium text-muted">(optional)</span>
                </label>
                <input
                  id="edit-image"
                  type="url"
                  className={fieldClassName}
                  value={form.image}
                  onChange={(event) => updateField("image", event.target.value)}
                  placeholder="https://example.com/property-image.jpg"
                />
                {errors.image && (
                  <p className="mt-1.5 text-xs font-semibold text-danger">
                    {errors.image}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted">
                  Leave empty to use the default sample image.
                </p>
              </section>
            </div>

            {/* Preview and save */}
            <aside className="space-y-4 lg:sticky lg:top-6">
              <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
                <div className="border-b border-border px-4 py-3.5">
                  <h2 className="text-sm font-extrabold text-ink">
                    Listing preview
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    Preview your updated details.
                  </p>
                </div>

                <div className="p-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-surface-muted">
                    <img
                      src={previewImage}
                      alt="Updated property preview"
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>

                  <div className="mt-3">
                    <p className="line-clamp-2 text-sm font-extrabold text-ink">
                      {form.title || "Your property title"}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                      <MapPin size={13} />
                      {form.location || "Locality"}
                      {form.city ? `, ${form.city}` : ""}
                    </p>
                    <p className="mt-3 text-lg font-extrabold text-brand">
                      {form.rent
                        ? `₹${Number(form.rent).toLocaleString("en-IN")}`
                        : "₹—"}
                      <span className="ml-1 text-xs font-medium text-muted">
                        / month
                      </span>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 border-t border-border pt-3 text-xs font-semibold text-muted">
                      <span className="flex items-center gap-1">
                        <BedDouble size={14} />
                        {form.bedrooms || "—"} Beds
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath size={14} />
                        {form.bathrooms || "—"} Baths
                      </span>
                      <span className="flex items-center gap-1">
                        <Ruler size={14} />
                        {form.area || "—"} sq. ft.
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-white p-4 shadow-soft">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-success"
                  />
                  <div>
                    <p className="text-sm font-bold text-ink">Ready to save?</p>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      Your edits will be applied to this listing. Its current
                      status will be preserved.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-brand"
                >
                  <Save size={17} />
                  {isSubmitting ? "Saving changes..." : "Save changes"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/landlord/listings")}
                  className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-muted transition hover:border-border-strong hover:bg-surface-muted hover:text-ink"
                >
                  Cancel
                </button>
              </section>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditPropertyPage;
