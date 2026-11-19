import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type EnquiryStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "closed"
  | "cancelled";

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  city: string;
  propertyImage: string;
  rent: number;
  tenantName: string;
  tenantEmail: string;
  moveInDate: string;
  message: string;
  submittedAt: string;
  status: EnquiryStatus;
}

export interface CreateEnquiryData {
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  city: string;
  propertyImage: string;
  rent: number;
  tenantName: string;
  tenantEmail: string;
  moveInDate: string;
  message: string;
}

interface EnquiriesContextValue {
  enquiries: Enquiry[];
  addEnquiry: (data: CreateEnquiryData) => void;
  cancelEnquiry: (enquiryId: string) => void;
  updateEnquiryStatus: (enquiryId: string, status: EnquiryStatus) => void;
  getEnquiryById: (enquiryId: string) => Enquiry | undefined;
}

const EnquiriesContext = createContext<EnquiriesContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "dwello-enquiries";

interface EnquiriesProviderProps {
  children: ReactNode;
}

function getStoredEnquiries(): Enquiry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function EnquiriesProvider({ children }: EnquiriesProviderProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(getStoredEnquiries);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries));
    } catch {
      // Keep enquiries in memory if localStorage is unavailable.
    }
  }, [enquiries]);

  const addEnquiry = useCallback((data: CreateEnquiryData) => {
    const newEnquiry: Enquiry = {
      ...data,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    setEnquiries((current) => [newEnquiry, ...current]);
  }, []);

  const cancelEnquiry = useCallback((enquiryId: string) => {
    setEnquiries((current) =>
      current.map((enquiry) =>
        enquiry.id === enquiryId && enquiry.status === "pending"
          ? { ...enquiry, status: "cancelled" }
          : enquiry,
      ),
    );
  }, []);

  const updateEnquiryStatus = useCallback(
    (enquiryId: string, status: EnquiryStatus) => {
      setEnquiries((current) =>
        current.map((enquiry) =>
          enquiry.id === enquiryId &&
          enquiry.status !== "cancelled" &&
          enquiry.status !== "closed"
            ? { ...enquiry, status }
            : enquiry,
        ),
      );
    },
    [],
  );

  const getEnquiryById = useCallback(
    (enquiryId: string) =>
      enquiries.find((enquiry) => enquiry.id === enquiryId),
    [enquiries],
  );

  return (
    <EnquiriesContext.Provider
      value={{
        enquiries,
        addEnquiry,
        cancelEnquiry,
        updateEnquiryStatus,
        getEnquiryById,
      }}
    >
      {children}
    </EnquiriesContext.Provider>
  );
}

export function useEnquiries() {
  const context = useContext(EnquiriesContext);

  if (!context) {
    throw new Error("useEnquiries must be used within an EnquiriesProvider");
  }

  return context;
}
