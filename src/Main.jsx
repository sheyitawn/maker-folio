import React, { useState, useEffect, useRef } from 'react';
import Sketch from "./Components/Sketch/Sketch";
import LiveLogFeed from './Components/LiveLogFeed/LiveLogFeed';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useLogEvents from './Hooks/useLogEvents.js';
import "./App.css";
import StaggeredGrid from './Components/StaggeredGrid/StaggeredGrid.jsx';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';


const Main = (entered, loading, setLoading) => {

  const key = loading ? 'loading' : 'main';
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
  // console.log("🚀 ~ Main ~ projects:", projects)


  return (
     <TransitionGroup component={null}>
      <CSSTransition key={key} classNames="fade" timeout={300}>
    <div className="content">
      <div className="content_header">
        <div className="content_header-date">2020 - 2025</div>
        <div className="content_header-title hover-target--fill distort-hover glitch_button" ref={logoRef}>MAKER_FOLIO</div>
      </div>

      <div className="content_box">
        <div className="content_graph-paper"></div>

        <StaggeredGrid className="content_sketch-container">
          {projects.map((sketch) => (
            <Sketch
              key={sketch.id}
              projectId={sketch.id}
              type={sketch.type}
              title={sketch.title}
              description={sketch.description}
              model={sketch.model}
              sketch={sketch.sketch}
              sub_sketch={sketch.sub_sketch}
              projectlog={sketch.logs}
              progress={sketch.metadata.progress} 
              onLog={addLog}
            />
          ))}
        </StaggeredGrid>
      </div>

      <div className="content_footnote">
        <div className="content_footnote_header">Seyitan Adeleke pronounced sheyitawn</div>
        <div className="content_footnote_center">// DEV NOTES</div>

        <div className="content_footnote_footer">
          <a href="mailto:sheyitawn@gmail.com" className="hover-target--fill distort-hover footer-link glitch_button" >
            send me a message
          </a>
          <div>|</div>
          <a href="https://github.com/sheyitawn" className="hover-target--fill distort-hover footer-link glitch_button" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <div>|</div>
          <a href="https://www.linkedin.com/in/seyitan-adeleke-84a7721b4" className="hover-target--fill distort-hover footer-link glitch_button" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn  />
          </a>
        </div>
      </div>


      <LiveLogFeed logs={logs} />
    </div>

          </CSSTransition>
    </TransitionGroup>
  );
};

export default Main;
