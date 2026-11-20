import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";

interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => void;
  removeFavorite: (propertyId: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "dwello-favorites";

interface FavoritesProviderProps {
  children: ReactNode;
}

function getStoredFavorites(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getStoredFavorites);

  const { user } = useAuth();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Keep favorites available in memory if browser storage is unavailable.
    }
  }, [favoriteIds]);

  const isFavorite = useCallback(
    (propertyId: string) => favoriteIds.includes(propertyId),
    [favoriteIds],
  );

  // Authentication guard: guests cannot modify favorites.
  const toggleFavorite = useCallback(
    (propertyId: string) => {
      if (!user) return;

      setFavoriteIds((current) =>
        current.includes(propertyId)
          ? current.filter((id) => id !== propertyId)
          : [...current, propertyId],
      );
    },
    [user],
  );

  const removeFavorite = useCallback(
    (propertyId: string) => {
      if (!user) return;

      setFavoriteIds((current) => current.filter((id) => id !== propertyId));
    },
    [user],
  );

  const clearFavorites = useCallback(() => {
    if (!user) return;

    setFavoriteIds([]);
  }, [user]);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
}
