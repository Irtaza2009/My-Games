import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const cellSize = 30;
const cols = Math.floor(width / cellSize);
const rows = Math.floor(height / cellSize);

type Maze = number[][];
type Position = { x: number; y: number };

const shuffle = (array: any[]): any[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const createMaze = (width: number, height: number): Maze => {
  const maze: Maze = Array.from({ length: height }, () => Array(width).fill(1));

  const carvePath = (x: number, y: number) => {
    const directions = shuffle([
      [0, 1], // Down
      [1, 0], // Right
      [0, -1], // Up
      [-1, 0], // Left
    ]);

    directions.forEach(([dx, dy]) => {
      const nx = x + dx * 2;
      const ny = y + dy * 2;
      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < width &&
        ny < height &&
        maze[ny][nx] === 1
      ) {
        maze[ny][nx] = 0;
        maze[y + dy][x + dx] = 0;
        carvePath(nx, ny);
      }
    });
  };

  maze[1][1] = 0; // Start position
  carvePath(1, 1);
  return maze;
};

const maze = createMaze(cols, rows);

const Maze: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 1, y: 1 });

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    setPosition((prevPosition) => {
      let newX = prevPosition.x;
      let newY = prevPosition.y;
      if (key === "ArrowUp" && maze[prevPosition.y - 1][prevPosition.x] === 0) {
        newY = prevPosition.y - 1;
      } else if (
        key === "ArrowDown" &&
        maze[prevPosition.y + 1][prevPosition.x] === 0
      ) {
        newY = prevPosition.y + 1;
      } else if (
        key === "ArrowLeft" &&
        maze[prevPosition.y][prevPosition.x - 1] === 0
      ) {
        newX = prevPosition.x - 1;
      } else if (
        key === "ArrowRight" &&
        maze[prevPosition.y][prevPosition.x + 1] === 0
      ) {
        newX = prevPosition.x + 1;
      }
      return { x: newX, y: newY };
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <View style={styles.mazeContainer}>
      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <View
            key={`${rowIndex}-${colIndex}`}
            style={[
              styles.cell,
              cell === 1 && styles.wall,
              rowIndex === position.y && colIndex === position.x && styles.ball,
            ]}
          />
        ))
      )}
    </View>
  );
};

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <Maze />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  mazeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: cols * cellSize,
    height: rows * cellSize,
  },
  cell: {
    width: cellSize,
    height: cellSize,
    borderWidth: 1,
    borderColor: "#000",
  },
  wall: {
    backgroundColor: "#000",
  },
  ball: {
    backgroundColor: "red",
    borderRadius: cellSize / 2,
  },
});

export default App;
