import React, { useState, useEffect, useRef } from "react";
import Bomb from "./Bomb";
import "./Game.css";

const Game = () => {
  const [bombs, setBombs] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameDimensions, setGameDimensions] = useState({ width: 0, height: 0 });
  const [bombDiameter, setBombDiameter] = useState(0);

  const bombCount = 5; // Adjust as needed
  const gameArea = useRef();

  useEffect(() => {
    // Measure the game area and bomb sizes
    const measureElements = () => {
      if (gameArea.current) {
        const gameAreaRect = gameArea.current.getBoundingClientRect();
        const bomb = document.querySelector(".bomb");
        console.log("Bomb:", bomb);
        const bombRect = bomb
          ? bomb.getBoundingClientRect()
          : { width: 0, height: 0 };
        setGameDimensions({
          width: gameAreaRect.width,
          height: gameAreaRect.height,
        });
        setBombDiameter(bombRect.width);
        console.log("Game Area:", gameAreaRect.width, gameAreaRect.height);
        console.log("Bomb Diameter:", bombRect.width);
      }
    };

    measureElements();
    window.addEventListener("resize", measureElements);
    return () => window.removeEventListener("resize", measureElements);
  }, []);

  useEffect(() => {
    // Initialize bombs
    const initialBombs = [];
    for (let i = 0; i < bombCount; i++) {
      initialBombs.push({
        id: i,
        x: Math.random() * (gameDimensions.width - bombDiameter),
        y: Math.random() * (gameDimensions.height - bombDiameter),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }
    setBombs(initialBombs);
  }, [gameDimensions, bombDiameter]);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(moveBombs, 20);
      return () => clearInterval(interval);
    }
  }, [bombs, gameOver, gameDimensions]);

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

  const isColliding = (bomb1, bomb2) => {
    const distance = Math.sqrt(
      (bomb1.x - bomb2.x) ** 2 + (bomb1.y - bomb2.y) ** 2
    );
    return distance < bombDiameter; // Using measured bomb diameter
  };

  const handleDrag = (id, x, y) => {
    setBombs((prevBombs) =>
      prevBombs.map((bomb) => (bomb.id === id ? { ...bomb, x, y } : bomb))
    );
  };

  return (
    <div className="game-area" ref={gameArea}>
      {bombs.map((bomb) => (
        <Bomb key={bomb.id} bomb={bomb} onDrag={handleDrag} />
      ))}
      {gameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default Game;
