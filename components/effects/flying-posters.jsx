'use client';

import { useRef, useEffect } from 'react';
import { Renderer, Camera, Transform, Plane, Program, Mesh, Texture } from 'ogl';

import './flying-posters.css';

const vertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float uPosition;
uniform float uTime;
uniform float uSpeed;
uniform vec3 distortionAxis;
uniform vec3 rotationAxis;
uniform float uDistortion;

varying vec2 vUv;
varying vec3 vNormal;

float PI = 3.141592653589793238;
mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(
      oc * axis.x * axis.x + c,         oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s,oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s,oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                              0.0,                                0.0,                                1.0
    );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

float qinticInOut(float t) {
  return t < 0.5
    ? 16.0 * pow(t, 5.0)
    : -0.5 * abs(pow(2.0 * t - 2.0, 5.0)) + 1.0;
}

void main() {
  vUv = uv;
  
  float norm = 0.5;
  vec3 newpos = position;
  float offset = (dot(distortionAxis, position) + norm / 2.) / norm;
  float localprogress = clamp(
    (fract(uPosition * 5.0 * 0.01) - 0.01 * uDistortion * offset) / (1. - 0.01 * uDistortion),
    0.,
    2.
  );
  localprogress = qinticInOut(localprogress) * PI;
  newpos = rotate(newpos, rotationAxis, localprogress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec2 imageSize = uImageSize;
  vec2 planeSize = uPlaneSize;

  float imageAspect = imageSize.x / imageSize.y;
  float planeAspect = planeSize.x / planeSize.y;
  vec2 scale = vec2(1.0, 1.0);

  if (planeAspect > imageAspect) {
      scale.x = imageAspect / planeAspect;
  } else {
      scale.y = planeAspect / imageAspect;
  }

  vec2 uv = vUv * scale + (1.0 - scale) * 0.5;

  gl_FragColor = texture2D(tMap, uv);
}
`;

function AutoBind(self, { include, exclude } = {}) {
  const getAllProperties = object => {
    const properties = new Set();
    do {
      for (const key of Reflect.ownKeys(object)) {
        properties.add([object, key]);
      }
    } while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);
    return properties;
  };

  const filter = key => {
    const match = pattern => (typeof pattern === 'string' ? key === pattern : pattern.test(key));

    if (include) return include.some(match);
    if (exclude) return !exclude.some(match);
    return true;
  };

  for (const [object, key] of getAllProperties(self.constructor.prototype)) {
    if (key === 'constructor' || !filter(key)) continue;
    const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    if (descriptor && typeof descriptor.value === 'function') {
      self[key] = self[key].bind(self);
    }
  }
  return self;
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function map(num, min1, max1, min2, max2, round = false) {
  const num1 = (num - min1) / (max1 - min1);
  const num2 = num1 * (max2 - min2) + min2;
  return round ? Math.round(num2) : num2;
}

function wrapAround(value, total) {
  if (!total) return value;
  const half = total * 0.5;
  return ((((value + half) % total) + total) % total) - half;
}

class Media {
  constructor({ gl, geometry, scene, screen, viewport, image, length, index, planeWidth, planeHeight, distortion }) {
    this.extra = 0;
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.image = image;
    this.length = length;
    this.index = index;
    this.planeWidth = planeWidth;
    this.planeHeight = planeHeight;
    this.distortion = distortion;

    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: false
    });

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      fragment: fragmentShader,
      vertex: vertexShader,
      uniforms: {
        tMap: { value: texture },
        uPosition: { value: 0 },
        uPlaneSize: { value: [0, 0] },
        uImageSize: { value: [0, 0] },
        uSpeed: { value: 0 },
        rotationAxis: { value: [0, 1, 0] },
        distortionAxis: { value: [1, 1, 0] },
        uDistortion: { value: this.distortion },
        uViewportSize: { value: [this.viewport.width, this.viewport.height] },
        uTime: { value: 0 }
      },
      cullFace: false
    });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSize.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }

  setScale() {
    this.plane.scale.x = (this.viewport.width * this.planeWidth) / this.screen.width;
    this.plane.scale.y = (this.viewport.height * this.planeHeight) / this.screen.height;

    this.plane.position.x = 0;
    this.plane.program.uniforms.uPlaneSize.value = [this.plane.scale.x, this.plane.scale.y];
  }

  setMetrics({ planeWidth, planeHeight, distortion } = {}) {
    if (planeWidth != null) this.planeWidth = planeWidth;
    if (planeHeight != null) this.planeHeight = planeHeight;
    if (distortion != null) {
      this.distortion = distortion;
      this.program.uniforms.uDistortion.value = distortion;
    }
    this.onResize();
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      this.plane.program.uniforms.uViewportSize.value = [this.viewport.width, this.viewport.height];
    }
    this.setScale();

    this.padding = 5;
    this.height = this.plane.scale.y + this.padding;
    this.heightTotal = this.height * this.length;

    this.y = -this.heightTotal / 2 + (this.index + 0.5) * this.height;
    this.extra = 0;
  }

  update(scroll) {
    // Modulo wrap — stable across large scrub jumps (no single-step catch-up flicker)
    const rawY = this.y - scroll.current;
    const wrappedY = wrapAround(rawY, this.heightTotal);
    this.extra = rawY - wrappedY;
    this.plane.position.y = wrappedY;

    const position = map(this.plane.position.y, -this.viewport.height, this.viewport.height, 5, 15);

    this.program.uniforms.uPosition.value = position;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = scroll.current;
  }
}

class Canvas {
  constructor({
    container,
    canvas,
    items,
    planeWidth,
    planeHeight,
    distortion,
    scrollEase,
    cameraFov,
    cameraZ,
    externalControl = false
  }) {
    this.container = container;
    this.canvas = canvas;
    this.items = items;
    this.planeWidth = planeWidth;
    this.planeHeight = planeHeight;
    this.distortion = distortion;
    this.externalControl = externalControl;
    this.scroll = {
      ease: scrollEase,
      current: 0,
      target: 0,
      last: 0
    };
    this.cameraFov = cameraFov;
    this.cameraZ = cameraZ;
    this.raf = 0;
    this.isDestroyed = false;

    AutoBind(this);

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();

    this.createGeometry();
    this.createMedias();
    this.update();
    this.addEventListeners();
    this.createPreloader();
  }

  createRenderer() {
    this.renderer = new Renderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2)
    });
    this.gl = this.renderer.gl;
    // Solid clear avoids translucent trail / flicker on transparent canvases
    this.gl.clearColor(0, 0, 0, 0);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = this.cameraFov;
    this.camera.position.z = this.cameraZ;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 1,
      widthSegments: 100
    });
  }

  createMedias() {
    this.medias = this.items.map((image, index) => {
      return new Media({
        gl: this.gl,
        geometry: this.planeGeometry,
        scene: this.scene,
        screen: this.screen,
        viewport: this.viewport,
        image,
        length: this.items.length,
        index,
        planeWidth: this.planeWidth,
        planeHeight: this.planeHeight,
        distortion: this.distortion
      });
    });
  }

  createPreloader() {
    this.loaded = 0;
    if (!this.items.length) return;

    this.items.forEach(src => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = src;
      image.onload = () => {
        this.loaded += 1;
        if (this.loaded === this.items.length) {
          document.documentElement.classList.remove('loading');
          document.documentElement.classList.add('loaded');
        }
      };
    });
  }

  setParams({ planeWidth, planeHeight, distortion, scrollEase, cameraFov, cameraZ } = {}) {
    if (planeWidth != null) this.planeWidth = planeWidth;
    if (planeHeight != null) this.planeHeight = planeHeight;
    if (distortion != null) this.distortion = distortion;
    if (scrollEase != null) this.scroll.ease = scrollEase;
    if (cameraFov != null) {
      this.cameraFov = cameraFov;
      this.camera.fov = cameraFov;
    }
    if (cameraZ != null) {
      this.cameraZ = cameraZ;
      this.camera.position.z = cameraZ;
    }

    if (this.medias) {
      this.medias.forEach(media =>
        media.setMetrics({
          planeWidth: this.planeWidth,
          planeHeight: this.planeHeight,
          distortion: this.distortion
        })
      );
    }

    this.onResize(true);
  }

  onResize(force = false) {
    if (this.isDestroyed || !this.container) return;

    const rect = this.container.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    // Skip no-op resizes (sticky/layout thrash was resizing the canvas every frame)
    if (
      !force &&
      this.screen &&
      this.screen.width === width &&
      this.screen.height === height
    ) {
      return;
    }

    this.screen = { width, height };

    this.renderer.setSize(width, height);

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    });

    const fov = (this.camera.fov * Math.PI) / 180;
    const viewHeight = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const viewWidth = viewHeight * this.camera.aspect;

    this.viewport = { height: viewHeight, width: viewWidth };

    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }

  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientY : e.clientY;
  }

  onTouchMove(e) {
    if (!this.isDown) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const distance = (this.start - y) * 0.1;
    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    this.isDown = false;
  }

  onWheel(e) {
    if (this.externalControl) return;
    const speed = e.deltaY;
    this.scroll.target += speed * 0.005;
  }

  /** Map 0–1 page-scroll progress onto one full poster loop. */
  setScrollProgress(progress) {
    const range = this.getScrollRange();
    const value = Math.max(0, Math.min(1, progress)) * range;
    this.scroll.target = value;
    // Snap current when scrubbing so lerp never fights ScrollTrigger
    if (this.externalControl) {
      this.scroll.current = value;
    }
  }

  getScrollRange() {
    if (this.medias && this.medias[0] && this.medias[0].heightTotal) {
      return this.medias[0].heightTotal;
    }
    return Math.max(1, this.items.length);
  }

  update() {
    if (this.isDestroyed) return;

    if (!this.externalControl) {
      this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    }

    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = requestAnimationFrame(this.update);
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize);

    if (!this.externalControl) {
      window.addEventListener('wheel', this.onWheel);
      window.addEventListener('mousewheel', this.onWheel);

      window.addEventListener('mousedown', this.onTouchDown);
      window.addEventListener('mousemove', this.onTouchMove);
      window.addEventListener('mouseup', this.onTouchUp);

      window.addEventListener('touchstart', this.onTouchDown);
      window.addEventListener('touchmove', this.onTouchMove);
      window.addEventListener('touchend', this.onTouchUp);
    }
  }

  destroy() {
    this.isDestroyed = true;
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('mousewheel', this.onWheel);

    window.removeEventListener('mousedown', this.onTouchDown);
    window.removeEventListener('mousemove', this.onTouchMove);
    window.removeEventListener('mouseup', this.onTouchUp);

    window.removeEventListener('touchstart', this.onTouchDown);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchUp);
  }
}

export default function FlyingPosters({
  items = [],
  planeWidth = 320,
  planeHeight = 320,
  distortion = 3,
  scrollEase = 0.01,
  cameraFov = 45,
  cameraZ = 20,
  /** When true, page scroll drives the gallery via setScrollProgress. */
  externalControl = false,
  /** Optional 0–1 progress (prefer imperative setScrollProgress for scrub). */
  scrollProgress = undefined,
  onReady,
  className,
  ...props
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const instanceRef = useRef(null);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  // Mount once per items/control mode — size tweaks update in place (avoids remount flicker)
  useEffect(() => {
    if (!containerRef.current) return;

    const instance = new Canvas({
      container: containerRef.current,
      canvas: canvasRef.current,
      items,
      planeWidth,
      planeHeight,
      distortion,
      scrollEase,
      cameraFov,
      cameraZ,
      externalControl
    });

    instanceRef.current = instance;
    onReadyRef.current?.({
      setScrollProgress: progress => instance.setScrollProgress(progress),
      getScrollRange: () => instance.getScrollRange()
    });

    const ro = new ResizeObserver(() => {
      instance.onResize();
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      instance.destroy();
      instanceRef.current = null;
      onReadyRef.current?.(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- size props applied via setParams below
  }, [items, externalControl]);

  useEffect(() => {
    instanceRef.current?.setParams({
      planeWidth,
      planeHeight,
      distortion,
      scrollEase,
      cameraFov,
      cameraZ
    });
  }, [planeWidth, planeHeight, distortion, scrollEase, cameraFov, cameraZ]);

  useEffect(() => {
    if (!externalControl || scrollProgress == null || !instanceRef.current) return;
    instanceRef.current.setScrollProgress(scrollProgress);
  }, [externalControl, scrollProgress]);

  useEffect(() => {
    if (!canvasRef.current || externalControl) return;

    const canvasEl = canvasRef.current;

    const handleWheel = e => {
      e.preventDefault();
      if (instanceRef.current) {
        instanceRef.current.onWheel(e);
      }
    };

    const handleTouchMove = e => {
      e.preventDefault();
    };

    canvasEl.addEventListener('wheel', handleWheel, { passive: false });
    canvasEl.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      canvasEl.removeEventListener('wheel', handleWheel);
      canvasEl.removeEventListener('touchmove', handleTouchMove);
    };
  }, [externalControl]);

  return (
    <div ref={containerRef} className={`posters-container${className ? ` ${className}` : ''}`} {...props}>
      <canvas ref={canvasRef} className="posters-canvas" />
    </div>
  );
}
