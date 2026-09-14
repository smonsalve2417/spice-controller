import ControlButton from './ControlButton'
import './DirectionPad.css'
import './CardPad.css'



function CardPad({ pressed, onPress, onRelease, player }) {
  return (
    <div className="tarjeta" aria-label="Direcciones">

        <ControlButton
          key="card"
          id="card"
          label="Tarjeta"
          display={`Tarjeta P${player+1}`}
          className="card-button"
          pressed={pressed.has("card")}
          onPress={onPress}
          onRelease={onRelease}
        />
    </div>
  )
}

export default CardPad