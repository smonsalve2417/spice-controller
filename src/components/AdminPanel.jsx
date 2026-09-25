import { useState } from "react";
import "./AdminPanel.css";

const adminUsername = import.meta.env.VITE_ADMIN_USERNAME || "ccsp";
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "2294";
const ADMIN_SESSION_STORAGE_KEY = "spice-controller.admin-session";

function loadAdminSession() {
  try {
    return localStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === adminUsername;
  } catch {
    return false;
  }
}

function AdminPanel({ connection, player, admin, onAddCredit }) {
  const [expanded, setExpanded] = useState(false);
  const [authenticated, setAuthenticated] = useState(loadAdminSession);
  const [username, setUsername] = useState(admin);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [creditMessage, setCreditMessage] = useState("");
  const [creditPending, setCreditPending] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === adminUsername && password === adminPassword) {
      setAuthenticated(true);
      setLoginError("");
      try {
        localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, adminUsername);
      } catch {
        // La sesión sólo se mantiene durante esta visita si el almacenamiento está bloqueado.
      }
      return;
    }
    setLoginError("Usuario o contraseña incorrectos.");
  };

  const handleAddCredit = () => {
    setCreditPending(true);
    setCreditMessage("");
    onAddCredit()
      .then(() => setCreditMessage("Crédito añadido."))
      .catch((error) => setCreditMessage(error.message))
      .finally(() => setCreditPending(false));
  };

  return (
    <section className="admin-panel" aria-label="Panel de administrador">
      <button
        type="button"
        className="admin-toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((current) => !current)}
      >
        <span aria-hidden="true">•••</span>
        <span>Administración</span>
      </button>

      {expanded && (
        <div className="admin-content">
          <div className="admin-heading">
            <div>
              <span className="admin-kicker">ADMIN</span>
              <h2>Operaciones de máquina</h2>
            </div>
            {authenticated && (
              <button
                type="button"
                className="admin-logout"
                onClick={() => {
                  setAuthenticated(false);
                  try {
                    localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
                  } catch {
                    // La sesión local ya se cerró aunque el almacenamiento esté bloqueado.
                  }
                }}
              >
                Cerrar sesión
              </button>
            )}
          </div>

          {!authenticated ? (
            <form className="admin-login" onSubmit={handleLogin}>
              <label>
                Usuario
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  required
                />
              </label>
              <label>
                Contraseña
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>
              <button type="submit">Acceder</button>
              {loginError && <p role="alert">{loginError}</p>}
            </form>
          ) : (
            <div className="admin-actions">
              <p>Añadir un crédito al jugador P{Number(player) + 1}.</p>
              <button
                type="button"
                onClick={handleAddCredit}
                disabled={connection !== "open" || creditPending}
              >
                {creditPending ? "Enviando..." : "Añadir crédito"}
              </button>
              {creditMessage && <p role="status">{creditMessage}</p>}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default AdminPanel;
