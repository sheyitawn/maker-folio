import React, { useEffect, useState, useRef } from 'react';
import './dotcursor.css';

const DotCursor = () => {
  // ---- Always declare hooks at the top (no conditions) ----
  const [enabled, setEnabled] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 5, height: 5 });
  const [hoverMode, setHoverMode] = useState(null); // 'fill' | 'grow' | null
  const clickedRef = useRef(false);

  // Desktop / touch detection
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      setEnabled(false);
      return;
    }

    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const decide = () => setEnabled(mq.matches && window.innerWidth >= 768);

    decide();
    mq.addEventListener?.('change', decide);
    const onResize = () => decide();
    const onFirstTouch = () => setEnabled(false);

    window.addEventListener('resize', onResize);
    window.addEventListener('touchstart', onFirstTouch, { passive: true, once: true });

    return () => {
      mq.removeEventListener?.('change', decide);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('touchstart', onFirstTouch);
    };
  }, []);

  // Mouse listeners only when enabled
  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (event) => {
      if (clickedRef.current) {
        const target = document.elementFromPoint(event.clientX, event.clientY);
        if (!target?.closest('.hover-target--fill') && !target?.closest('.hover-target--grow')) {
          clickedRef.current = false;
        } else {
          setHoverMode(null);
          setSize({ width: 5, height: 5 });
          setPosition({ x: event.clientX, y: event.clientY });
          return;
        }
      }

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
  }, [enabled]);

  // Render last (no conditional hooks above)
  if (!enabled) return null;

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
