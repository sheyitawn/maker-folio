import React, { useState } from "react";
import "./sketch.css";
import Model from "../Model/Model";
// import { ReactComponent as MyGraphic } from "./one.svg";
// import testImage from "./test.png";

const Sketch = ({ title, description, sketch, model, customContent }) => {

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (

    <>
      <div className="sketch" onClick={openModal}>
        {/* <MyGraphic1 className="svg-icon" /> */}
        <img src={sketch} alt="Preview" className="image-icon" />
        
        <div className="sketch_title" data-title={title}>
          {title}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
            <h1>{title}</h1>
              <div>
                <Model
                  modelUrl={model}
                />
              </div>
            <p>{description}</p>
            {customContent && <div className="custom-content">{customContent}</div>}
          </div>
        </div>
      )}
    </>
    
  );
};

export default Sketch;
