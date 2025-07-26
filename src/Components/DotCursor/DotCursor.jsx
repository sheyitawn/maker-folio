import React, { useEffect, useState, useRef } from 'react';
import './dotcursor.css';

const DotCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 5, height: 5 });
  const [hoverMode, setHoverMode] = useState(null); // 'fill' | 'grow' | null
  const clickedRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (clickedRef.current) {
        // After click, wait until mouse leaves any hover-target to reset
        const target = document.elementFromPoint(event.clientX, event.clientY);
        if (!target?.closest('.hover-target--fill') && !target?.closest('.hover-target--grow')) {
          clickedRef.current = false; // reset clicked state
        } else {
          // Still hovering the clicked target — keep cursor normal size
          setHoverMode(null);
          setSize({ width: 5, height: 5 });
          setPosition({ x: event.clientX, y: event.clientY });
          return;
        }
      }

      // Normal hover detection logic
      const target = document.elementFromPoint(event.clientX, event.clientY);

      const fillTarget = target?.closest('.hover-target--fill');
      const growTarget = target?.closest('.hover-target--grow');

      if (fillTarget) {
        const rect = fillTarget.getBoundingClientRect();
        setHoverMode('fill');
        setSize({ width: rect.width, height: rect.height });
        setPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      } else if (growTarget) {
        setHoverMode('grow');
        setSize({ width: 100, height: 100 });
        setPosition({ x: event.clientX, y: event.clientY });
      } else {
        setHoverMode(null);
        setSize({ width: 5, height: 5 });
        setPosition({ x: event.clientX, y: event.clientY });
      }
    };

    const handleClick = (event) => {
      const target = event.target.closest('.hover-target--fill, .hover-target--grow');
      if (target) {
        clickedRef.current = true;
        // On click, reset cursor immediately to normal
        setHoverMode(null);
        setSize({ width: 5, height: 5 });
        setPosition({ x: event.clientX, y: event.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      className={`dot-cursor ${hoverMode === 'fill' ? 'dot-cursor--fill' : ''} ${hoverMode === 'grow' ? 'dot-cursor--grow' : ''}`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    />
  );
};

export default DotCursor;
