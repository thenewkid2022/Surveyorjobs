"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Settings() {
  const { user, changePassword, deleteAccount } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Die neuen Passwörter stimmen nicht überein");
      return false;
    }
    if (passwordData.newPassword.length < 8) {
      setError("Das neue Passwort muss mindestens 8 Zeichen lang sein");
      return false;
    }
    return true;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validatePasswordChange()) {
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess("Passwort erfolgreich geändert");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await deleteAccount();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
      setShowDeleteConfirm(false);
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
          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <h2 className="h4 mb-4">Passwort ändern</h2>

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

              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">Aktuelles Passwort</label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">Neues Passwort</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                  />
                  <div className="form-text">
                    Mindestens 8 Zeichen
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Neues Passwort bestätigen</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Wird geändert..." : "Passwort ändern"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card shadow-sm border-danger">
            <div className="card-body p-4">
              <h2 className="h4 mb-4 text-danger">Account löschen</h2>
              <p className="text-muted">
                Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten werden unwiderruflich gelöscht.
              </p>

              {showDeleteConfirm && (
                <div className="alert alert-danger">
                  <p className="mb-0">
                    Sind Sie sicher, dass Sie Ihren Account löschen möchten? 
                    Diese Aktion kann nicht rückgängig gemacht werden.
                  </p>
                </div>
              )}

              <div className="d-grid">
                <button
                  type="button"
                  className={`btn ${showDeleteConfirm ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                >
                  {isLoading 
                    ? "Wird gelöscht..." 
                    : showDeleteConfirm 
                      ? "Ja, Account endgültig löschen" 
                      : "Account löschen"
                  }
                </button>
                {showDeleteConfirm && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary mt-2"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isLoading}
                  >
                    Abbrechen
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 