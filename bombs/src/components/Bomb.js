import React, { useState, useEffect, useRef } from "react";
import "./Bomb.css";

const Bomb = ({ bomb, onDrag, onLoad, gameDimensions, bombDiameter }) => {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const bombRef = useRef();

  useEffect(() => {
    if (bombRef.current) {
      const bombRect = bombRef.current.getBoundingClientRect();
      onLoad(bombRect);
    }
  }, [onLoad]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        const newX = e.clientX - offset.x;
        const newY = e.clientY - offset.y;
        // Enforce boundaries
        onDrag(
          bomb.id,
          Math.max(0, Math.min(newX, gameDimensions.width - bombDiameter)),
          Math.max(0, Math.min(newY, gameDimensions.height - bombDiameter))
        );
      }
    };

    const handleMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset, bomb.id, onDrag, gameDimensions, bombDiameter]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - bomb.x,
      y: e.clientY - bomb.y,
    });
  };

  return (
    <div
      className="bomb"
      ref={bombRef}
      style={{ left: bomb.x, top: bomb.y }}
      onMouseDown={handleMouseDown}
    ></div>
  );
};

export default Bomb;
