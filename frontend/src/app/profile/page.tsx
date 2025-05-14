"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, token, updateProfile } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    vorname: "",
    nachname: "",
    telefon: "",
    firma: "",
    profilbild: ""
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    setFormData({
      vorname: user.vorname,
      nachname: user.nachname,
      telefon: user.telefon || "",
      firma: user.firma || "",
      profilbild: user.profilbild || ""
    });
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await updateProfile(formData);
      setSuccess("Profil erfolgreich aktualisiert");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 mb-4">Profil bearbeiten</h1>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
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
                    value={user.email}
                    disabled
                  />
                  <div className="form-text">
                    Die E-Mail-Adresse kann nicht geändert werden
                  </div>
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

                {user.accountTyp === "arbeitgeber" && (
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
                  <label htmlFor="profilbild" className="form-label">Profilbild URL</label>
                  <input
                    type="url"
                    className="form-control"
                    id="profilbild"
                    name="profilbild"
                    value={formData.profilbild}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Wird gespeichert..." : "Speichern"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 