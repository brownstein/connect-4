import React, { Component, useState } from "react";
import classnames from "classnames";
import {
  checkForWin,
  checkValidMove,
  initializeBoard
} from "../shared-logic/board";

const BOARD_SIZE = [7, 6];

/**
 * Cell class for connect-4.
 */
export function Connect4Cell ({
  transitioningIn = false,
  transitioningThrough = false,
  color = null
}) {
  const classname = classnames({
    "connect-4__cell": true,
    "transitioning-through": transitioningThrough,
    "transitioning-in": transitioningIn,
    [`${color}`]: !!color
  });
  return <div className={classname}><div className="dot"></div></div>;
}

/**
 * Column class for connect-4. Contains some jank animation code.
 */
export function Connect4Column ({
  cells = [],
  canPlay = false,
  onClick
}) {
  const [cellState, setCellState] = useState(cells.map(c => null));
  const [transitionState, setTransitionState] = useState(cells.map(c => null));
  if (cellState !== cells) {
    for (let ci = 0; ci < cells.length; ci++) {
      if (cells[ci] !== cellState[ci]) {
        const nextCellColor = cells[ci];
        const nextTransitionState = [];
        let ctStart = 0;
        let ctEnd = 300;
        for (let pci = 0; pci < ci; pci++) {
          const tci = pci;
          setTimeout(
            () => setTransitionState(s => {
              s[tci] = { through: true, color: nextCellColor };
              return s.map(c => c);
            }),
            ctStart
          );
          setTimeout(
            () => setTransitionState(s => {
              s[tci] = null;
              return s.map(c => c);
            }),
            ctEnd
          );
          ctStart += 180;
          ctEnd = ctStart + 300;
          nextTransitionState.push(null);
        }
        setTimeout(
          () => setTransitionState(s => {
            s[ci] = { in: true, color: nextCellColor };
            return s.map(c => c);
          }),
          ctStart
        );
        setTimeout(
          () => setTransitionState(s => {
            s[ci] = null;
            return s.map(c => c);
          }),
          ctEnd
        );
        nextTransitionState.push({ color: null });
        setTransitionState(nextTransitionState);
        break;
      }
    }
    setCellState(cells);
  }

  const classname = classnames({
    "connect-4__column": true,
    "can-play": canPlay
  });

  return <div className={classname} onClick={onClick}>
    {cells.map((cellColor, ci) => {
      const cellTransition = transitionState[ci];
      return <Connect4Cell
        key={ci}
        color={cellTransition ? cellTransition.color : cellColor}
        transitioningIn={!!(cellTransition || {}).in}
        transitioningThrough={!!(cellTransition || {}).through}
        />;
    })}
  </div>
}

export function Connect4Board ({
  board,
  canPlay,
  onPlay,
  winner,
  gameOver,
  waitingForPlayer
}) {
  return <div className="connect-4__container">
    <div className="connect-4__board">
      {board.map((col, i) =>
        <Connect4Column
          key={i}
          cells={col}
          canPlay={canPlay && checkValidMove(board, i)}
          onClick={() => onPlay(i)}
        />
      )}
    </div>
    { waitingForPlayer ?
      <div className="waiting-for-player"><div>Waiting for other player...</div></div> :
      null
    }
    { gameOver ?
      <div className="game-over"><h2>Game Over</h2></div> :
      null
    }
    { winner ?
      <div className="game-over"><h2>{winner} wins!</h2></div> :
      null
    }
  </div>;
}
