import './ConnectionPanel.css'

function ConnectionPanel({ config, connection, error, onChange, onConnect, onDisconnect }) {
  const connected = connection === 'open' || connection === 'connecting'

  return (
    <section className="connection-panel" aria-label="Conexión con Spice2x">
      <div className="connection-fields">
        <label>
          Host
          <input name="host" value={config.host} onChange={onChange} placeholder="127.0.0.1" />
        </label>
        <label>
          Puerto API
          <input name="port" type="number" min="1" max="65535" value={config.port} onChange={onChange} />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" value={config.password} onChange={onChange} />
        </label>
      </div>
      
      <div className="connection-fields">
        <label>
          Tarjeta
          <input name="card" type="text" value={config.card} onChange={onChange} placeholder="16 caracteres hex" maxLength="16" />
        </label>
      </div>
      <div className="connection-fields">
        <label>
          Jugador
          <input name="player" type="number" min="0" max="1" value={config.player} onChange={onChange} placeholder="P1 0 | P2 1" />
        </label>
      </div>
      <div className="connection-actions">
        <button type="button" onClick={connected ? onDisconnect : onConnect} disabled={connection === 'connecting'}>
          {connected ? 'Desconectar' : 'Conectar'}
        </button>
        {error && <p role="alert">{error}</p>}
      </div>

    </section>
  )
}

export default ConnectionPanel