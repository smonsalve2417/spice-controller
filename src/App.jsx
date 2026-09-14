import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import ConnectionPanel from './components/ConnectionPanel'
import DirectionPad from './components/DirectionPad'
import NumericKeypad from './components/NumericKeypad'
import usePressedControls from './hooks/usePressedControls'

function App() {
  const [config, setConfig] = useState({ host: 'localhost', port: '1337', password: '' })
  const { pressed, press, release, connect, disconnect, connection, error } = usePressedControls(config)

  const handleConfigChange = (event) => {
    const { name, value } = event.target
    setConfig((current) => ({ ...current, [name]: value }))
  }

  return (
    <main className="controller-shell">
      <Header connection={connection} />
      <ConnectionPanel config={config} connection={connection} error={error} onChange={handleConfigChange} onConnect={connect} onDisconnect={disconnect} />
      <section className="controls" aria-label="Controles del jugador 1">
        <div className="control-section direction-section">
          <div className="section-heading"><span className="section-number">01</span><div><h2>Dirección</h2><p>Navegación del menú</p></div></div>
          <DirectionPad pressed={pressed} onPress={press} onRelease={release} />
        </div>
        <div className="divider" />
        <div className="control-section keypad-section">
          <div className="section-heading"><span className="section-number">02</span><div><h2>Teclado</h2><p>Entrada numérica</p></div></div>
          <NumericKeypad pressed={pressed} onPress={press} onRelease={release} />
        </div>
      </section>
      <footer><span>PLAYER 1</span><span>HOLD TO ACTIVATE</span></footer>
    </main>
  )
}

export default App
