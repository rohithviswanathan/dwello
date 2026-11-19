import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { House } from "lucide-react";

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

import { FavoritesProvider } from "./hooks/FavouritesContext";
import { EnquiriesProvider } from "./hooks/EnquiriesContext";
import { ListingsProvider } from "./hooks/ListingsContext";

function AppLayout() {
  const { pathname } = useLocation();

  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    pathname,
  );

  return (
    <div className="flex min-h-screen flex-col">
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

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<PropertiesPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/saved" element={<SavedPropertiesPage />} />

          <Route path="/my-enquiries" element={<MyEnquiriesPage />} />
          <Route path="/dashboard" element={<TenantDashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route
            path="/landlord/dashboard"
            element={<LandLordDashboardPage />}
          />
          <Route path="/landlord/listings" element={<ManageListingsPage />} />
          <Route path="/landlord/listings/new" element={<AddPropertyPage />} />

          <Route
            path="/properties/:propertyId"
            element={<PropertyDetailsPage />}
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="*" element={<Navigate to="/properties" replace />} />
        </Routes>
      </div>

      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ListingsProvider>
        <FavoritesProvider>
          <EnquiriesProvider>
            <AppLayout />
          </EnquiriesProvider>
        </FavoritesProvider>
      </ListingsProvider>
    </BrowserRouter>
  );
}

export default App;
