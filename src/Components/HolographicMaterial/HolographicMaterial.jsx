/**  
 * Holographic material component by Anderson Mancini - Dec 2023.  
 * Dec 7th - Added useMemo for better performance  
 */
import React, { useRef, useMemo } from 'react'
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import {
  Color,
  FrontSide,
  BackSide,
  DoubleSide,
  AdditiveBlending,
  NormalBlending
} from 'three'

/**
 * @param {Number} fresnelAmount - 0.0..1.0
 * @param {Number} fresnelOpacity - 0.0..1.0
 * @param {Number} scanlineSize - 1..15
 * @param {Number} hologramBrightness - 0.0..2.0
 * @param {Number} signalSpeed - 0.0..2.0
 * @param {String} hologramColor - hex string
 * @param {Number} hologramOpacity - 0.0..1.0
 * @param {Boolean} enableBlinking - default true
 * @param {Boolean} blinkFresnelOnly - default true
 * @param {Boolean} enableAdditive - default true
 * @param {String} side - "FrontSide" | "BackSide" | "DoubleSide"
 */
export default function HolographicMaterial({
  fresnelAmount = 0.45,
  fresnelOpacity = 1.0,
  scanlineSize = 8.0,
  hologramBrightness = 1.2,
  signalSpeed = 0.45,
  hologramColor = '#51a4de',
  enableBlinking = true,
  blinkFresnelOnly = true,
  enableAdditive = true,
  hologramOpacity = 1.0,
  side = 'FrontSide'
}) {
  const HoloMatClass = useMemo(() => {
    return shaderMaterial(
      {
        time: 0,
        fresnelOpacity: fresnelOpacity,
        fresnelAmount: fresnelAmount,
        scanlineSize: scanlineSize,
        hologramBrightness: hologramBrightness,
        signalSpeed: signalSpeed,
        hologramColor: new Color(hologramColor),
        enableBlinking: enableBlinking,
        blinkFresnelOnly: blinkFresnelOnly,
        hologramOpacity: hologramOpacity
      },
      /* vertex */ `
#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
varying vec3 vWorldPosition;
#endif
varying vec2 vUv;
varying vec4 vPos;
varying vec3 vNormalW;
varying vec3 vPositionW;

#include <common>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {
  #include <uv_vertex>
  #include <color_vertex>
  #include <morphcolor_vertex>
  #if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
    #include <beginnormal_vertex>
    #include <morphnormal_vertex>
    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <defaultnormal_vertex>
  #endif

  #include <begin_vertex>
  #include <morphtarget_vertex>
  #include <skinning_vertex>
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>

  #include <worldpos_vertex>
  #include <envmap_vertex>
  #include <fog_vertex>

  mat4 modelViewProjectionMatrix = projectionMatrix * modelViewMatrix;
  vUv = uv;
  vPos = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );
  vPositionW = vec3( vec4( transformed, 1.0 ) * modelMatrix);
  vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );
  gl_Position = modelViewProjectionMatrix * vec4( transformed, 1.0 );
}`,
      /* fragment */ `
varying vec2 vUv;
varying vec3 vPositionW;
varying vec4 vPos;
varying vec3 vNormalW;

uniform float time;
uniform float fresnelOpacity;
uniform float scanlineSize;
uniform float fresnelAmount;
uniform float signalSpeed;
uniform float hologramBrightness;
uniform float hologramOpacity;
uniform bool blinkFresnelOnly;
uniform bool enableBlinking;
uniform vec3 hologramColor;

float flicker( float amt, float time ) {return clamp( fract( cos( time ) * 43758.5453123 ), amt, 1.0 );}
float random(in float a, in float b) { return fract((cos(dot(vec2(a,b) ,vec2(12.9898,78.233))) * 43758.5453)); }

void main() {
  vec2 vCoords = vPos.xy;
  vCoords /= vPos.w;
  vCoords = vCoords * 0.5 + 0.5;
  vec2 myUV = fract( vCoords );

  // Base hologram color
  vec4 holo = vec4(hologramColor, mix(hologramBrightness, vUv.y, 0.5));

    // --- Scanlines (monochrome + clamped) ---
    float scanlines = 10.;
    scanlines += 20. * sin(time * signalSpeed * 20.8 - myUV.y * 60. * scanlineSize);
    scanlines *= smoothstep(1.3 * cos(time * signalSpeed + myUV.y * scanlineSize), 0.78, 0.9);
    scanlines *= max(0.25, sin(time * signalSpeed) * 1.0);

    // remove RGB channel shuffling; use only hologram tint
    float s = max(0.0, scanlines) / 84.0;
    vec3 tint = normalize(hologramColor);
    holo.rgb += tint * s;

    // compose
    vec4 scanlineMix = mix(vec4(0.0), holo, holo.a);



  // Fresnel
  vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
  float fresnelEffect = dot(viewDirectionW, vNormalW) * (1.6 - fresnelOpacity/2.);
  fresnelEffect = clamp(fresnelAmount - fresnelEffect, 0., fresnelOpacity);

  // Blinking (suggested by @OtanoDesign)
  float blinkValue = enableBlinking ? 0.6 - signalSpeed : 1.0;
  float blink = flicker(blinkValue, time * signalSpeed * .02);

  // Final
  vec3 finalColor;
  if (blinkFresnelOnly) {
    finalColor = scanlineMix.rgb + fresnelEffect * blink;
  } else {
    finalColor = scanlineMix.rgb * blink + fresnelEffect;
  }

  // Lock hue to hologramColor: convert to luminance and re-tint
float lumin = dot(finalColor, vec3(0.2126, 0.7152, 0.0722));
finalColor = lumin * normalize(hologramColor);

  gl_FragColor = vec4(finalColor, hologramOpacity);
}`
    )
  }, [
    fresnelAmount,
    fresnelOpacity,
    scanlineSize,
    hologramBrightness,
    signalSpeed,
    hologramColor,
    enableBlinking,
    blinkFresnelOnly,
    enableAdditive,
    hologramOpacity,
    side
  ])

  extend({ HolographicMaterial: HoloMatClass })

  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) ref.current.time += delta
  })

  return (
    <holographicMaterial
      key={HoloMatClass.key}
      side={
        side === 'DoubleSide' ? DoubleSide :
        side === 'BackSide'   ? BackSide   : FrontSide
      }
      transparent
      blending={enableAdditive ? AdditiveBlending : NormalBlending}
      ref={ref}
    />
  )
}
