import ControlButton from './ControlButton'
import './NumericKeypad.css'

const keys = [
  { id: '7', label: '7' }, { id: '8', label: '8' }, { id: '9', label: '9' },
  { id: '4', label: '4' }, { id: '5', label: '5' }, { id: '6', label: '6' },
  { id: '1', label: '1' }, { id: '2', label: '2' }, { id: '3', label: '3' },
  { id: '0', label: '0' },{ id: 'A', label: '00' },  { id: 'D', label: '.' },
]

function NumericKeypad({ pressed, onPress, onRelease }) {
  return (
    <div className="keypad" aria-label="Teclado numérico">
      {keys.map(({ id, label }) => (
        <ControlButton
          key={id}
          id={id}
          label={label === '00' ? 'Doble cero' : label}
          display={label}
          className="key-button"
          pressed={pressed.has(id)}
          onPress={onPress}
          onRelease={onRelease}
        />
      ))}
    </div>
  )
}

export default NumericKeypad