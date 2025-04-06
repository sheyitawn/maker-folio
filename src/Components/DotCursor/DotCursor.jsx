import React, { useEffect, useState } from 'react';
import './dotcursor.css';

const DotCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });

      // Check if we're hovering a .hover-target element
      const target = document.elementFromPoint(event.clientX, event.clientY);
      if (target?.closest('.hover-target')) {
        setIsHovering(true);
        console.log('hovering')
      } else {
        setIsHovering(false);
        console.log('not hovering')

      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className={`dot-cursor ${isHovering ? 'dot-cursor--active' : ''}`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    />
  );
};

export default DotCursor;
