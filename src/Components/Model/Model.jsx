import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './model.css';

const Model = ({ modelUrl }) => {
  const ModelLoader = ({ url }) => {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
  };

  return (
    <div className="model">
      <div className="model_canvas">
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight intensity={1} position={[5, 5, 5]} />
          <pointLight intensity={0.5} position={[-5, -5, -5]} />
          <ModelLoader url={modelUrl} />
          <OrbitControls enableZoom={true} enablePan={false} dampingFactor={0.1} rotateSpeed={0.5} />
        </Canvas>
      </div>
    </div>
  );
};

export default Model;
