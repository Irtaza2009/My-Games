import React, { useState, useEffect } from "react";
import "./Bomb.css";

const Bomb = ({ bomb, onDrag }) => {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        onDrag(bomb.id, e.clientX - offset.x, e.clientY - offset.y);
      }
    };

    const handleMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset, bomb.id, onDrag]);

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
      style={{ left: bomb.x, top: bomb.y }}
      onMouseDown={handleMouseDown}
    ></div>
  );
};

export default Bomb;
