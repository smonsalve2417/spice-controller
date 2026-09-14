import './Header.css'

function Header({ connection }) {
  const label = connection === 'open' ? 'conectado' : connection === 'connecting' ? 'conectando' : 'desconectado'

  return (
    <header className="controller-header">
      <div>
        <p className="eyebrow">SPICE CONTROLLER</p>
        <h1>Controles virtuales</h1>
      </div>
      <span className={`connection-state ${connection}`}><i /> {label}</span>
    </header>
  )
}

export default Header