"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    vorname: "",
    nachname: "",
    telefon: "",
    firma: "",
    accountTyp: "arbeitssuchender" as "arbeitssuchender" | "arbeitgeber"
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Die Passwörter stimmen nicht überein");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein");
      return false;
    }
    if (formData.accountTyp === "arbeitgeber" && !formData.firma) {
      setError("Bitte geben Sie den Firmennamen an");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 mb-4 text-center">Registrieren</h1>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="vorname" className="form-label">Vorname</label>
                    <input
                      type="text"
                      className="form-control"
                      id="vorname"
                      name="vorname"
                      value={formData.vorname}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="nachname" className="form-label">Nachname</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nachname"
                      name="nachname"
                      value={formData.nachname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">E-Mail</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="telefon" className="form-label">Telefon</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="telefon"
                    name="telefon"
                    value={formData.telefon}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="accountTyp" className="form-label">Ich bin</label>
                  <select
                    className="form-select"
                    id="accountTyp"
                    name="accountTyp"
                    value={formData.accountTyp}
                    onChange={handleChange}
                    required
                  >
                    <option value="arbeitssuchender">Arbeitssuchender</option>
                    <option value="arbeitgeber">Arbeitgeber</option>
                  </select>
                </div>

                {formData.accountTyp === "arbeitgeber" && (
                  <div className="mb-3">
                    <label htmlFor="firma" className="form-label">Firmenname</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firma"
                      name="firma"
                      value={formData.firma}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Passwort</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                  <div className="form-text">
                    Mindestens 8 Zeichen
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Passwort bestätigen</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Wird registriert..." : "Registrieren"}
                  </button>
                </div>
              </form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0">Bereits registriert?</p>
                <Link href="/login" className="btn btn-outline-primary mt-2">
                  Jetzt anmelden
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 