import { useState } from "react";
import "./AdminPanel.css";

const adminUsername = import.meta.env.VITE_ADMIN_USERNAME || "admin";
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin";

function AdminPanel({ connection, player, onAddCredit }) {
  const [expanded, setExpanded] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [creditMessage, setCreditMessage] = useState("");
  const [creditPending, setCreditPending] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === adminUsername && password === adminPassword) {
      setAuthenticated(true);
      setLoginError("");
      setPassword("");
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
                onClick={() => setAuthenticated(false)}
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
