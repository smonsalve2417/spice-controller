import ControlButton from "./ControlButton";
import "./DirectionPad.css";
import "./CardPad.css";

function CardPad({ pressed, onPress, onRelease, player, card }) {
  const playerIndex = Number(player) + 1;
  const cardCode = String(card || "")
    .trim()
    .toUpperCase();
  return (
    <div className="tarjeta" aria-label="Tarjeta">
      <ControlButton
        key="card"
        id="card"
        label={`Tarjeta P${playerIndex}${cardCode ? ` ${cardCode}` : ""}`}
        display={
          <>
            <span className="card-title">Tarjeta P{playerIndex}</span>
            {cardCode && <span className="card-code">{cardCode}</span>}
          </>
        }
        className={`card-button p${playerIndex}-card`}
        pressed={pressed.has("card")}
        onPress={onPress}
        onRelease={onRelease}
      />
    </div>
  );
}

export default CardPad;
