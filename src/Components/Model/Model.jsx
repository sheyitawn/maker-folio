// src/components/Model.jsx
import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, OrbitControls, useGLTF } from '@react-three/drei'
import {
  EffectComposer,
  Selection,
  Select,
  SelectiveBloom,
} from '@react-three/postprocessing'
import HolographicMaterial from '../HolographicMaterial/HolographicMaterial'
import * as THREE from 'three'
import './model.css'

/**
 * Convert any GLTF into a list of <mesh> so we can attach our material.
 * NOTE: Skinned/animated meshes would need a different approach.
 */
function useMeshesFromGLTF(url) {
  const { scene } = useGLTF(url)
  return useMemo(() => {
    const meshes = []
    scene.updateMatrixWorld(true)
    scene.traverse((obj) => {
      if (obj.isMesh && obj.geometry) {
        const geom = obj.geometry
        const matWorld = new THREE.Matrix4().copy(obj.matrixWorld)
        meshes.push({ geometry: geom, matrixWorld: matWorld })
      }
    })
    return meshes
  }, [scene])
}

const InteractiveModel = ({ url, holoProps }) => {
  const group = useRef()
  const meshes = useMeshesFromGLTF(url)
  const [clicked, setClicked] = useState(false)

  const ROTATION_SPEED = 0.2
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * ROTATION_SPEED
  })

  return (
    <group
      ref={group}
      scale={1.1}
      onClick={() => setClicked((v) => !v)}
    >
      {meshes.map((m, i) => (
        <mesh key={i} matrixAutoUpdate={false} matrix={m.matrixWorld}>
          <bufferGeometry attach="geometry" {...m.geometry} />
          <HolographicMaterial {...holoProps} />
        </mesh>
      ))}
    </group>
  )
}

const Model = ({ modelUrl }) => {
  // --- FIXED HOLOGRAM SETTINGS (edit values here) ---
  const HOLO = {
    hologramColor: '#a0c6e4',   // base tint
    hologramOpacity: 0.9,       // 0..1 body transparency
    enableAdditive: true,       // true: bright hologram; false: glassy
    fresnelAmount: 0.6,         // 0..1 rim glow strength
    fresnelOpacity: 1.0,        // 0..1 rim max brightness
    scanlineSize: 9.0,          // ~1..15 density of scanlines
    hologramBrightness: 1.5,   // 0..2 shader brightness
    signalSpeed: 0.5,           // 0..2 scan/flicker speed
    enableBlinking: true,       // toggle flicker on/off
    blinkFresnelOnly: true,     // flicker rim only vs whole body
    side: 'DoubleSide',          // FrontSide | BackSide | DoubleSide
  }

  return (
    <div className="model">
      <div className="model_model">
        <Canvas
          gl={{ antialias: true, alpha: true, premultipliedAlpha: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);           // keep transparent background
            gl.toneMapping = THREE.NoToneMapping;    // stop ACES/filmic warm shift
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >

          <ambientLight intensity={Math.PI / 2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI/3} />
          <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

          {/* Only selected objects will receive bloom */}
          <Selection>
            <Bounds fit observe margin={1.2}>
              <Select enabled>
                <InteractiveModel url={modelUrl} holoProps={HOLO} />
              </Select>
            </Bounds>

            {/* <EffectComposer disableNormalPass>
              <SelectiveBloom
                intensity={0.45}
                luminanceThreshold={0.9}  // higher = only the very brightest glow
                luminanceSmoothing={0.2}
                radius={0.7}
              />

            </EffectComposer> */}
          </Selection>

          <OrbitControls />
        </Canvas>
      </div>
    </div>
  )
}

export default Model
