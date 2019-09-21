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
    console.log("has update");
    for (let ci = 0; ci < cells.length; ci++) {
      if (cells[ci] !== cellState[ci]) {
        const nextCellColor = cells[ci];
        console.log({ nextCellColor });
        const nextTransitionState = [];
        let ctStart = 0;
        let ctEnd = 300;
        for (let pci = 0; pci < ci; pci++) {
          const tci = pci;
          console.log({ tci });
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

export class Connect4Board extends Component {
  constructor (props) {
    super(props);
    this.state = {
      cells: initializeBoard(...BOARD_SIZE)
    };
    this.state.cells[4][5] = "yellow";
  }
  onClickColumn (col) {
    let cells = this.state.cells;
    if (!checkValidMove(cells, col)) {
      return;
    }
    cells = cells.map(column => column);
    const column = cells[col].map(v => v);
    for (let ci = 0; ci < column.length; ci++) {
      if ((ci === column.length - 1) || (column[ci + 1])) {
        column[ci] = "red";
        cells[col] = column;
        break;
      }
    }
    this.setState({ cells });
  }
  render () {
    return <div className="connect-4__board">
      {this.state.cells.map((col, i) =>
        <Connect4Column
          key={i}
          cells={col}
          canPlay={checkValidMove(this.state.cells, i)}
          onClick={() => this.onClickColumn(i)}
        />
      )}
    </div>;
  }
}
