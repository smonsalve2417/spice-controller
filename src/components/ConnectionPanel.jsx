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