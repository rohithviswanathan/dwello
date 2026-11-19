import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { PropertyCardData } from "../components/property/PropertyCard";

export type ListingStatus =
  | "new"
  | "available"
  | "draft"
  | "rented"
  | "archived";

export type Listing = Omit<PropertyCardData, "status"> & {
  status: ListingStatus;
};

type NewListing = Omit<Listing, "id"> & {
  id?: string;
};

interface ListingsContextType {
  listings: Listing[];
  addListing: (listing: NewListing) => Listing;
  updateListing: (id: string, updates: Partial<Omit<Listing, "id">>) => void;
  updateListingStatus: (id: string, status: ListingStatus) => void;
  deleteListing: (id: string) => void;
  getListingById: (id: string) => Listing | undefined;
}

const STORAGE_KEY = "dwello_listings";

export const INITIAL_LISTINGS: Listing[] = [
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

const ListingsContext = createContext<ListingsContextType | undefined>(
  undefined,
);

function loadListings(): Listing[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed: unknown = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        return parsed as Listing[];
      }
    }
  } catch (error) {
    console.error("Unable to load Dwello listings:", error);
  }

  return INITIAL_LISTINGS;
}

function createListingId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `property-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(loadListings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    } catch (error) {
      console.error("Unable to save Dwello listings:", error);
    }
  }, [listings]);

  const addListing = useCallback((listing: NewListing): Listing => {
    const newListing: Listing = {
      ...listing,
      id: listing.id || createListingId(),
    };

    setListings((current) => [newListing, ...current]);

    return newListing;
  }, []);

  const updateListing = useCallback(
    (id: string, updates: Partial<Omit<Listing, "id">>) => {
      setListings((current) =>
        current.map((listing) =>
          listing.id === id ? { ...listing, ...updates, id } : listing,
        ),
      );
    },
    [],
  );

  const updateListingStatus = useCallback(
    (id: string, status: ListingStatus) => {
      setListings((current) =>
        current.map((listing) =>
          listing.id === id ? { ...listing, status } : listing,
        ),
      );
    },
    [],
  );

  const deleteListing = useCallback((id: string) => {
    setListings((current) => current.filter((listing) => listing.id !== id));
  }, []);

  const getListingById = useCallback(
    (id: string) => listings.find((listing) => listing.id === id),
    [listings],
  );

  return (
    <ListingsContext.Provider
      value={{
        listings,
        addListing,
        updateListing,
        updateListingStatus,
        deleteListing,
        getListingById,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);

  if (!context) {
    throw new Error("useListings must be used within a ListingsProvider");
  }

  return context;
}
