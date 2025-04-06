import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './model.css'

const Model = ({ modelUrl }) => {
  const ModelLoader = ({ url }) => {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
  };

  return (
    <div className='model'>
      <div className="model_model">
        <Canvas>
          {/* Add lighting */}
          <ambientLight intensity={0.1} />
          <directionalLight position={[10, 10, 10]} />
          {/* Render 3D model */}
          <ModelLoader url={modelUrl} />
          {/* Add controls */}
          <OrbitControls />
        </Canvas>
      </div>
      

    </div>
  );
};

export default Model;
