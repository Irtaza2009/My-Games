import React, { useState, useEffect, useRef, useCallback } from "react";
import Bomb from "./Bomb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import "./Game.css";

const Game = () => {
  const [bombs, setBombs] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameDimensions, setGameDimensions] = useState({ width: 0, height: 0 });
  const [bombDiameter, setBombDiameter] = useState(0);
  const [score, setScore] = useState(0);
  const [dragging, setDragging] = useState(false);

  const bombCount = 5; // Adjust as needed
  const gameArea = useRef();

  const measureElements = useCallback(() => {
    if (gameArea.current) {
      const gameAreaRect = gameArea.current.getBoundingClientRect();
      setGameDimensions({
        width: gameAreaRect.width,
        height: gameAreaRect.height,
      });
      console.log("Game Area:", gameAreaRect.width, gameAreaRect.height);
    }
  }, []);

  const handleBombLoad = (bombRect) => {
    setBombDiameter(bombRect.width);
    console.log("Bomb Diameter:", bombRect.width);
  };

  const isColliding = (bomb1, bomb2) => {
    const distance = Math.sqrt(
      (bomb1.x - bomb2.x) ** 2 + (bomb1.y - bomb2.y) ** 2
    );
    return distance < bombDiameter; // Using measured bomb diameter
  };

  const initializeBombs = useCallback(() => {
    const initialBombs = [];
    for (let i = 0; i < bombCount; i++) {
      let newBomb;
      let colliding;
      do {
        colliding = false;
        newBomb = {
          id: i,
          x: Math.random() * (gameDimensions.width - bombDiameter),
          y: Math.random() * (gameDimensions.height - bombDiameter),
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        };
        for (let j = 0; j < initialBombs.length; j++) {
          if (isColliding(newBomb, initialBombs[j])) {
            colliding = true;
            break;
          }
        }
      } while (colliding);
      initialBombs.push(newBomb);
    }
    setBombs(initialBombs);
  }, [gameDimensions, bombDiameter]);

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    initializeBombs();
  };

  useEffect(() => {
    measureElements();
    window.addEventListener("resize", measureElements);
    return () => window.removeEventListener("resize", measureElements);
  }, [measureElements]);

  useEffect(() => {
    initializeBombs();
  }, [initializeBombs]);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(moveBombs, 20);
      return () => clearInterval(interval);
    }
  }, [bombs, gameOver, gameDimensions]);

  useEffect(() => {
    if (!gameOver && !dragging) {
      const scoreInterval = setInterval(
        () => setScore((prevScore) => prevScore + 1),
        100
      );
      return () => clearInterval(scoreInterval);
    }
  }, [gameOver, dragging]);

  const moveBombs = () => {
    setBombs((prevBombs) => {
      const newBombs = prevBombs.map((bomb) => {
        let newX = bomb.x + bomb.vx;
        let newY = bomb.y + bomb.vy;

        // Boundary checks
        if (newX <= 0 || newX >= gameDimensions.width - bombDiameter)
          bomb.vx = -bomb.vx;
        if (newY <= 0 || newY >= gameDimensions.height - bombDiameter)
          bomb.vy = -bomb.vy;

        return {
          ...bomb,
          x: newX,
          y: newY,
        };
      });

      // Check for collisions
      for (let i = 0; i < newBombs.length; i++) {
        for (let j = i + 1; j < newBombs.length; j++) {
          if (isColliding(newBombs[i], newBombs[j])) {
            setGameOver(true);
          }
        }
      }

      return newBombs;
    });
  };

  const handleDrag = (id, x, y) => {
    setBombs((prevBombs) =>
      prevBombs.map((bomb) => {
        if (bomb.id === id) {
          const newX = Math.max(
            0,
            Math.min(x, gameDimensions.width - bombDiameter)
          );
          const newY = Math.max(
            0,
            Math.min(y, gameDimensions.height - bombDiameter)
          );
          return { ...bomb, x: newX, y: newY };
        }
        return bomb;
      })
    );
  };

  return (
    <div>
      <div className="score">Score: {score}</div>
      <div className="game-area" ref={gameArea}>
        {bombs.map((bomb) => (
          <Bomb
            key={bomb.id}
            bomb={bomb}
            onDrag={handleDrag}
            onLoad={handleBombLoad}
            gameDimensions={gameDimensions}
            bombDiameter={bombDiameter}
            setDragging={setDragging}
          />
        ))}
        {gameOver && (
          <div className="game-over">
            Game Over
            <div className="final-score">Final Score: {score}</div>
            <button className="restart-button" onClick={restartGame}>
              <FontAwesomeIcon icon={faRedo} /> Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
