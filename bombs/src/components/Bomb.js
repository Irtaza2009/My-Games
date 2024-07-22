import React, { useState, useEffect, useRef } from "react";
import "./Bomb.css";

const Bomb = ({
  bomb,
  onDrag,
  onLoad,
  gameDimensions,
  bombDiameter,
  setDragging,
}) => {
  const [isDragging, setIsDragging] = useState(false);
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
      if (isDragging) {
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

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    offset,
    bomb.id,
    onDrag,
    gameDimensions,
    bombDiameter,
    setDragging,
  ]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragging(true);
    setOffset({
      x: e.clientX - bomb.x,
      y: e.clientY - bomb.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragging(false);
  };

  return (
    <div
      className="bomb"
      ref={bombRef}
      style={{ left: bomb.x, top: bomb.y }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    ></div>
  );
};

export default Bomb;
