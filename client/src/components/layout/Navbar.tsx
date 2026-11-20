import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  House,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const logoDestination =
    user?.role === "landlord" ? "/landlord/dashboard" : "/properties";

  const navigationLinks =
    user?.role === "landlord"
      ? [
          { label: "My Listings", to: "/landlord/listings" },
          { label: "Enquiries", to: "/landlord/enquiries" },
          { label: "Dashboard", to: "/landlord/dashboard" },
        ]
      : [
          ...(user?.role === "tenant"
            ? [
                { label: "Saved Properties", to: "/saved" },
                { label: "My Enquiries", to: "/my-enquiries" },
                { label: "Dashboard", to: "/dashboard" },
              ]
            : []),
        ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (loggingOut) return;

    setLoggingOut(true);
    closeMobileMenu();

    logoutTimerRef.current = setTimeout(() => {
      logout();
      navigate("/login", { replace: true });
    }, 300);
  };

  const dashboardPath =
    user?.role === "landlord" ? "/landlord/dashboard" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to={logoDestination}
          onClick={closeMobileMenu}
          aria-label="Dwello home"
          className="group flex shrink-0 items-center gap-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white transition-transform duration-200 group-hover:scale-105">
            <House size={20} strokeWidth={2.4} />
          </span>

          <span className="text-[23px] font-extrabold tracking-[-1.2px] text-ink">
            dwell<span className="text-brand">o</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 lg:gap-8 md:flex"
        >
          {navigationLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                relative py-2 text-[13px] font-bold
                transition-colors duration-200
                ${
                  isActive
                    ? "text-brand"
                    : "text-ink-secondary hover:text-brand"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {item.label}

                  <motion.span
                    className="absolute -bottom-[3px] left-0 h-[2px] rounded-full bg-brand"
                    initial={false}
                    animate={{
                      width: isActive ? "100%" : "0%",
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="
                  rounded-lg px-3.5 py-2.5
                  text-[13px] font-extrabold text-ink
                  transition-colors duration-200
                  hover:bg-surface-muted hover:text-brand
                "
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="
                  group inline-flex items-center gap-2
                  rounded-lg bg-brand px-4 py-2.5
                  text-[13px] font-extrabold text-white
                  shadow-soft transition-all duration-200
                  hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-card
                  active:translate-y-0
                "
              >
                List your property
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="
                  flex items-center gap-2 rounded-lg px-3 py-2
                  transition-colors duration-200
                  hover:bg-surface-muted
                "
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light text-brand">
                  <UserRound size={16} />
                </span>

                <span className="max-w-[120px] truncate text-[13px] font-bold text-ink">
                  {user?.name}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="
                  inline-flex items-center gap-2 rounded-lg
                  border border-border px-3.5 py-2.5
                  text-[13px] font-bold text-ink-secondary
                  transition-colors duration-200
                  hover:border-brand/30 hover:bg-brand-light hover:text-brand
                  disabled:pointer-events-none disabled:opacity-60
                "
              >
                <LogOut size={15} />
                Sign out
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="dwello-mobile-menu"
          disabled={loggingOut}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-lg border border-border text-ink
            transition-colors duration-200
            hover:border-brand/30 hover:bg-brand-light hover:text-brand
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand/30
            md:hidden
          "
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileMenuOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="dwello-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border bg-white md:hidden"
          >
            <motion.nav
              initial={{ y: -6 }}
              animate={{ y: 0 }}
              exit={{ y: -6 }}
              transition={{ duration: 0.18 }}
              aria-label="Mobile navigation"
              className="mx-auto flex max-w-[1280px] flex-col px-5 py-4 sm:px-6"
            >
              {/* Role-based links */}
              {navigationLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) => `
                    rounded-lg px-3 py-3
                    text-sm font-bold transition-colors duration-200
                    ${
                      isActive
                        ? "bg-brand-light text-brand"
                        : "text-ink-secondary hover:bg-surface-muted hover:text-brand"
                    }
                  `}
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="my-3 border-t border-border" />

              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="
                      rounded-lg px-3 py-3 text-sm font-bold
                      text-ink-secondary transition-colors
                      hover:bg-surface-muted hover:text-brand
                    "
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="
                      mt-2 flex items-center justify-center gap-2
                      rounded-lg bg-brand px-4 py-3
                      text-sm font-extrabold text-white
                      transition-colors duration-200
                      hover:bg-brand-dark
                    "
                  >
                    List your property
                    <ArrowUpRight size={16} />
                  </Link>
                </>
              ) : (
                <>
                  {/* Signed-in user */}
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3 rounded-lg px-3 py-3
                      text-sm font-bold text-ink-secondary
                      transition-colors hover:bg-surface-muted hover:text-brand
                    "
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-brand">
                      <UserRound size={17} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-ink">
                        {user?.name}
                      </span>

                      <span className="mt-0.5 block text-xs font-medium capitalize text-muted">
                        {user?.role} account
                      </span>
                    </span>
                  </Link>

                  <Link
                    to={dashboardPath}
                    onClick={closeMobileMenu}
                    className="
                      mt-1 flex items-center gap-2 rounded-lg px-3 py-3
                      text-sm font-bold text-ink-secondary
                      transition-colors hover:bg-surface-muted hover:text-brand
                    "
                  >
                    <LayoutDashboard size={17} />
                    My Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="
                      mt-2 flex w-full items-center gap-2 rounded-lg
                      px-3 py-3 text-left text-sm font-bold text-danger
                      transition-colors hover:bg-danger-light
                      disabled:pointer-events-none disabled:opacity-60
                    "
                  >
                    <LogOut size={17} />
                    Sign out
                  </button>
                </>
              )}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout transition overlay */}
      <AnimatePresence>
        {loggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="
              fixed inset-0 z-[100]
              flex items-center justify-center
              bg-white/80 backdrop-blur-md
            "
          >
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22, delay: 0.05 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-sm font-bold text-ink">Signing you out...</p>
              <motion.div className="h-1 w-28 overflow-hidden rounded-full bg-brand/10">
                <motion.div
                  className="h-full rounded-full bg-brand"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
