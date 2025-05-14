"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 mb-4 text-center">Passwort vergessen</h1>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success ? (
                <div>
                  <div className="alert alert-success">
                    <p className="mb-0">
                      Wenn ein Account mit dieser E-Mail-Adresse existiert, 
                      haben wir Ihnen eine E-Mail mit Anweisungen zum Zurücksetzen 
                      Ihres Passworts gesendet.
                    </p>
                  </div>
                  <div className="text-center">
                    <Link href="/login" className="btn btn-primary">
                      Zurück zum Login
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">E-Mail</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Wird gesendet..." : "Link zum Zurücksetzen senden"}
                    </button>
                  </div>

                  <div className="text-center mt-3">
                    <Link href="/login" className="text-decoration-none">
                      Zurück zum Login
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 