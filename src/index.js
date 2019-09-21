import React, { Component } from "react";
import ReactDOM from "react-dom";
import delay from "delay";
import superagent from "superagent";
import {
  Connect4Column,
  Connect4Board
} from "./connect-4-board";
import GameSelectionScreen from "./game-selection-screen";
import "./app.less";

function LoadIndicator () {
  return <div className="loading-indicator"><div>Loading...</div></div>
}

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      game: null,
      loading: false,
      color: null
    };
    this.startGame = this.startGame.bind(this);
    this.playMove = this.playMove.bind(this);
  }
  async startGame ({ isMultiplayer, name }) {
    this.setState({
      loading: true
    });
    const res = await superagent.post("/api/games").send({
      isMultiplayer,
      name
    });
    const { game, yourColor } = res.body;
    this.setState({
      loading: false,
      game,
      color: yourColor
    });
    if (isMultiplayer) {
      this.pollForNextGameUpdate();
    }
  }
  async pollForNextGameUpdate () {
    await delay(500);
    const { color, game } = this.state;
    const res = await superagent.get(`/api/games/${game.id}`);
    const updatedGame = res.body;
    this.setState({ game: updatedGame });
    if (updatedGame.over) {
      return;
    }
    if ((updatedGame.turn !== color) || !(updatedGame.started)) {
      this.pollForNextGameUpdate();
    }
  }
  async playMove (column) {
    const { game, color } = this.state;
    const res = await superagent.post(`/api/games/${game.id}/play`).send({
      column,
      color
    });
    const updatedGame = res.body;
    this.setState({ game: updatedGame });
    this.pollForNextGameUpdate();
  }
  render () {
    const { loading, game, color } = this.state;
    let content;
    if (game) {
      content = <Connect4Board
        board={game.board}
        canPlay={game.turn === color}
        waitingForPlayer={!game.started}
        onPlay={this.playMove}
        gameOver={game.over && !game.winner}
        winner={game.winner}
        />;
    }
    else {
      content = <GameSelectionScreen startGameWithParameters={this.startGame} />
    }
    return <div>
      <h1>Connect-4</h1>
      {loading ? <LoadIndicator/> : null}
      {content}
    </div>;
  }
}

function init () {
  const container = document.getElementById("container");
  const app = <App/>;
  ReactDOM.render(app, container);
}

window.onload = init;
