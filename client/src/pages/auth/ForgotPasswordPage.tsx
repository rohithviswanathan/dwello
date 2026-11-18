import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-card sm:p-9">
        <Link
          to="/login"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand"
        >
          <ArrowLeft size={17} />
          Back to sign in
        </Link>

        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-brand">
          <Mail size={23} />
        </div>

        <h1 className="font-display text-3xl font-semibold text-ink">
          Forgot your password?
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted">
          Enter the email address associated with your Dwello account. We'll use
          it to help you reset your password.
        </p>

        {submitted && (
          <div className="mt-6">
            <Alert variant="info" title="Reset request captured">
              This is currently a frontend demo. Password reset emails will be
              enabled once the backend is connected.
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
              setSubmitted(false);
            }}
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Send reset instructions
          </Button>
        </form>

        <p className="mt-7 text-center text-sm text-muted">
          Remember your password?{" "}
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
