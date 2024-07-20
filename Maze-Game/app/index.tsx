import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";

import {
  useFonts,
  ComicNeue_400Regular,
  ComicNeue_700Bold,
} from "@expo-google-fonts/comic-neue";

//import { Gyroscope } from "expo-sensors";

const { width, height } = Dimensions.get("window");

const cols = 15; // Number of columns
const rows = 15; // Number of rows

type Maze = number[][];
type Position = { x: number; y: number };
type Goal = Position;

const mazes: Maze[] = [
  // Maze Level 1
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Maze Level 2
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Maze Level 3
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Maze Level 4
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Maze Level 5
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Maze Level 6
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Maze Level 7
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],

  // Maze Level 8
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Maze Level 9
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],

  // Maze Level 10
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
];

function isConnected(maze: number[][]): boolean {
  const rows = maze.length;
  const cols = maze[0].length;
  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );

  // Direction vectors for moving in the 4 cardinal directions (up, down, left, right)
  const directions = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
  ];

  function dfs(r: number, c: number) {
    // If out of bounds or cell is not a zero or already visited, return
    if (
      r < 0 ||
      r >= rows ||
      c < 0 ||
      c >= cols ||
      maze[r][c] === 1 ||
      visited[r][c]
    )
      return;

    // Mark the cell as visited
    visited[r][c] = true;

    // Move in all 4 directions
    for (const [dr, dc] of directions) {
      dfs(r + dr, c + dc);
    }
  }

  // Find the first zero cell and start the DFS from there
  let foundZero = false;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === 0) {
        dfs(r, c);
        foundZero = true;
        break;
      }
    }
    if (foundZero) break;
  }

  // Check if all zeros are visited
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === 0 && !visited[r][c]) return false;
    }
  }

  return true;
}

mazes.forEach((maze, index) => {
  console.log(`Maze Level ${index + 1} connectivity: ${isConnected(maze)}`);
});

const initialPlayerPosition: Position = { x: 1, y: 1 };
const goal: Goal = { x: 13, y: 13 };

const MazeGame = () => {
  // const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  // const [gyroEnabled, setGyroEnabled] = useState(false);

  let [fontsLoaded] = useFonts({
    ComicNeue_400Regular,
    ComicNeue_700Bold,
  });

  const [playerPosition, setPlayerPosition] = useState<Position>(
    initialPlayerPosition
  );
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const [moves, setMoves] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const [showTitleScreen, setShowTitleScreen] = useState(true);

  const maze = mazes[currentLevel];

  /*
  useEffect(() => {
    let subscriptions;

    if (gyroEnabled) {
      subscriptions = Gyroscope.addListener((gyroscopeData) => {
        setGyroData(gyroscopeData);
      });
    }
  }, []); */

  useEffect(() => {
    // Start timer
    const id = setInterval(() => {
      if (!gameOver) {
        //if (showTitleScreen == false) {
        setTimeElapsed((prevTime) => prevTime + 1);
        console.log(gameOver);
        console.log(showTitleScreen);
        //}
      }
    }, 1000);

    setIntervalId(id);

    return () => {
      if (id) clearInterval(id);
    };
  }, []);

  const movePlayer = (direction: string) => {
    if (gameOver) return;

    let newPos = { ...playerPosition };
    switch (direction) {
      case "up":
        newPos.y = Math.max(0, newPos.y - 1);
        break;
      case "down":
        newPos.y = Math.min(rows - 1, newPos.y + 1);
        break;
      case "left":
        newPos.x = Math.max(0, newPos.x - 1);
        break;
      case "right":
        newPos.x = Math.min(cols - 1, newPos.x + 1);
        break;
      default:
        return;
    }

    if (maze[newPos.y][newPos.x] === 0) {
      setPlayerPosition(newPos);
      setMoves((prevMoves) => prevMoves + 1);
      if (newPos.x === goal.x && newPos.y === goal.y) {
        if (currentLevel < mazes.length - 1) {
          setCurrentLevel(currentLevel + 1);
          setPlayerPosition(initialPlayerPosition);
          //setTimeElapsed(0);
        } else {
          setGameOver(true);
          Alert.alert(
            "Game Over",
            "Congratulations! You have completed all levels."
          );
        }
      }
    }
  };

  const renderMaze = () => {
    return (
      <View style={styles.maze}>
        {maze.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <View
              key={`${rowIndex}-${colIndex}`}
              style={[
                styles.cell,
                cell === 1
                  ? styles.wall
                  : playerPosition.x === colIndex &&
                    playerPosition.y === rowIndex
                  ? styles.player
                  : goal.x === colIndex && goal.y === rowIndex
                  ? styles.goal
                  : styles.path,
              ]}
            />
          ))
        )}
      </View>
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer("up");
          break;
        case "ArrowDown":
          movePlayer("down");
          break;
        case "ArrowLeft":
          movePlayer("left");
          break;
        case "ArrowRight":
          movePlayer("right");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerPosition, currentLevel, gameOver]);

  if (showTitleScreen) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Maze Game</Text>
        <Text style={styles.subtitle}>
          Navigate through the maze to reach the goal!
        </Text>
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor="blue"
          style={styles.startTouch}
          onPress={() => {
            alert("Pressed!");
            setShowTitleScreen(false);
          }}
        >
          <Text
            style={styles.startButton}
            onPress={() => setShowTitleScreen(false)}
          >
            Start Game
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        {!gameOver && (
          <View style={styles.topText}>
            <Text style={styles.moves}>Time: {timeElapsed}s</Text>
            <Text style={styles.moves}>Moves: {moves}</Text>{" "}
          </View>
        )}
        {gameOver && (
          <Text style={styles.score}>
            Efficiency: {Math.floor(timeElapsed + moves)}
            <br></br>(lower is better)
          </Text>
        )}
      </View>
      {renderMaze()}
      <Text style={styles.level}>Level: {currentLevel + 1}</Text>
      {gameOver && (
        <View>
          <Text style={styles.instructionsText}>You solved all the mazes!</Text>
        </View>
      )}
      {!gameOver && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Use arrow keys or tilt your device to move the player to the goal!
          </Text>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.gamepad}>
        <TouchableOpacity
          style={[styles.button, styles.upButton]}
          onPress={() => {
            movePlayer("up");
          }}
        >
          <Text style={styles.buttonText}>Up</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.leftButton]}
            onPress={() => {
              movePlayer("left");
            }}
          >
            <Text style={styles.buttonText}>Left</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rightButton]}
            onPress={() => {
              movePlayer("right");
            }}
          >
            <Text style={styles.buttonText}>Right</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.downButton]}
          onPress={() => {
            movePlayer("down");
          }}
        >
          <Text style={styles.buttonText}>Down</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Define a smaller scale factor (adjust as needed)
