// LiveLogFeed.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import './livelogfeed.css';

// --- utils ---
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

const TypewriterLine = ({ text, speed = 1 }) => {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  // Reset when text changes
  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Guard
    if (!text || speed <= 0) {
      setDisplayed(text ?? '');
      return;
    }

    intervalRef.current = setInterval(() => {
      const i = indexRef.current;
      if (i < text.length) {
        // append up to "speed" chars
        const next = text.slice(i, i + speed);
        setDisplayed((prev) => prev + next);
        indexRef.current = i + speed;
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 16); // ~60fps pacing

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, speed]);

  return <div className="log-line">{displayed}</div>;
};

const LiveLogFeed = ({ logs, typeSpeed = 1, className = '' }) => {
  const containerRef = useRef(null);
  const userPinnedBottom = useRef(true);

  // Determine stable keys
  const keyedLogs = useMemo(() => {
    return (logs ?? []).map((log) => {
      const label = `[${log.time}] ${log.message}`;
      const key = log.id ?? `${log.time ?? ''}-${hash(label)}`;
      return { key, label };
    });
  }, [logs]);

  // Track whether the user is at (or near) the bottom
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 24; // px tolerance
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    userPinnedBottom.current = atBottom;
  }, []);

  // Auto-scroll only if pinned to bottom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (userPinnedBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [keyedLogs]);

  return (
    <div
      ref={containerRef}
      className={`log-feed ${className}`}
      onScroll={handleScroll}
      role="log"
      aria-live="polite"
    >
      {keyedLogs.map(({ key, label }) => (
        <TypewriterLine key={key} text={label} speed={typeSpeed} />
      ))}
    </div>
  );
};

export default LiveLogFeed;
