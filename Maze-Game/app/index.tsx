import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text, Alert } from "react-native";

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
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
];

const initialPlayerPosition: Position = { x: 1, y: 1 };
const goal: Goal = { x: 13, y: 13 };

const MazeGame = () => {
  const [playerPosition, setPlayerPosition] = useState<Position>(
    initialPlayerPosition
  );
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const maze = mazes[currentLevel];

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
      if (newPos.x === goal.x && newPos.y === goal.y) {
        if (currentLevel < mazes.length - 1) {
          setCurrentLevel(currentLevel + 1);
          setPlayerPosition(initialPlayerPosition);
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

  return (
    <View style={styles.container}>
      {renderMaze()}
      <Text style={styles.level}>Level: {currentLevel + 1}</Text>
      {gameOver && <Text style={styles.gameOver}>Game Over!</Text>}
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
  level: {
    marginTop: 20,
    fontSize: 20,
  },
  gameOver: {
    marginTop: 20,
    fontSize: 24,
    color: "red",
  },
});

export default MazeGame;