const scaleFactor = Math.min(width, height) / 450; // Adjusted scale factor

// Calculate sizes based on scale factor
const cellSize = 15 * scaleFactor; // Adjust the multiplier for smaller cells
const buttonSize = 30 * scaleFactor; // Adjusted size for gamepad buttons
const margin = 8 * scaleFactor; // Adjusted margin
const fontSizeBase = 14 * scaleFactor; // Adjusted base font size
const gamepadSize = buttonSize * 2; // Gamepad size

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCC1AB",
  },
  maze: {
    width: cols * cellSize,
    height: rows * cellSize,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: cellSize,
    height: cellSize,
    borderWidth: 1,
    borderColor: "#C0A3E0",
  },
  wall: {
    backgroundColor: "#CB764C",
  },
  path: {
    backgroundColor: "#FBC2A3",
  },
  player: {
    backgroundColor: "#95D2E2",
  },
  goal: {
    backgroundColor: "#406789",
  },
  instructionsContainer: {
    marginTop: margin,
  },
  instructionsText: {
    fontSize: 16 * scaleFactor, // Adjusted font size
    color: "#808080",
    fontFamily: "ComicNeue_700Bold",
  },
  level: {
    marginTop: margin,
    fontSize: 16 * scaleFactor, // Adjusted font size
    fontFamily: "ComicNeue_700Bold",
  },
  gameOver: {
    position: "absolute",
    alignContent: "center",
    fontSize: 18 * scaleFactor, // Adjusted font size
    fontFamily: "ComicNeue_700Bold",
    color: "black",
  },
  score: {
    marginBottom: margin,
    fontFamily: "ComicNeue_700Bold",
    fontSize: 16 * scaleFactor, // Adjusted font size
  },
  timerContainer: {
    marginBottom: margin,
    color: "#6EC7BF",
  },
  title: {
    fontSize: 30 * scaleFactor, // Adjusted font size
    fontWeight: "bold",
    marginBottom: 15 * scaleFactor,
    color: "#406789",
    fontFamily: "ComicNeue_700Bold",
  },
  subtitle: {
    fontSize: 18 * scaleFactor, // Adjusted font size
    marginBottom: 25 * scaleFactor,
    color: "#D48260",
    fontFamily: "ComicNeue_700Bold",
  },
  startButton: {
    fontSize: 24 * scaleFactor, // Adjusted font size
    color: "#326B66",
    borderRadius: 8 * scaleFactor,
    padding: 8 * scaleFactor,
    backgroundColor: "#6EC7BF",
    fontFamily: "ComicNeue_700Bold",
  },
  startTouch: {
    borderRadius: 8 * scaleFactor,
  },
  topText: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moves: {
    fontFamily: "ComicNeue_700Bold",
    fontSize: 16 * scaleFactor, // Adjusted font size
    marginRight: margin,
  },
  gamepad: {
    position: "absolute",
    bottom: 25 * scaleFactor, // Position from the bottom
    right: width / 2, // Position from the right
    width: gamepadSize,
    height: gamepadSize,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007BFF",
    borderRadius: buttonSize / 2,
    margin: margin / 2, // Reduced margin
  },
  buttonText: {
    color: "white",
    fontFamily: "ComicNeue_700Bold",
    fontSize: 12 * scaleFactor, // Adjusted font size
  },
  upButton: {
    position: "absolute",
    top: buttonSize / 3, // Adjusted position
    left: buttonSize / 2, // Center horizontally
  },
  downButton: {
    position: "absolute",
    top: buttonSize / 0.7, // Adjusted position
    left: buttonSize / 2, // Center horizontally
  },
  leftButton: {
    position: "absolute",
    top: buttonSize / 2, // Center vertically
    right: 15 * scaleFactor, // Align with left edge
  },
  rightButton: {
    position: "absolute",
    top: buttonSize / 2, // Center vertically
    left: 20 * scaleFactor, // Align with right edge
  },
});

export default MazeGame;
