"use strict";
const { expect } = require("chai");
const {
  checkForWin,
  initializeBoard,
  RED,
  YELLOW
} = require("../shared-logic/board");

describe("win condition", function () {
  it("should be null for no win", function () {
    const board = initializeBoard(7, 6);
    board[3][3] = RED;
    board[3][4] = RED;
    board[3][5] = RED;
    const win = checkForWin(board);
    expect(win).to.equal(null);
  });
  it("should be a color for a vertical win", function () {
    const board = initializeBoard(7, 6);
    board[3][2] = RED;
    board[3][3] = RED;
    board[3][4] = RED;
    board[3][5] = RED;
    const win = checkForWin(board);
    expect(win).to.equal(RED);
  });
  it("should be a color for a horizontal win", function () {
    const board = initializeBoard(7, 6);
    board[2][5] = RED;
    board[3][5] = RED;
    board[4][5] = RED;
    board[5][5] = RED;
    const win = checkForWin(board);
    expect(win).to.equal(RED);
  });
  it("should be a color for a diagonal win", function () {
    const board = initializeBoard(7, 6);
    board[1][2] = RED;
    board[2][3] = RED;
    board[3][4] = RED;
    board[4][5] = RED;
    const win = checkForWin(board);
    expect(win).to.equal(RED);
  });
});
