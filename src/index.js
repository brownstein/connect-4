import React from "react";
import ReactDOM from "react-dom";
import {
  Connect4Column,
  Connect4Board
} from "./connect-4-board";
import "./app.less";

function init () {
  const container = document.getElementById("container");
  //<Connect4Column cells={[null, null, null, null, "yellow"]} />
  //<Connect4Column cells={[null, null, null, "yellow", "red", "yellow"]} />

  const app = <div>
    <Connect4Board/>
  </div>;
  ReactDOM.render(app, container);
}

window.onload = init;
