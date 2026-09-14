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
        <fieldset className="player-selector">
          <legend>Jugador</legend>
          <label className={String(config.player) === '0' ? 'selected' : ''}>
            <input name="player" type="radio" value="0" checked={String(config.player) === '0'} onChange={onChange} />
            <span>P1</span>
          </label>
          <label className={String(config.player) === '1' ? 'selected' : ''}>
            <input name="player" type="radio" value="1" checked={String(config.player) === '1'} onChange={onChange} />
            <span>P2</span>
          </label>
        </fieldset>
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