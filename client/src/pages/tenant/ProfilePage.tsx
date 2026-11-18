import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  Check,
  ChevronRight,
  CircleUserRound,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Alert from "../../components/ui/Alert";
import Avatar from "../../components/ui/Avatar";
import { useFavorites } from "../../hooks/FavouritesContext";
import { useEnquiries } from "../../hooks/EnquiriesContext";

interface TenantProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
}

const PROFILE_STORAGE_KEY = "dwello-tenant-profile";
const PREFERENCES_STORAGE_KEY = "dwello-tenant-preferences";

const DEFAULT_PROFILE: TenantProfile = {
  name: "Dwello Tenant",
  email: "tenant@example.com",
  phone: "",
  location: "",
};

function getStoredProfile(): TenantProfile {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);

    if (!stored) return DEFAULT_PROFILE;

    const parsed = JSON.parse(stored) as Partial<TenantProfile>;

    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      email: DEFAULT_PROFILE.email,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

function getStoredPreferences() {
  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);

    if (!stored) {
      return {
        emailNotifications: true,
        enquiryUpdates: true,
      };
    }

    return JSON.parse(stored) as {
      emailNotifications: boolean;
      enquiryUpdates: boolean;
    };
  } catch {
    return {
      emailNotifications: true,
      enquiryUpdates: true,
    };
  }
}

