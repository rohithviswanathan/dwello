import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import type { ReactNode } from "react";

import { House } from "lucide-react";
import { motion } from "motion/react";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import PropertiesPage from "./pages/public/PropertiesPage";
import PropertyDetailsPage from "./pages/public/PropertyDetailsPage";

import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import RegisterPage from "./pages/auth/RegisterPage";

import MyEnquiriesPage from "./pages/tenant/MyEnquiriesPage";
import TenantDashboardPage from "./pages/tenant/TenantDashboardPage";
import ProfilePage from "./pages/tenant/ProfilePage";
import SavedPropertiesPage from "./pages/tenant/SavedPropertiesPage";

import LandLordDashboardPage from "./pages/landlord/LandLordDashboardPage";
import AddPropertyPage from "./pages/landlord/AddPropertyPage";
import ManageListingsPage from "./pages/landlord/ManageListingsPage";
import EditPropertyPage from "./pages/landlord/EditPropertyPage";
import LandLordEnquiriesPage from "./pages/landlord/LandLordEnquiriesPage";

import { FavoritesProvider } from "./hooks/FavouritesContext";
import { EnquiriesProvider } from "./hooks/EnquiriesContext";
import { ListingsProvider } from "./hooks/ListingsContext";
import { AuthProvider, useAuth, type AuthRole } from "./hooks/AuthContext";

function RequireRole({
  role,
  children,
}: {
  role: AuthRole;
  children: ReactNode;
}) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== role) {
    return (
      <Navigate
        to={user.role === "landlord" ? "/landlord/dashboard" : "/dashboard"}
        replace
      />
    );
  }

  return <>{children}</>;
}

function RequireAuthenticated({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (user) {
    return (
      <Navigate
        to={user.role === "landlord" ? "/landlord/dashboard" : "/dashboard"}
        replace
      />
    );
  }

  return <>{children}</>;
}

function AppLayout() {
  const { pathname } = useLocation();

  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    pathname,
  );

  return (
    <div className="flex min-h-screen flex-col">
      {/* Authentication page header */}
      {isAuthPage ? (
        <header className="flex h-[68px] shrink-0 items-center border-b border-border bg-white px-5 sm:px-8">
          <Link
            to="/"
            aria-label="Dwello home"
            className="group mx-auto flex shrink-0 items-center gap-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white transition-transform duration-200 group-hover:scale-105">
              <House size={20} strokeWidth={2.4} />
            </span>

            <span className="text-[23px] font-extrabold tracking-[-1.2px] text-ink">
              dwell<span className="text-brand">o</span>
            </span>
          </Link>
        </header>
      ) : (
        <Navbar />
      )}

      {/* Animated route content */}
      <div className="flex-1">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.22,
            ease: "easeOut",
          }}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PropertiesPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route
              path="/properties/:propertyId"
              element={<PropertyDetailsPage />}
            />

            {/* Tenant routes */}
            <Route
              path="/saved"
              element={
                <RequireRole role="tenant">
                  <SavedPropertiesPage />
                </RequireRole>
              }
            />

            <Route
              path="/my-enquiries"
              element={
                <RequireRole role="tenant">
                  <MyEnquiriesPage />
                </RequireRole>
              }
            />

            <Route
              path="/dashboard"
              element={
                <RequireRole role="tenant">
                  <TenantDashboardPage />
                </RequireRole>
              }
            />

            {/* Shared profile route — Tenant and Landlord */}
            <Route
              path="/profile"
              element={
                <RequireAuthenticated>
                  <ProfilePage />
                </RequireAuthenticated>
              }
            />

            {/* Landlord routes */}
            <Route
              path="/landlord/dashboard"
              element={
                <RequireRole role="landlord">
                  <LandLordDashboardPage />
                </RequireRole>
              }
            />

            <Route
              path="/landlord/listings"
              element={
                <RequireRole role="landlord">
                  <ManageListingsPage />
                </RequireRole>
              }
            />

            <Route
              path="/landlord/listings/new"
              element={
                <RequireRole role="landlord">
                  <AddPropertyPage />
                </RequireRole>
              }
            />

            <Route
              path="/landlord/listings/:listingId/edit"
              element={
                <RequireRole role="landlord">
                  <EditPropertyPage />
                </RequireRole>
              }
            />

            <Route
              path="/landlord/enquiries"
              element={
                <RequireRole role="landlord">
                  <LandLordEnquiriesPage />
                </RequireRole>
              }
            />

            {/* Guest routes */}
            <Route
              path="/login"
              element={
                <GuestOnlyRoute>
                  <LoginPage />
                </GuestOnlyRoute>
              }
            />

            <Route
              path="/register"
              element={
                <GuestOnlyRoute>
                  <RegisterPage />
                </GuestOnlyRoute>
              }
            />

            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/properties" replace />} />
          </Routes>
        </motion.div>
      </div>

      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ListingsProvider>
          <FavoritesProvider>
            <EnquiriesProvider>
              <AppLayout />
            </EnquiriesProvider>
          </FavoritesProvider>
        </ListingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
