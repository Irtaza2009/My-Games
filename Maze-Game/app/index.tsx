import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";

const { width, height } = Dimensions.get("window");
const cellSize = 40; // Size of each cell
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
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1],
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
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
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

const initialGoal: Goal = { x: cols - 2, y: rows - 2 };

const MazeGame = () => {
  const [playerPosition, setPlayerPosition] = useState<Position>({
    x: 1,
    y: 1,
  });
  const [mazeIndex, setMazeIndex] = useState(0);

  const maze = mazes[mazeIndex];
  const goal = initialGoal;

  const resetGame = () => {
    setPlayerPosition({ x: 1, y: 1 });
    setMazeIndex((mazeIndex + 1) % mazes.length);
  };

  const movePlayer = (dx: number, dy: number) => {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (maze[newY][newX] === 0) {
      setPlayerPosition({ x: newX, y: newY });

      if (newX === goal.x && newY === goal.y) {
        alert("Congratulations! You've completed the maze!");
        resetGame();
      }
    }
  };

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;

      if (beta > 15) movePlayer(0, 1);
      if (beta < -15) movePlayer(0, -1);
      if (gamma > 15) movePlayer(1, 0);
      if (gamma < -15) movePlayer(-1, 0);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          movePlayer(0, -1);
          break;
        case "ArrowDown":
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerPosition]);

  return (
    <View style={styles.container}>
      <View style={styles.mazeContainer}>
        {maze.map((row, y) =>
          row.map((cell, x) => (
            <View
              key={`${x}-${y}`}
              style={[
                styles.cell,
                cell === 1 ? styles.wall : styles.path,
                playerPosition.x === x &&
                  playerPosition.y === y &&
                  styles.player,
                goal.x === x && goal.y === y && styles.goal,
              ]}
            />
          ))
        )}
      </View>
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Use arrow keys or tilt your device to move the player to the goal!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  mazeContainer: {
    width: cols * cellSize,
    height: rows * cellSize,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: cellSize,
    height: cellSize,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  wall: {
    backgroundColor: "#D3D3D3",
  },
  path: {
    backgroundColor: "#FFFFFF",
  },
  player: {
    backgroundColor: "#FFB6C1",
  },
  goal: {
    backgroundColor: "#B0E0E6",
  },
  instructionsContainer: {
    marginTop: 20,
  },
  instructionsText: {
    fontSize: 16,
    color: "#808080",
  },
});

export default MazeGame;