function ProfilePage() {
  const navigate = useNavigate();
  const { favoriteIds } = useFavorites();
  const { enquiries } = useEnquiries();

  const [profile, setProfile] = useState<TenantProfile>(getStoredProfile);
  const [form, setForm] = useState<TenantProfile>(getStoredProfile);
  const [isEditing, setIsEditing] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState(getStoredPreferences);
  const [activeSection, setActiveSection] = useState<
    "profile" | "security" | "preferences"
  >("profile");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSignOut, setShowSignOut] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Keep the profile available in the current session.
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(
        PREFERENCES_STORAGE_KEY,
        JSON.stringify(preferences),
      );
    } catch {
      // Keep preferences available in the current session.
    }
  }, [preferences]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage("");
  };

  const handleProfileSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (form.phone && !/^[+\d\s()-]{7,18}$/.test(form.phone)) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }

    const updatedProfile = {
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
    };

    setProfile(updatedProfile);
    setForm(updatedProfile);
    setIsEditing(false);
    showSuccess("Your profile has been updated successfully.");
  };

  const handleCancelEdit = () => {
    setForm(profile);
    setIsEditing(false);
    setErrorMessage("");
  };

  const handlePasswordChange = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passwordForm.currentPassword.length < 6) {
      setErrorMessage("Please enter a valid current password.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setErrorMessage("Your new password must contain at least 8 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage("The new passwords do not match.");
      return;
    }

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    showSuccess(
      "Demo password validation completed. Connect authentication to save a real password.",
    );
  };

  const handleSignOut = () => {
    setShowSignOut(false);
    navigate("/login");
  };

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }));

    showSuccess("Your preferences have been saved.");
  };

  const displayName = profile.name || "Tenant";

  const navigationItems = [
    {
      id: "profile" as const,
      label: "Personal information",
      description: "Manage your personal details",
      icon: UserRound,
    },
    {
      id: "security" as const,
      label: "Password & security",
      description: "Manage your account password",
      icon: ShieldCheck,
    },
    {
      id: "preferences" as const,
      label: "Notifications",
      description: "Manage your notification preferences",
      icon: Bell,
    },
  ];

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
        {/* Page heading */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted">
            <Link
              to="/dashboard"
              className="transition-colors hover:text-brand"
            >
              Dashboard
            </Link>
            <ChevronRight size={14} />
            <span className="font-semibold text-ink">My Profile</span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-[34px]">
                My Profile
              </h1>
              <p className="mt-1.5 text-sm text-muted">
                Manage your personal information and account settings.
              </p>
            </div>

            <Badge variant="success" className="px-3 py-1.5">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} />
                Tenant account
              </span>
            </Badge>
          </div>
        </div>

        {/* Feedback */}
        <AnimatePresence mode="wait">
          {successMessage && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-4"
            >
              <Alert
                variant="success"
                title="All set"
                onClose={() => setSuccessMessage("")}
              >
                {successMessage}
              </Alert>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-4"
            >
              <Alert
                variant="error"
                title="Something needs attention"
                onClose={() => setErrorMessage("")}
              >
                {errorMessage}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile overview */}
        <Card padding="md" className="mb-6 overflow-hidden">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative shrink-0">
                <Avatar
                  name={displayName}
                  size="xl"
                  className="ring-4 ring-brand-light"
                />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-success text-white">
                  <Check size={11} strokeWidth={3} />
                </span>
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-extrabold text-ink">
                  {displayName}
                </h2>
                <p className="mt-0.5 truncate text-sm text-muted">
                  {profile.email}
                </p>
                <p className="mt-1 text-xs font-semibold text-success">
                  Dwello tenant
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[250px]">
              <div className="rounded-xl bg-brand-soft px-4 py-3">
                <p className="text-2xl font-extrabold text-brand">
                  {favoriteIds.length}
                </p>
                <p className="mt-0.5 text-xs font-medium text-muted">
                  Saved properties
                </p>
              </div>

              <div className="rounded-xl bg-surface-muted px-4 py-3">
                <p className="text-2xl font-extrabold text-ink">
                  {enquiries.length}
                </p>
                <p className="mt-0.5 text-xs font-medium text-muted">
                  Total enquiries
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Main layout */}
        <div className="grid items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Sidebar */}
          <Card padding="sm" className="lg:sticky lg:top-24">
            <p className="px-3 pb-3 pt-2 text-[11px] font-extrabold uppercase tracking-[1.2px] text-subtle">
              Account settings
            </p>

            <nav className="space-y-1" aria-label="Profile sections">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(item.id);
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
                      active
                        ? "bg-brand-light text-brand"
                        : "text-ink-secondary hover:bg-surface-muted"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        active
                          ? "bg-white text-brand shadow-soft"
                          : "bg-surface-muted text-muted"
                      }`}
                    >
                      <Icon size={17} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">
                        {item.label}
                      </span>
                      <span
                        className={`mt-0.5 block text-[11px] ${
                          active ? "text-brand/75" : "text-muted"
                        }`}
                      >
                        {item.description}
                      </span>
                    </span>

                    <ChevronRight
                      size={15}
                      className={active ? "text-brand" : "text-subtle"}
                    />
                  </button>
                );
              })}
            </nav>

            <div className="my-3 border-t border-border" />

            <button
              type="button"
              onClick={() => setShowSignOut(true)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-danger transition-colors hover:bg-danger-light"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-danger-light">
                <LogOut size={17} />
              </span>
              <span className="text-sm font-bold">Sign out</span>
            </button>
          </Card>

          {/* Content */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              {activeSection === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.18 }}
                >
                  <Card padding="lg">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-extrabold text-ink">
                          Personal information
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                          Your details help landlords respond to your enquiries.
                        </p>
                      </div>

                      {!isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Pencil size={15} />}
                          onClick={() => {
                            setForm(profile);
                            setIsEditing(true);
                            setErrorMessage("");
                            setSuccessMessage("");
                          }}
                        >
                          Edit profile
                        </Button>
                      )}
                    </div>

                    <form onSubmit={handleProfileSave}>
                      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                        <Input
                          label="Full name"
                          placeholder="Enter your full name"
                          value={form.name}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              name: event.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          leftIcon={<UserRound size={16} />}
                        />

                        <Input
                          label="Email address"
                          value={profile.email}
                          disabled
                          leftIcon={<Mail size={16} />}
                          hint="Email changes will be supported after authentication is connected."
                        />

                        <Input
                          label="Phone number"
                          placeholder="Enter your phone number"
                          value={form.phone}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              phone: event.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          leftIcon={<Phone size={16} />}
                        />

                        <Input
                          label="City / Location"
                          placeholder="e.g. Bengaluru"
                          value={form.location}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              location: event.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          leftIcon={<MapPin size={16} />}
                        />
                      </div>

                      {isEditing && (
                        <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelEdit}
                            leftIcon={<X size={15} />}
                          >
                            Cancel
                          </Button>

                          <Button type="submit" leftIcon={<Save size={15} />}>
                            Save changes
                          </Button>
                        </div>
                      )}
                    </form>
                  </Card>

                  <Card padding="lg" className="mt-5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-info-light text-info">
                        <CircleUserRound size={19} />
                      </span>
                      <div>
                        <h3 className="font-bold text-ink">
                          Your Dwello account
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          Your account is currently running in frontend demo
                          mode. Profile details are stored locally in this
                          browser and are not synced to a server.
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeSection === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.18 }}
                >
                  <Card padding="lg">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                        <KeyRound size={20} />
                      </span>
                      <div>
                        <h2 className="text-lg font-extrabold text-ink">
                          Password & security
                        </h2>
                        <p className="mt-0.5 text-sm text-muted">
                          Update your account password.
                        </p>
                      </div>
                    </div>

                    <Alert variant="warning" className="mb-6">
                      This is a frontend demonstration. No real password is
                      changed or stored.
                    </Alert>

                    <form
                      onSubmit={handlePasswordChange}
                      className="max-w-[520px] space-y-5"
                    >
                      <Input
                        label="Current password"
                        type="password"
                        placeholder="Enter current password"
                        value={passwordForm.currentPassword}
                        onChange={(event) =>
                          setPasswordForm((current) => ({
                            ...current,
                            currentPassword: event.target.value,
                          }))
                        }
                      />

                      <Input
                        label="New password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={passwordForm.newPassword}
                        onChange={(event) =>
                          setPasswordForm((current) => ({
                            ...current,
                            newPassword: event.target.value,
                          }))
                        }
                        hint="Use at least 8 characters."
                      />

                      <Input
                        label="Confirm new password"
                        type="password"
                        placeholder="Re-enter your new password"
                        value={passwordForm.confirmPassword}
                        onChange={(event) =>
                          setPasswordForm((current) => ({
                            ...current,
                            confirmPassword: event.target.value,
                          }))
                        }
                      />

                      <div className="pt-2">
                        <Button type="submit" leftIcon={<KeyRound size={15} />}>
                          Update password
                        </Button>
                      </div>
                    </form>
                  </Card>
                </motion.div>
              )}

              {activeSection === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.18 }}
                >
                  <Card padding="lg">
                    <div className="mb-6">
                      <h2 className="text-lg font-extrabold text-ink">
                        Notification preferences
                      </h2>
                      <p className="mt-1 text-sm text-muted">
                        Choose which updates you'd like to receive.
                      </p>
                    </div>

                    <div className="divide-y divide-border">
                      {/* Email notifications */}
                      <div className="flex items-center justify-between gap-4 py-5 first:pt-0">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                            <Mail size={18} />
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-ink">
                              Email notifications
                            </h3>
                            <p className="mt-1 text-xs leading-relaxed text-muted">
                              Receive important account updates by email.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={preferences.emailNotifications}
                          aria-label="Email notifications"
                          onClick={() =>
                            updatePreference(
                              "emailNotifications",
                              !preferences.emailNotifications,
                            )
                          }
                          style={{
                            width: "48px",
                            minWidth: "48px",
                            maxWidth: "48px",
                            height: "28px",
                            minHeight: "28px",
                            padding: 0,
                            borderRadius: "999px",
                            boxSizing: "border-box",
                            position: "relative",
                            display: "block",
                            flexShrink: 0,
                            border: preferences.emailNotifications
                              ? "1px solid #D93636"
                              : "1px solid #DCDCD9",
                            backgroundColor: preferences.emailNotifications
                              ? "#D93636"
                              : "#E5E5E5",
                            cursor: "pointer",
                            transition:
                              "background-color 200ms ease, border-color 200ms ease",
                          }}
                          className="focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15"
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              position: "absolute",
                              top: "3px",
                              left: preferences.emailNotifications
                                ? "24px"
                                : "3px",
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              backgroundColor: "#FFFFFF",
                              border: "1px solid rgba(0, 0, 0, 0.06)",
                              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.18)",
                              transition: "left 200ms ease",
                              pointerEvents: "none",
                            }}
                          />
                        </button>
                      </div>

                      {/* Enquiry updates */}
                      <div className="flex items-center justify-between gap-4 py-5">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-light text-success">
                            <Bell size={18} />
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-ink">
                              Enquiry updates
                            </h3>
                            <p className="mt-1 text-xs leading-relaxed text-muted">
                              Stay informed when landlords respond to your
                              enquiries.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={preferences.enquiryUpdates}
                          aria-label="Enquiry updates"
                          onClick={() =>
                            updatePreference(
                              "enquiryUpdates",
                              !preferences.enquiryUpdates,
                            )
                          }
                          style={{
                            width: "48px",
                            minWidth: "48px",
                            maxWidth: "48px",
                            height: "28px",
                            minHeight: "28px",
                            padding: 0,
                            borderRadius: "999px",
                            boxSizing: "border-box",
                            position: "relative",
                            display: "block",
                            flexShrink: 0,
                            border: preferences.enquiryUpdates
                              ? "1px solid #D93636"
                              : "1px solid #DCDCD9",
                            backgroundColor: preferences.enquiryUpdates
                              ? "#D93636"
                              : "#E5E5E5",
                            cursor: "pointer",
                            transition:
                              "background-color 200ms ease, border-color 200ms ease",
                          }}
                          className="focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15"
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              position: "absolute",
                              top: "3px",
                              left: preferences.enquiryUpdates ? "24px" : "3px",
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              backgroundColor: "#FFFFFF",
                              border: "1px solid rgba(0, 0, 0, 0.06)",
                              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.18)",
                              transition: "left 200ms ease",
                              pointerEvents: "none",
                            }}
                          />
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 rounded-lg bg-surface-muted px-3 py-2.5 text-xs text-muted">
                      Preferences are saved locally in this browser. Actual
                      notifications will be connected when the backend is
                      implemented.
                    </p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Sign-out confirmation */}
      <AnimatePresence>
        {showSignOut && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowSignOut(false);
              }
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="signout-title"
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[410px] rounded-2xl bg-white p-6 shadow-hover"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-danger-light text-danger">
                <LogOut size={21} />
              </div>

              <h2
                id="signout-title"
                className="text-lg font-extrabold text-ink"
              >
                Sign out of Dwello?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                You'll be redirected to the login page. Your saved properties
                and enquiries will remain in this browser.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowSignOut(false)}>
                  Stay here
                </Button>
                <Button
                  variant="danger"
                  onClick={handleSignOut}
                  leftIcon={<LogOut size={15} />}
                >
                  Sign out
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default ProfilePage;
