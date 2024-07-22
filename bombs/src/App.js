import React from "react";
import Game from "./components/Game";
import { useState } from "react";
import "./App.css";

function App() {
  const [startGame, setStartGame] = useState(false);
  return (
    <div className="App">
      {startGame ? (
        <Game />
      ) : (
        <div>
          <h1 className="titleMain">Bombs</h1>
          <div className="instructions">
            <h3>Drag the bombs to avoid collisions. Good luck!</h3>
          </div>
          <button className="startButton" onClick={() => setStartGame(true)}>
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
