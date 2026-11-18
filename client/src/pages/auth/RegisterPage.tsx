import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  House,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

type AccountRole = "tenant" | "landlord";

export default function RegisterPage() {
  const [role, setRole] = useState<AccountRole>("tenant");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSubmitted(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setError("");
    setSubmitted(true);

    // Account creation will be connected to the backend later.
  };

  return (
    <main className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-canvas px-4 py-8 sm:py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-card sm:p-9">
        {/* Heading */}
        <div className="mb-7 text-center">
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Create your Dwello account
          </h1>

          <p className="mt-2 text-sm text-muted">
            Join Dwello and make your next move easier.
          </p>
        </div>

        {/* Account role */}
        <div className="mb-7">
          <h2 className="mb-3 text-sm font-bold text-ink">
            I want to join Dwello as a
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setRole("tenant")}
              aria-pressed={role === "tenant"}
              className={`relative flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                role === "tenant"
                  ? "border-brand bg-brand-light/60 ring-1 ring-brand"
                  : "border-border bg-white hover:border-brand/50"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                  role === "tenant"
                    ? "bg-brand text-white"
                    : "bg-surface-muted text-muted"
                }`}
              >
                <House size={21} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-ink">Tenant</span>
                <span className="mt-1 block text-xs leading-5 text-muted">
                  Find and rent your next home.
                </span>
              </span>

              {role === "tenant" && (
                <CheckCircle2 size={19} className="shrink-0 text-brand" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setRole("landlord")}
              aria-pressed={role === "landlord"}
              className={`relative flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                role === "landlord"
                  ? "border-brand bg-brand-light/60 ring-1 ring-brand"
                  : "border-border bg-white hover:border-brand/50"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                  role === "landlord"
                    ? "bg-brand text-white"
                    : "bg-surface-muted text-muted"
                }`}
              >
                <Building2 size={21} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-ink">
                  Landlord
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted">
                  List and manage your properties.
                </span>
              </span>

              {role === "landlord" && (
                <CheckCircle2 size={19} className="shrink-0 text-brand" />
              )}
            </button>
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <div className="mb-5">
            <Alert variant="error" title="Unable to continue">
              {error}
            </Alert>
          </div>
        )}

        {submitted && (
          <div className="mb-5">
            <Alert variant="success" title="Registration form completed">
              Your {role} registration details are ready. Actual account
              creation will be enabled when the backend is connected.
            </Alert>
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full name"
            placeholder="Enter your full name"
            leftIcon={<UserRound size={18} />}
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />

          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail size={18} />}
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              leftIcon={<LockKeyhole size={18} />}
              value={formData.password}
              onChange={(event) => updateField("password", event.target.value)}
              required
            />

            <Input
              label="Confirm password"
              type="password"
              placeholder="Re-enter password"
              leftIcon={<LockKeyhole size={18} />}
              value={formData.confirmPassword}
              onChange={(event) =>
                updateField("confirmPassword", event.target.value)
              }
              required
            />
          </div>

          {/* Terms */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => {
                setAcceptedTerms(event.target.checked);
                setError("");
              }}
              className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-brand"
            />

            <span className="text-sm leading-6 text-muted">
              I agree to Dwello's{" "}
              <Link
                to="/terms"
                className="font-semibold text-brand hover:text-brand-dark"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="font-semibold text-brand hover:text-brand-dark"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Create {role === "tenant" ? "tenant" : "landlord"} account
          </Button>
        </form>

        {/* Login link */}
        <p className="mt-7 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-brand transition hover:text-brand-dark"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
