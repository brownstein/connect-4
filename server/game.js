const cuid = require("cuid");
const {
  BOARD_SIZE,
  RED,
  YELLOW,
  initializeBoard,
  checkValidMove,
  checkForWin,
  checkForGameOver,
  playMove,
  getOtherColor
} = require("../shared-logic/board");

module.exports = app => {

  // store the open lobbies and games in hash maps
  // there's a memory leak here, but that's OK given the scale of this
  // excercise
  const openGamesByName = {};
  const gamesByID = {};

  /**
   * Starts a new game
   */
  app.post("/api/games", function (req, res, next) {
    const {
      isMultiplayer,
      name
    } = req.body;
    // multiplayer games
    if (isMultiplayer) {
      // join game
      if (openGamesByName[name]) {
        const game = openGamesByName[name];
        delete openGamesByName[name];
        game.started = true;
        res.status(200).send({ game, yourColor: YELLOW });
        return next();
      }
      // start new game
      const game = {
        id: cuid(),
        name,
        multiplayer: true,
        started: false,
        over: false,
        winner: null,
        turn: RED,
        board: initializeBoard(...BOARD_SIZE)
      };
      openGamesByName[game.name] = game;
      gamesByID[game.id] = game;
      res.status(200).send({ game, yourColor: RED });
      return next();
    }
    // single player games
    const game = {
      id: cuid(),
      name: name || "You vs. Computer",
      started: true,
      over: false,
      winner: null,
      turn: RED,
      board: initializeBoard(...BOARD_SIZE)
    };
    gamesByID[game.id] = game;
    res.status(200).send({ game, yourColor: RED });
    return next();
  });

  /**
   * Return the game on request.
   * @param gameId - the game id
   */
  app.get("/api/games/:gameId", function (req, res, next) {
    const game = gamesByID[req.params.gameId];
    if (game) {
      res.status(200).send(game);
    }
    else {
      res.status(404);
    }
    return next();
  });

  /**
   * Play on request. Play is conducted server-side.
   * @param req.params.gameId - the game id
   * @param req.body.column - the column to play
   * @param req.body.color - the color to play
   */
  app.post("/api/games/:gameId/play", function (req, res, next) {
    const game = gamesByID[req.params.gameId];
    const { column, color } = req.body;

    // check for errors
    if (game === undefined) {
      res.status(404);
      return next();
    }
    if (game.over) {
      res.status(400).send({ error: "game over" });
      return next();
    }
    if (game.turn !== color) {
      res.status(400).send({ error: "wrong color" });
      return next();
    }
    if (!checkValidMove(game.board, column)) {
      res.status(400).send({ error: "invalid move" });
      return next();
    }

    // make the move
    playMove(game.board, column, color);

    // update winner and over flags
    game.winner = checkForWin(game.board);
    game.over = !!game.winner || checkForGameOver(game.board);

    // update current turn
    game.turn = game.over ? null : getOtherColor(color);

    // play randomly for computer
    if (!game.over && !game.multiplayer) {
      setTimeout(() => {
        let foundOpenSpot = false;
        while (true) {
          const spot = Math.floor(Math.random() * game.board.length);
          if (!game.board[spot][0]) {
            playMove(game.board, spot, YELLOW);
            game.turn = RED;
            break;
          }
        }
      }, 1000);
    }

    res.status(200).send(game);
    return next;
  });
};
