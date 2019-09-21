import React, { useState } from "react";

export default function GameSelectionScreen ({
  startGameWithParameters
}) {
  const [isMultiplayer, setIsMultiplayer] = useState(true);
  const [gameName, setGameName] = useState("");
  function startGame () {
    startGameWithParameters({ isMultiplayer, name: gameName });
  }
  return <div className="game-selection__container">
    <h2>Configure Game</h2>
    <div className="game-selection__name">
      <label htmlFor="game-name">Game Name: </label>
      <input
        id="game-name"
        type="text"
        value={gameName}
        onChange={e => setGameName(e.target.value)}
        />
    </div>
    <div className="game-selection__multiplayer">
      <input
        id="game-type"
        type="checkbox"
        checked={isMultiplayer}
        onChange={e => setIsMultiplayer(!isMultiplayer)}
        />
      <label htmlFor="game-type">Multiplayer</label>
    </div>
    <div>
      <button onClick={startGame} disabled={isMultiplayer && !gameName}>Start</button>
    </div>
  </div>;
}
