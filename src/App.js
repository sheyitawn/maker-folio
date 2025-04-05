import React from "react";
import DotCursor from "./Components/DotCursor/DotCursor";
import Sketch from "./Components/Sketch/Sketch";
import "./App.css";

import projects from "./Data/Projects.js";

const App = () => {
  return (
    <div className="content">
      <DotCursor />
      <div className="content_header">
        <div className="content_header-date">2020 - 2025</div>
        <div className="content_header-title">MAKER_PORTFOLIO</div>
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
          />
        ))}

      </div>
      </div>

      <div className="content_footnote">
        <div className="content_footnote_header">title</div>
        <div className="content_footnote_center">links</div>
        <div className="content_footnote_footer">footer</div>
    
      </div>

    </div>


    // <>
    // {models.map((model, index) => (
    //       <Model
    //         key={index}
    //         modelUrl={model.url}
    //         description={model.name}
    //       />
    //     ))}
    // </>
  );
};

export default App;
