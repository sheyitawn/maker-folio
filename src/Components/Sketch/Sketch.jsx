// Sketch.jsx
import React, { useState, Suspense } from 'react';
import "./sketch.css";
import Model from "../Model/Model";
import Logs from "../Logs/Logs";

// -------- Error Boundary --------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

const ComingSoon = ({ reason }) => (
  <div className="coming-soon">
    <div className="coming-soon__badge">Coming Soon</div>
    {reason && <div className="coming-soon__reason">{reason}</div>}
    <p>3D model under construction</p>
  </div>
);


const Sketch = ({
  projectId,
  title,
  description,
  sketch,
  sub_sketch,
  model,
  type,
  progress,
  onLog
}) => {
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
    }, 500);
  };

  const combinedTitle = `${type} • ${title}`;
  const hasModel = typeof model === 'string' && model.trim().length > 0;

  const isDoing = String(progress || '').toLowerCase() === 'doing';

  const bannerImage = '/assets/under-construction.png';

  return (
    <>
      {/* CARD */}
      <div className="sketch hover-target--grow distort-hover" onClick={openModal}>
        <svg>
          <rect x="0" y="0" fill="none" width="100%" height="100%" />
        </svg>

        {isDoing && (
          <img
            src={bannerImage}
            alt="Under construction"
            className="construction-banner-img"
            loading="lazy"
            decoding="async"
          />
        )}

        <img src={sketch} alt="Preview" className="image-icon" />
        <img src={sub_sketch} className="sketch-mini" alt="mini sketch" />
        <div className="sketch_title" data-title={combinedTitle}>
          {combinedTitle} 
        </div>
      </div>

      {/* MODAL */}
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

            <div className="modal-body">
              <section className="media-row">
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
          </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Sketch;
