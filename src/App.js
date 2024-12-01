import React from "react";
import DotCursor from "./Components/DotCursor/DotCursor";
import "./App.css";

import Sketch from "./Components/Sketch/Sketch";
import Project1 from "./Portfolio/Project1";

const App = () => {
  // const models = [
  //   { url: "/holo corn.glb", name: "deez" },
  //   // { url: "/holo corn.glb", name: "deez" },
  //   // { url: "/holo corn.glb", name: "deez" },

  // ];

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

        <Sketch
          title="Gadget • Gesture Controlled Finger-tip"
          description="This is a detailed description of Sketch 1."
          model={"/test01.glb"}
          customContent={<Project1 />}
        />
        <Sketch
          title="Gadget • REVU, in-person reviews"
          description="This is a detailed description of Sketch 2."
          model={"/holo corn.glb"}
          customContent={<img src="example.jpg" alt="Example" />}
        />
        <Sketch
          title="Prop • Adventure Time Voice Box"
          description="This is a detailed description of Sketch 2."
          model={"/holo corn.glb"}
          customContent={<img src="example.jpg" alt="Example" />}
        />


      </div>
        {/* {models.map((model, index) => (
          <Model
            key={index}
            modelUrl={model.url}
            description={model.name}
          />
        ))} */}

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
