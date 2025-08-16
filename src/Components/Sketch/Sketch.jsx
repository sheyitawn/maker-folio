import React, { useState, Suspense } from 'react';
import "./sketch.css";
import Model from "../Model/Model";
import Logs from "../Logs/Logs";

// -------- Error Boundary: catches render-time errors from children --------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // Optional: report to analytics/logging here
    // console.error('Model failed:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

// -------- Simple "Coming Soon" fallback --------
const ComingSoon = ({ reason }) => (
  <div className="coming-soon">
    <div className="coming-soon__badge">Coming Soon</div>
    {reason && <div className="coming-soon__reason">{reason}</div>}
    <p>3D model under construction</p>
  </div>
);

const Sketch = ({ projectId, title, description, sketch, sub_sketch, model, type, onLog }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
    onLog?.(`Opened project: ${title}`);
    setIsClosing(false);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      onLog?.(`Closed project: ${title}`);
    }, 500); // Match animation duration
  };

  const combinedTitle = `${type} • ${title}`;

  // Helper to decide if we have a usable model URL
  const hasModel = typeof model === 'string' && model.trim().length > 0;

  return (
    <>
      <div className="sketch hover-target--grow distort-hover" onClick={openModal}>
        <svg>
          <rect x="0" y="0" fill="none" width="100%" height="100%" />
        </svg>

        <img src={sketch} alt="Preview" className="image-icon" />
        <img src={sub_sketch} className="sketch-mini" alt="mini sketch" />
        <div className="sketch_title" data-title={combinedTitle}>
          {combinedTitle}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="scanlines" />
          <div
            className={`modal-content ${isClosing ? 'slide-out' : 'slide-in'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close hover-target--grow" onClick={closeModal}>
              ✕
            </button>


            <section className="media-row">
              {/* Model on the left */}
              <div className="model-col">
                {!hasModel ? (
                  <ComingSoon reason="No model URL provided." />
                ) : (
                  <ErrorBoundary fallback={<ComingSoon reason="Model failed to load." />}>
                    <Suspense fallback={<div className="coming-soon">Loading 3D preview…</div>}>
                      <Model modelUrl={model} />
                    </Suspense>
                  </ErrorBoundary>
                )}
              </div>

              {/* Two images side by side */}
              <div className="images-col">
                <img src={sketch} alt={`${title} sketch`} />
                <img src={sub_sketch} alt={`${title} sub sketch`} />
              </div>
            </section>
            
            <div className='meta_data'>
              <p>{type}</p>
              <h1>{title}</h1>
              <p>{description}</p>
              <Logs projectId={projectId} />
            </div>
            


            {/* reserved for custom content */}
          </div>
        </div>
      )}
    </>
  );
};

export default Sketch;
