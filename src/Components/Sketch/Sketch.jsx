import React, { useState } from "react";
import "./sketch.css";
import Model from "../Model/Model";
import Logs from "../Logs/Logs";
// import { ReactComponent as MyGraphic } from "./one.svg";
// import testImage from "./test.png";

const Sketch = ({ projectId, title, description, sketch, sub_sketch, model, type, onLog}) => {

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
    onLog?.(`Opened project: ${title}`);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    onLog?.(`Closed project: ${title}`);
  };

  var combinedTitle = type + " • " + title

  return (

    <>
    
      <div className="sketch hover-target" onClick={openModal}>

        <svg>
          <rect x="0" y="0" fill="none" width="100%" height="100%" />
        </svg>
        {/* <div className="sketch-border">
          <div className="side-line left" />
          <div className="side-line right" />
        </div> */}
        <img src={sketch} alt="Preview" className="image-icon" />
        <img src={sub_sketch} className="sketch-mini" alt="mini sketch"/>
        <div className="sketch_title" data-title={combinedTitle}>
          {combinedTitle}
        </div>
      </div>



      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="scanlines" />
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
            <h1>{title}</h1>
              <div>
                {/* <Model
                  modelUrl={model}
                /> */}

                {model}
              </div>
            <p>{description}</p>
            <Logs projectId={projectId} />

            {/* {customContent && <div className="custom-content">{customContent}</div>} */}






            <>
            
            
            </>
          </div>
        </div>
      )}
    </>
    
  );
};

export default Sketch;
