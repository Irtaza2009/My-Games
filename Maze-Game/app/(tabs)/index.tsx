// App.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { useDeviceOrientation } from "@react-native-community/hooks";
import { useKey } from "@react-native-community/hooks";

const { width, height } = Dimensions.get("window");
const cellSize = 30;
const cols = Math.floor(width / cellSize);
const rows = Math.floor(height / cellSize);

const createMaze = () => {
  const maze = new Array(rows).fill(null).map(() => new Array(cols).fill(0));
  // Simple maze generation: Add borders
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (i === 0 || j === 0 || i === rows - 1 || j === cols - 1) {
        maze[i][j] = 1;
      }
    }
  }
  return maze;
};

const Maze = () => {
  const [maze, setMaze] = useState(createMaze());
  const [position, setPosition] = useState({ x: width / 2, y: height / 2 });

  const handleKeyDown = (event) => {
    const { key } = event;
    setPosition((prevPosition) => {
      let newX = prevPosition.x;
      let newY = prevPosition.y;
      if (key === "ArrowUp") {
        newY = Math.max(0, prevPosition.y - cellSize);
      } else if (key === "ArrowDown") {
        newY = Math.min(height - cellSize, prevPosition.y + cellSize);
      } else if (key === "ArrowLeft") {
        newX = Math.max(0, prevPosition.x - cellSize);
      } else if (key === "ArrowRight") {
        newX = Math.min(width - cellSize, prevPosition.x + cellSize);
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
            style={[styles.cell, cell && styles.wall]}
          />
        ))
      )}
      <View style={[styles.ball, { left: position.x, top: position.y }]} />
    </View>
  );
};

const App = () => {
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
  },
  mazeContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: cellSize,
    height: cellSize,
    borderColor: "#000",
    borderWidth: 1,
  },
  wall: {
    backgroundColor: "#000",
  },
  ball: {
    position: "absolute",
    width: cellSize,
    height: cellSize,
    backgroundColor: "red",
    borderRadius: cellSize / 2,
  },
});

export default App;
