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

  // use a standard constructor for games
  class Game {
    constructor (props) {
      this.id = cuid();
      this.name = null;
      this.multiplayer = false;
      this.playerNames = {};
      this.started = false;
      this.over = false;
      this.winner = false;
      this.turn = RED;
      this.board = initializeBoard(...BOARD_SIZE);
      if (props) {
        Object.assign(this, props);
      }
    }
  }

  /**
   * Starts a new game
   * @param req.body.isMultiplayer - whether the game is multiplayer
   * @param req.body.name - the session name
   * @param req.body.playerName - the name of the player
   */
  app.post("/api/games", function (req, res, next) {
    const {
      isMultiplayer,
      name,
      playerName
    } = req.body;
    // multiplayer games
    if (isMultiplayer) {
      // join game
      if (openGamesByName[name]) {
        const game = openGamesByName[name];
        delete openGamesByName[name];
        game.started = true;
        game.playerNames[YELLOW] = playerName;
        res.status(200).send({ game, yourColor: YELLOW });
        return next();
      }
      // start new game
      const game = new Game({
        multiplayer: true,
        name,
        playerNames: { [RED]: playerName }
      });
      openGamesByName[game.name] = game;
      gamesByID[game.id] = game;
      res.status(200).send({ game, yourColor: RED });
      return next();
    }
    // single player games
    const game = new Game({
      name: name || "You vs. Computer",
      playerNames: { [RED]: playerName, [YELLOW]: "The Computer" },
      started: true
    });
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

    // if we have a winner, provide their name
    if (game.winner) {
      game.winnerName = game.playerNames[game.winner];
    }

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
            game.winner = checkForWin(game.board);
            game.over = !!game.winner || checkForGameOver(game.board);
            if (game.winner) {
              game.winnerName = game.playerNames[game.winner];
            }
            game.turn = game.over ? null : RED;
            break;
          }
        }
      }, 1000);
    }

    res.status(200).send(game);
    return next;
  });
};
