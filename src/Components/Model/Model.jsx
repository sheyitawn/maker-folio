import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bounds, OrbitControls, useGLTF } from '@react-three/drei';
import './model.css';

const InteractiveModel = ({ url }) => {
  const group = useRef();
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);


  const ROTATION_SPEED = 0.2;

  // Rotate the model every frame
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * ROTATION_SPEED;
    }
  });

  return (
    <group
      ref={group}
      scale={clicked ? 1.2 : 1}
      onClick={(e) => setClicked(!clicked)}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene} />
    </group>
  );
};

const Model = ({ modelUrl }) => {
  return (
    <div className="model">
      <div className="model_model">
        <Canvas >
          <ambientLight intensity={Math.PI / 2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI/3} />
          <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <Bounds fit observe margin={1.2}>
              <InteractiveModel url={modelUrl} />
            </Bounds>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default Model;
