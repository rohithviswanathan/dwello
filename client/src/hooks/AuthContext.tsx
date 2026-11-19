import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type AuthRole = "tenant" | "landlord";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
}

interface StoredAccount extends AuthUser {
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: AuthRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => AuthUser;
  register: (data: RegisterData) => AuthUser;
  updateProfile: (updates: { name: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCOUNTS_KEY = "dwello_accounts";
const SESSION_KEY = "dwello_session";

function getStoredAccounts(): StoredAccount[] {
  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed) ? (parsed as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function getStoredSession(): AuthUser | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);

    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "id" in parsed &&
      "name" in parsed &&
      "email" in parsed &&
      "role" in parsed &&
      (parsed.role === "tenant" || parsed.role === "landlord")
    ) {
      return parsed as AuthUser;
    }

    return null;
  } catch {
    return null;
  }
}

function createUserId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredSession);
  const [accounts, setAccounts] = useState<StoredAccount[]>(getStoredAccounts);

  useEffect(() => {
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch {
      // Accounts remain available in memory for this session.
    }
  }, [accounts]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // Authentication remains available in memory.
    }
  }, [user]);

  const login = useCallback(
    (email: string, password: string): AuthUser => {
      const normalizedEmail = email.trim().toLowerCase();

      const account = accounts.find(
        (item) =>
          item.email.toLowerCase() === normalizedEmail &&
          item.password === password,
      );

      if (!account) {
        throw new Error("Invalid email or password.");
      }

      const authenticatedUser: AuthUser = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
      };

      setUser(authenticatedUser);

      return authenticatedUser;
    },
    [accounts],
  );

  const register = useCallback(
    (data: RegisterData): AuthUser => {
      const normalizedEmail = data.email.trim().toLowerCase();

      const alreadyExists = accounts.some(
        (account) => account.email.toLowerCase() === normalizedEmail,
      );

      if (alreadyExists) {
        throw new Error("An account with this email already exists.");
      }

      const newAccount: StoredAccount = {
        id: createUserId(),
        name: data.name.trim(),
        email: normalizedEmail,
        password: data.password,
        role: data.role,
      };

      setAccounts((current) => [...current, newAccount]);

      const authenticatedUser: AuthUser = {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        role: newAccount.role,
      };

      setUser(authenticatedUser);

      return authenticatedUser;
    },
    [accounts],
  );

  const updateProfile = useCallback(
    (updates: { name: string }) => {
      const updatedName = updates.name.trim();

      if (!updatedName) {
        throw new Error("Name cannot be empty.");
      }

      if (!user) return;

      const updatedUser: AuthUser = {
        ...user,
        name: updatedName,
      };

      setUser(updatedUser);

      setAccounts((currentAccounts) =>
        currentAccounts.map((account) =>
          account.id === user.id ? { ...account, name: updatedName } : account,
        ),
      );
    },
    [user],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
