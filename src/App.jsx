import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import ConnectionPanel from "./components/ConnectionPanel";
import DirectionPad from "./components/DirectionPad";
import NumericKeypad from "./components/NumericKeypad";
import usePressedControls from "./hooks/usePressedControls";
import CardPad from "./components/CardPad";
import AdminPanel from "./components/AdminPanel";

const CONFIG_STORAGE_KEY = "spice-controller.config";
const defaultConfig = {
  host: "localhost",
  port: "5000",
  password: "",
  card: "",
  player: 0,
  admin: "",
  pass: "",
};

function loadConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY));
    return saved && typeof saved === "object"
      ? { ...defaultConfig, ...saved }
      : defaultConfig;
  } catch {
    return defaultConfig;
  }
}

function App() {
  const [config, setConfig] = useState(loadConfig);
  const playerNumber = Number(config.player) + 1;
  const {
    pressed,
    press,
    release,
    connect,
    disconnect,
    addCredit,
    connection,
    error,
  } = usePressedControls(config);

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
      connect();
    } catch {
      // La conexión sigue funcionando aunque el navegador bloquee el almacenamiento.
    }
  }, [config]);

  useEffect(() => {
    try {
      connect();
    } catch {
      // La conexión sigue funcionando aunque el navegador bloquee el almacenamiento.
    }
  }, []);

  const handleConfigChange = (event) => {
    const { name, value } = event.target;
    setConfig((current) => ({ ...current, [name]: value }));
  };

  return (
    <main className="controller-shell">
      <Header connection={connection} />
      <ConnectionPanel
        config={config}
        connection={connection}
        error={error}
        onChange={handleConfigChange}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      <AdminPanel
        connection={connection}
        player={config.player}
        admin={config.admin}
        onAddCredit={addCredit}
      />

      <section
        className="controls"
        aria-label={`Controles del jugador ${playerNumber}`}
      >
        <div className="control-section direction-section">
          <div className="section-heading">
            <span className="section-number">00</span>
            <div>
              <h2>Tarjeta</h2>
            </div>
          </div>
          <CardPad
            pressed={pressed}
            onPress={press}
            onRelease={release}
            player={config.player}
            card={config.card}
          />
        </div>
        <div className="control-section direction-section">
          <div className="section-heading">
            <span className="section-number">01</span>
            <div>
              <h2>Dirección</h2>
              <p>Navegación del menú</p>
            </div>
          </div>
          <DirectionPad
            pressed={pressed}
            onPress={press}
            onRelease={release}
            player={config.player}
          />
        </div>
        <div className="divider" />
        <div className="control-section keypad-section">
          <div className="section-heading">
            <span className="section-number">02</span>
            <div>
              <h2>Teclado</h2>
              <p>Entrada numérica</p>
            </div>
          </div>
          <NumericKeypad
            pressed={pressed}
            onPress={press}
            onRelease={release}
          />
        </div>
      </section>
    </main>
  );
}

export default App;
