import ControlButton from "./ControlButton";
import "./StartButton.css";

function StartButton({ pressed, onPress, onRelease, player }) {
  const playerNumber = Number(player) + 1;

  return (
    <div className="start-buttons" aria-label={`Botón P${playerNumber} Start`}>
      <div className="start-control">
        <ControlButton
          id="start"
          label={`P${playerNumber} Start`}
          display="▶"
          className={`start-button p${playerNumber}-start`}
          pressed={pressed.has("start")}
          onPress={onPress}
          onRelease={onRelease}
        />
        <span>P{playerNumber} START</span>
      </div>
    </div>
  );
}

export default StartButton;
