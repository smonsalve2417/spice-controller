import ControlButton from './ControlButton'
import './StartButton.css'

function StartButton({ pressed, onPress, onRelease }) {
  return (
    <div className="start-buttons" aria-label="Botones Start">
      <div className="start-control">
        <ControlButton
          id="p1-start"
          label="P1 Start"
          display="▶"
          className="start-button p1-start"
          pressed={pressed.has('p1-start')}
          onPress={onPress}
          onRelease={onRelease}
        />
        <span>P1 START</span>
      </div>
      <div className="start-control">
        <ControlButton
          id="p2-start"
          label="P2 Start"
          display="▶"
          className="start-button p2-start"
          pressed={pressed.has('p2-start')}
          onPress={onPress}
          onRelease={onRelease}
        />
        <span>P2 START</span>
      </div>
    </div>
  )
}

export default StartButton