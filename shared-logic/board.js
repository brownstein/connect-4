const BOARD_SIZE = [7, 6];
const RED = "red";
const YELLOW = "yellow";
const COLORS = [RED, YELLOW];

/**
 * Creates an empty 2D array array of [sizeX, sizeY]
 * @param sizeX - number of columns
 * @param sizeY - number of rows
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

/**
 * Checks to see if a given move is valid
 * @param columns - game board
 * @param position - column position of play
 */
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

/**
 * Checks for a win
 * @param columns - game board
 */
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

/**
 * Checks for a game over condition
 * @param columns - game board
 */
function checkForGameOver (columns) {
  let foundColors = 0;
  columns.forEach(c => foundColors += (c[0] !== null) ? 1 : 0);
  return foundColors === columns.length;
}

/**
 * Conducts a move
 * @param columns - game board
 * @param column - the column to play
 * @param color - the color to play
 */
function playMove (columns, column, color) {
  const gameColumn = columns[column];
  for (let ci = 0; ci < gameColumn.length; ci++) {
    if ((ci === gameColumn.length - 1) || gameColumn[ci + 1]) {
      gameColumn[ci] = color;
      break;
    }
  }
}

/**
 * Gets the opposite color
 */
function getOtherColor (color) {
  return COLORS.find(c => c !== color);
}

module.exports = {
  BOARD_SIZE,
  RED,
  YELLOW,
  initializeBoard,
  checkForWin,
  checkForGameOver,
  checkValidMove,
  playMove,
  getOtherColor
};
