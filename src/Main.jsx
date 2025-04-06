import React, { useState, useRef } from 'react';
import Sketch from "./Components/Sketch/Sketch";
import LiveLogFeed from './Components/LiveLogFeed/LiveLogFeed';
import useLogEvents from './Hooks/useLogEvents.js';
import "./App.css";
import projects from "./Data/Projects.js";

const Main = () => {
  const [logs, setLogs] = useState([
    { time: 'SYSTEM', message: 'Portfolio boot sequence initialized...' },
  ]);

  const addLog = (message) => {
    const now = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { time: now, message }]);
  };

  const logoRef = useRef(null);
  useLogEvents(addLog, logoRef);

  return (
    <div className="content">
      <div className="content_header">
        <div className="content_header-date">2020 - 2025</div>
        <div className="content_header-title" ref={logoRef}>MAKER_PORTFOLIO</div>
      </div>

      <div className="content_box">
      <div className="content_graph-paper"></div>

      <div className="content_sketch-container">

        {projects.map((sketch, index) => (
          <Sketch
            key={index}
            title={sketch.title}
            description={sketch.description}
            model={sketch.model}
            sketch={sketch.sketch}
            customContent={sketch.customContent}
            onLog={addLog} 
          />
        ))}
      </div>
      </div>

      <div className="content_footnote">
        <div className="content_footnote_header">Seyitan Adeleke pronounced sheyitawn</div>
        <div className="content_footnote_center">// DEV NOTES</div>
        <div className="content_footnote_footer">links</div>
    
      </div>
      <LiveLogFeed logs={logs} />
    </div>
  );
};

export default Main;