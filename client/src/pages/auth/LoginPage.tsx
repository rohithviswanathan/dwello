import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { useAuth } from "../../hooks/AuthContext";

interface LoginLocationState {
  from?:
    | string
    | {
        pathname?: string;
      };
  message?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  // Capture the incoming redirect state before clearing browser history state.
  const [redirectState] = useState<LoginLocationState | null>(
    () => location.state as LoginLocationState | null,
  );

  const redirectMessage = redirectState?.message;

  const requestedPath =
    typeof redirectState?.from === "string"
      ? redirectState.from
      : redirectState?.from?.pathname;

  // Clear the redirect state from the current history entry.
  // The message and destination remain available through component state.
  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [location.state, location.pathname, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const authenticatedUser = login(email, password);

      const defaultPath =
        authenticatedUser.role === "landlord"
          ? "/landlord/dashboard"
          : "/dashboard";

      navigate(requestedPath || defaultPath, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );

      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-canvas px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-white shadow-card md:grid-cols-2">
        {/* Branding panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-9 text-white md:flex">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-lg font-extrabold">
                D
              </span>

              <span className="text-2xl font-extrabold tracking-tight">
                Dwello
              </span>
            </Link>

            <div className="mt-10 max-w-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-300">
                Welcome back
              </p>

              <h1 className="mt-4 pt-5 font-display text-4xl font-semibold leading-tight text">
                Your next chapter starts at home.
              </h1>

              <p className="mt-5 pt-5 text-sm leading-7 text-white/65">
                Sign in to discover homes, manage your saved properties, and
                keep track of your rental enquiries.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-white/55">
            <ShieldCheck size={16} />A simpler way to find and manage rental
            homes.
          </div>
        </div>

        {/* Login form */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 md:hidden">
              <Link to="/" className="inline-flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-lg font-extrabold text-white">
                  D
                </span>

                <span className="text-xl font-extrabold text-ink">Dwello</span>
              </Link>
            </div>

            <div>
              <h2 className="font-display text-3xl font-semibold text-ink">
                Sign in to Dwello
              </h2>

              <p className="mt-2 pt-2 text-sm leading-6 text-muted">
                Enter your account details to continue.
              </p>
            </div>

            {redirectMessage && (
              <div className="mt-6 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm leading-6 text-ink">
                <div className="flex items-start gap-3">
                  <LockKeyhole
                    size={18}
                    className="mt-0.5 shrink-0 text-brand"
                  />

                  <p>{redirectMessage}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6">
                <Alert variant="error" title="Sign in failed">
                  {error}
                </Alert>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={18} />}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                required
              />

              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  leftIcon={<LockKeyhole size={18} />}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  required
                />

                <div className="mt-2 flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-brand transition hover:text-brand-dark"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Sign in
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted">NEW TO DWELLO?</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <p className="text-center text-sm text-muted">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-brand transition hover:text-brand-dark"
              >
                Create an account
              </Link>
            </p>

            <p className="pt-1 text-center text-xs leading-5 text-muted">
              By continuing, you agree to Dwello's Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
