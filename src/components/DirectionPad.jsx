import ControlButton from './ControlButton'
import StartButton from './StartButton'
import './DirectionPad.css'

const directions = [
  { id: 'up', label: 'Arriba', symbol: '↑', className: 'up' },
  { id: 'left', label: 'Izquierda', symbol: '←', className: 'left' },
  { id: 'down', label: 'Abajo', symbol: '↓', className: 'down' },
  { id: 'right', label: 'Derecha', symbol: '→', className: 'right' },
]

function DirectionPad({ pressed, onPress, onRelease, player }) {
  return (
    <div className="direction-pad" aria-label="Direcciones">
      {directions.map(({ id, label, symbol, className }) => (
        <ControlButton
          key={id}
          id={id}
          label={label}
          display={symbol}
          className={`direction-button ${className}`}
          pressed={pressed.has(id)}
          onPress={onPress}
          onRelease={onRelease}
        />
      ))}
      <StartButton pressed={pressed} onPress={onPress} onRelease={onRelease} player={player} />
    </div>
  )
}

export default DirectionPad