const BOARD_SIZE = [7, 6];
const RED = "red";
const YELLOW = "yellow";
const COLORS = [RED, YELLOW];

/**
 * Creates an empty 2D array array of [sizeX, sizeY]
 */
function initializeBoard (sizeX, sizeY) {
  const columns = [];
  for (let i = 0; i < sizeX; i++) {
    const column = [];
    for (let j = 0; j < sizeY; j++) {
      column.push(null);
    }
    columns.push(column);
  }
  return columns;
}

function checkValidMove (columns, position) {
  const column = columns[position];
  if (!column) {
    return false;
  }
  if (!column[0]) {
    return true;
  }
  return false;
}

function checkForWin (columns) {
  const directions = [[0, 1], [1, 1], [1, 0], [1, -1]];
  for (let sx = 0; sx < columns.length; sx++) {
    for (let sy = 0; sy < columns[0].length; sy++) {
      const colorAtPos = columns[sx][sy];
      if (!colorAtPos) {
        continue;
      }
      for (let di = 0; di < directions.length; di++) {
        const dir = directions[di];
        const nextPos = { x: sx, y: sy };
        let connected = 1;
        for (let i = 0; i < 3; i++) {
          nextPos.x += dir[0];
          nextPos.y += dir[1];
          if (
            (nextPos.x >= columns.length) ||
            (nextPos.y < 0) ||
            (nextPos.y >= columns[0].length)
          ) {
            break;
          }
          const colorAtNextPos = columns[nextPos.x][nextPos.y];
          if (colorAtNextPos !== colorAtPos) {
            break;
          }
          connected++;
        }
        if (connected === 4) {
          return colorAtPos;
        }
      }
    }
  }
  return null;
}

class Connect4Game {
  constructor () {
    this.columns = initializeBoard(...BOARD_SIZE);
    this.currentTurn = RED;
    this.complete = false;
  }
}

module.exports = {
  RED,
  YELLOW,
  initializeBoard,
  checkForWin,
  checkValidMove
};
