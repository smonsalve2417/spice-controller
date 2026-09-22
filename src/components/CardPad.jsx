import ControlButton from './ControlButton'
import './DirectionPad.css'
import './CardPad.css'



function CardPad({ pressed, onPress, onRelease, player }) {

  const playerIndex = Number(player)+1
  return (
    <div className="tarjeta" aria-label="Direcciones">

        <ControlButton
          key="card"
          id="card"
          label="Tarjeta"
          display={`Tarjeta P${playerIndex}`}
          className="card-button"
          pressed={pressed.has("card")}
          onPress={onPress}
          onRelease={onRelease}
      />
    </div>
  )
}

export default CardPad