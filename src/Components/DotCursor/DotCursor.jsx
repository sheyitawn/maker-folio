import React, { useEffect, useState } from 'react';
import './dotcursor.css'

const DotCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="dot-cursor"
      style={{
        top: `${position.y-23}px`,
        left: `${position.x -23}px`,
      }}
    />
  );
};

export default DotCursor;
