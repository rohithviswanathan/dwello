import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

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
        <h1 className="font-display text-3xl font-semibold text-ink text-center">
          Forgot your password?
        </h1>

        <p className="mt-3 pt-3 text-sm leading-6 text-muted text-center">
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <Input
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

        <p className="mt-9 pt-2 text-center text-sm text-muted">
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
