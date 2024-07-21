import React, { useState, useEffect, useRef } from 'react';
import Bomb from './Bomb';
import './Game.css';

const Game = () => {
  const [bombs, setBombs] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const bombCount = 5; // Adjust as needed
  const gameArea = useRef(null);

  useEffect(() => {
    // Initialize bombs
    const initialBombs = [];
    for (let i = 0; i < bombCount; i++) {
      initialBombs.push({
        id: i,
        x: Math.random() * 500,
        y: Math.random() * 500,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }
    setBombs(initialBombs);
  }, []);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(moveBombs, 20);
      return () => clearInterval(interval);
    }
  }, [bombs, gameOver]);

  const moveBombs = () => {
    setBombs(prevBombs => {
      const newBombs = prevBombs.map(bomb => {
        let newX = bomb.x + bomb.vx;
        let newY = bomb.y + bomb.vy;

        // Boundary checks
        if (newX <= 0 || newX >= 500) bomb.vx = -bomb.vx;
        if (newY <= 0 || newY >= 500) bomb.vy = -bomb.vy;

        return {
          ...bomb,
          x: newX,
          y: newY
        };
      });

      // Check for collisions
      for (let i = 0; i < newBombs.length; i++) {
        for (let j = i + 
