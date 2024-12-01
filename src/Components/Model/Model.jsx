import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const Model = ({ modelUrl, description }) => {
  const ModelLoader = ({ url }) => {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas>
        {/* Add lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} />
        {/* Render 3D model */}
        <ModelLoader url={modelUrl} />
        {/* Add controls */}
        <OrbitControls />
      </Canvas>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Model;
