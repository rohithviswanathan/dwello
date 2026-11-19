import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85";

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

const INITIAL_FORM: PropertyForm = {
  title: "",
  location: "",
  city: "",
  rent: "",
  bedrooms: "2",
  bathrooms: "1",
  area: "",
  propertyType: "Apartment",
  furnishing: "Unfurnished",
  image: "",
};

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

const fieldClassName =
  "w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-medium text-ink outline-none transition placeholder:font-normal placeholder:text-subtle hover:border-border-strong focus:border-brand focus:ring-4 focus:ring-brand/10";

const labelClassName = "mb-1.5 block text-sm font-bold text-ink-secondary";

function AddPropertyPage() {
  const navigate = useNavigate();
  const { addListing } = useListings();

  const [form, setForm] = useState<PropertyForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof PropertyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));

    if (field in errors) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Enter a property title.";
    }

    if (!form.location.trim()) {
      nextErrors.location = "Enter the property locality or address.";
    }

    if (!form.city.trim()) {
      nextErrors.city = "Enter the city.";
    }

    if (!form.rent || Number(form.rent) <= 0) {
      nextErrors.rent = "Enter a valid monthly rent.";
    }

    if (Number(form.bedrooms) < 0 || form.bedrooms === "") {
      nextErrors.bedrooms = "Enter a valid bedroom count.";
    }

    if (Number(form.bathrooms) <= 0 || form.bathrooms === "") {
      nextErrors.bathrooms = "Enter a valid bathroom count.";
    }

    if (!form.area || Number(form.area) <= 0) {
      nextErrors.area = "Enter a valid property area.";
    }

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

  const handleSubmit = (status: "draft" | "available") => {
    if (isSubmitting || !validateForm()) return;

    setIsSubmitting(true);

    try {
      addListing({
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
        status,
      });

      navigate("/landlord/listings", {
        state: {
          message:
            status === "draft"
              ? "Property saved as a draft."
              : "Property published successfully.",
        },
      });
    } catch (error) {
      console.error("Unable to create property:", error);
      setIsSubmitting(false);
    }
  };

  const previewImage = form.image.trim() || DEFAULT_IMAGE;

  return (
    <main className="min-h-screen bg-canvas pb-12">
      <div className="mx-auto w-full max-w-[1120px] px-4 pt-7 sm:px-6 lg:px-8">
        {/* Page heading */}
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
              Add a property
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Add the details of your rental property. You can save it privately
              as a draft or publish it for tenants to discover.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 text-xs font-semibold text-muted">
            <span className="h-2 w-2 rounded-full bg-success" />
            Changes are saved in this browser
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit("available");
          }}
        >
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* Form sections */}
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
                      Give your property a clear and descriptive title.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelClassName} htmlFor="property-title">
                      Property title <span className="text-brand">*</span>
                    </label>
                    <input
                      id="property-title"
                      className={fieldClassName}
                      placeholder="e.g. Spacious 2 BHK apartment near metro"
                      value={form.title}
                      onChange={(event) =>
                        updateField("title", event.target.value)
                      }
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
                      <label className={labelClassName} htmlFor="property-type">
                        Property type
                      </label>
                      <select
                        id="property-type"
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
                      <label className={labelClassName} htmlFor="furnishing">
                        Furnishing
                      </label>
                      <select
                        id="furnishing"
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
                      Help tenants understand where the property is located.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      className={labelClassName}
                      htmlFor="property-location"
                    >
                      Locality / Address <span className="text-brand">*</span>
                    </label>
                    <input
                      id="property-location"
                      className={fieldClassName}
                      placeholder="e.g. Whitefield"
                      value={form.location}
                      onChange={(event) =>
                        updateField("location", event.target.value)
                      }
                    />
                    {errors.location && (
                      <p className="mt-1.5 text-xs font-semibold text-danger">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="property-city">
                      City <span className="text-brand">*</span>
                    </label>
                    <input
                      id="property-city"
                      className={fieldClassName}
                      placeholder="e.g. Bengaluru"
                      value={form.city}
                      onChange={(event) =>
                        updateField("city", event.target.value)
                      }
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
                      Add the essential details tenants want to know.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClassName} htmlFor="property-rent">
                      Monthly rent <span className="text-brand">*</span>
                    </label>
                    <div className="relative">
                      <IndianRupee
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        id="property-rent"
                        type="number"
                        min="1"
                        className={`${fieldClassName} pl-9`}
                        placeholder="25000"
                        value={form.rent}
                        onChange={(event) =>
                          updateField("rent", event.target.value)
                        }
                      />
                    </div>
                    {errors.rent && (
                      <p className="mt-1.5 text-xs font-semibold text-danger">
                        {errors.rent}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="property-area">
                      Area (sq. ft.) <span className="text-brand">*</span>
                    </label>
                    <input
                      id="property-area"
                      type="number"
                      min="1"
                      className={fieldClassName}
                      placeholder="1200"
                      value={form.area}
                      onChange={(event) =>
                        updateField("area", event.target.value)
                      }
                    />
                    {errors.area && (
                      <p className="mt-1.5 text-xs font-semibold text-danger">
                        {errors.area}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className={labelClassName}
                      htmlFor="property-bedrooms"
                    >
                      Bedrooms <span className="text-brand">*</span>
                    </label>
                    <div className="relative">
                      <BedDouble
                        size={17}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        id="property-bedrooms"
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
                    <label
                      className={labelClassName}
                      htmlFor="property-bathrooms"
                    >
                      Bathrooms <span className="text-brand">*</span>
                    </label>
                    <div className="relative">
                      <Bath
                        size={17}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        id="property-bathrooms"
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

              {/* Property image */}
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
                      Add a publicly accessible image URL for your listing.
                    </p>
                  </div>
                </div>

                <label className={labelClassName} htmlFor="property-image">
                  Image URL{" "}
                  <span className="font-medium text-muted">(optional)</span>
                </label>
                <input
                  id="property-image"
                  type="url"
                  className={fieldClassName}
                  placeholder="https://example.com/property-image.jpg"
                  value={form.image}
                  onChange={(event) => updateField("image", event.target.value)}
                />
                {errors.image && (
                  <p className="mt-1.5 text-xs font-semibold text-danger">
                    {errors.image}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted">
                  If you leave this empty, Dwello will use a sample property
                  image.
                </p>
              </section>
            </div>

            {/* Side preview and actions */}
            <aside className="space-y-4 lg:sticky lg:top-6">
              <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
                <div className="border-b border-border px-4 py-3.5">
                  <h2 className="text-sm font-extrabold text-ink">
                    Listing preview
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    A quick look at your property image.
                  </p>
                </div>

                <div className="p-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-surface-muted">
                    <img
                      src={previewImage}
                      alt="Property preview"
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>

                  <div className="mt-3">
                    <p className="line-clamp-2 text-sm font-extrabold text-ink">
                      {form.title.trim() || "Your property title"}
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
                    <p className="text-sm font-bold text-ink">
                      Ready when you are
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      Save privately as a draft, or publish now to make this
                      property visible to tenants.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmit("draft")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-strong bg-white px-4 py-3 text-sm font-extrabold text-ink-secondary transition hover:border-brand/40 hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border-strong disabled:hover:bg-white disabled:hover:text-ink-secondary"
                  >
                    <Save size={16} />
                    Save as draft
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-brand"
                  >
                    <CheckCircle2 size={17} />
                    {isSubmitting ? "Publishing..." : "Publish property"}
                  </button>
                </div>
              </section>

              <p className="px-1 text-center text-[11px] leading-5 text-muted">
                You can edit or change the status of your listing later from
                Manage Listings.
              </p>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AddPropertyPage;
