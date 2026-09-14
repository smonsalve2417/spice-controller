import './ControlButton.css'

function ControlButton({ id, label, display, className = '', pressed, onPress, onRelease }) {
  const handleRelease = () => onRelease(id)

  return (
    <button
      type="button"
      className={`control-button ${className} ${pressed ? 'is-pressed' : ''}`}
      aria-label={label}
      aria-pressed={pressed}
      onPointerDown={() => onPress(id)}
      onPointerUp={handleRelease}
      onPointerLeave={handleRelease}
      onPointerCancel={handleRelease}
    >
      {display ?? label}
    </button>
  )
}

export default ControlButton