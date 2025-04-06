import React, { useEffect, useRef, useState } from 'react';
import './livelogfeed.css';

const TypewriterLine = ({ text }) => {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed((prev) => prev + text[indexRef.current]);
        indexRef.current += 1;
      } else {
        clearInterval(intervalRef.current);
      }
    }, 10);

    return () => clearInterval(intervalRef.current);
  }, [text]);

  return <div className="log-line">{displayed}</div>;
};

const LiveLogFeed = ({ logs }) => {
  const endRef = useRef();

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="log-feed">
      {logs.map((log, index) => (
        // <TypewriterLine key={index} text={`[${log.time}] ${log.message}`} />
        <TypewriterLine key={index} text={`[${log.time}] ${log.message}`} />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default LiveLogFeed;
