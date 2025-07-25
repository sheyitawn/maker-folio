import React, { useState, useEffect, useRef } from 'react';
import Sketch from "./Components/Sketch/Sketch";
import LiveLogFeed from './Components/LiveLogFeed/LiveLogFeed';
import useLogEvents from './Hooks/useLogEvents.js';
import "./App.css";
// import projects from "./Data/Projects.js";

const Main = () => {
  const [logs, setLogs] = useState([
    { time: 'SYSTEM', message: 'Portfolio boot sequence initialized...' },
  ]);
  const [projects, setProjects] = useState([]);

  const addLog = (message) => {
    const now = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { time: now, message }]);
  };

  const logoRef = useRef(null);
  useLogEvents(addLog, logoRef);

    useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch('/data/projects.json');
      const data = await res.json();

      const entries = Object.entries(data).map(([folder, details]) => {
        const basePath = `/content/${folder}`;
        return {
          id: folder,
          title: details.title || folder,
          type: details.type || '',
          description: details.description || '',
          model: `${basePath}/model.glb`,
          sketch: `${basePath}/cover.png`,
          sub_sketch: `${basePath}/sub.png`,
          logs: details.logs || [],
          metadata: details
        };
      });

      setProjects(entries);
    };

    fetchProjects();
  }, []);


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
          <><Sketch
            key={sketch.id}
            projectId={sketch.id}
            type={sketch.type}
            title={sketch.title}
            description={sketch.description}
            model={sketch.model}
            sketch={sketch.sketch}
            sub_sketch={sketch.sub_sketch}
            projectlog={sketch.logs}
            onLog={addLog}
          />
          </>
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