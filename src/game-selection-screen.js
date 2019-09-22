import React, { useState } from "react";

/**
 * Game selection/configuration screen
 * @param startGameWithParameters - callback to start the game
 */
export default function GameSelectionScreen ({
  startGameWithParameters
}) {
  const [gameName, setGameName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isMultiplayer, setIsMultiplayer] = useState(true);

  function startGame () {
    startGameWithParameters({ isMultiplayer, name: gameName, playerName });
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
    <div className="player-selection__name">
      <label htmlFor="player-name">Player Name: </label>
      <input
        id="game-name"
        type="text"
        value={playerName}
        onChange={e => setPlayerName(e.target.value)}
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
      <button
        onClick={startGame}
        disabled={(isMultiplayer && !gameName) || !playerName}
        >Start</button>
    </div>
  </div>;
}
