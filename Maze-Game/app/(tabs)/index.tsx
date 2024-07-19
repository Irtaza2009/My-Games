import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";

const { width, height } = Dimensions.get("window");
const cellSize = 20; // Size of each cell
const cols = 15; // Number of columns
const rows = 15; // Number of rows

type Maze = number[][];
type Position = { x: number; y: number };
type Goal = Position;

const mazes: Maze[] = [
  // Maze Level 1
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Maze Level 2
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Maze Level 3
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
];

// Function to select a random maze
const getRandomMaze = (): Maze => {
  const randomIndex = Math.floor(Math.random() * mazes.length);
  return mazes[randomIndex];
};

// Function to get a random goal point within the maze
const getRandomGoal = (maze: Maze): Goal => {
  let goal: Goal;
  do {
    goal = {
      x: Math.floor(Math.random() * maze[0].length),
      y: Math.floor(Math.random() * maze.length),
    };
  } while (maze[goal.y][goal.x] !== 0); // Ensure the goal is placed on an open path
  return goal;
};

const MazeComponent: React.FC = () => {
  const [level, setLevel] = useState(0); // Current level
  const [maze, setMaze] = useState<Maze>(mazes[level]);
  const [goal, setGoal] = useState<Goal>(getRandomGoal(mazes[level]));
  const [position, setPosition] = useState<Position>({ x: 1, y: 1 });

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    setPosition((prevPosition) => {
      let newX = prevPosition.x;
      let newY = prevPosition.y;

      if (
        key === "ArrowUp" &&
        maze[prevPosition.y - 1]?.[prevPosition.x] === 0
      ) {
        newY = prevPosition.y - 1;
      } else if (
        key === "ArrowDown" &&
        maze[prevPosition.y + 1]?.[prevPosition.x] === 0
      ) {
        newY = prevPosition.y + 1;
      } else if (
        key === "ArrowLeft" &&
        maze[prevPosition.y]?.[prevPosition.x - 1] === 0
      ) {
        newX = prevPosition.x - 1;
      } else if (
        key === "ArrowRight" &&
        maze[prevPosition.y]?.[prevPosition.x + 1] === 0
      ) {
        newX = prevPosition.x + 1;
      }

      if (newX === goal.x && newY === goal.y) {
        // Move to the next level
        setLevel((prevLevel) => {
          const nextLevel = prevLevel + 1;
          if (nextLevel < mazes.length) {
            setMaze(mazes[nextLevel]);
            setGoal(getRandomGoal(mazes[nextLevel]));
            return nextLevel;
          }
          return prevLevel; // No more levels
        });
        return { x: 1, y: 1 }; // Reset ball position
      }

      return { x: newX, y: newY };
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [maze, goal]);

  return (
    <View style={styles.mazeContainer}>
      <Text style={styles.levelText}>Level: {level + 1}</Text>
      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <View
            key={`${rowIndex}-${colIndex}`}
            style={[
              styles.cell,
              cell === 1 && styles.wall,
              rowIndex === position.y && colIndex === position.x && styles.ball,
              rowIndex === goal.y && colIndex === goal.x && styles.goal,
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
      <MazeComponent />
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
    position: "relative",
  },
  cell: {
    width: cellSize,
    height: cellSize,
    borderWidth: 1,
    borderColor: "#fff", // Optional: add border for better visibility
  },
  wall: {
    backgroundColor: "#000",
  },
  ball: {
    backgroundColor: "red",
    borderRadius: cellSize / 2,
  },
  goal: {
    backgroundColor: "green",
    borderRadius: cellSize / 2,
  },
  levelText: {
    position: "absolute",
    top: 10,
    left: 10,
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    zIndex: 1, // Ensure the text is above the maze
  },
});

export default App;
