import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  className?: string;
  interactive?: boolean;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ className = '', interactive = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const isRotatingRef = useRef(true);
  isRotatingRef.current = isRotating;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Group for the entire 3D medallion
    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Medallion Cylinder (Gold Base)
    const medalGeo = new THREE.CylinderGeometry(2, 2, 0.28, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xE8C971,
      metalness: 0.88,
      roughness: 0.22,
      wireframe: false,
    });
    const medallion = new THREE.Mesh(medalGeo, goldMat);
    medallion.rotation.x = Math.PI / 2;
    group.add(medallion);

    // 2. Beveled Golden Rim
    const rimGeo = new THREE.TorusGeometry(2.05, 0.1, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xC99620,
      metalness: 0.95,
      roughness: 0.15,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    group.add(rim);

    // 3. Inner Decorative Rings (Orbits)
    const ring1Geo = new THREE.TorusGeometry(2.45, 0.025, 12, 80);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xF5DE95, transparent: true, opacity: 0.65 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 4;
    group.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.7, 0.02, 12, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x6FA995, transparent: true, opacity: 0.5 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    group.add(ring2);

    // 4. Central Emblem Face Texture (MAN 1 Surakarta Badge / Star)
    // Create a procedural high-res canvas texture for the face
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Outer emerald ring
      const cx = 256, cy = 256;
      ctx.fillStyle = '#1D3B2E';
      ctx.beginPath();
      ctx.arc(cx, cy, 240, 0, Math.PI * 2);
      ctx.fill();

      // Golden border ring
      ctx.strokeStyle = '#E8C971';
      ctx.lineWidth = 14;
      ctx.stroke();

      ctx.strokeStyle = 'rgba(232, 201, 113, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 218, 0, Math.PI * 2);
      ctx.stroke();

      // Arabic star / Islamic octagon pattern
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = '#F0D88F';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.strokeRect(-90, -90, 180, 180);
      }
      ctx.restore();

      // Central core emblem
      ctx.fillStyle = '#244838';
      ctx.beginPath();
      ctx.arc(cx, cy, 130, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#E8C971';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Text: MAN 1 SURAKARTA
      ctx.fillStyle = '#FCECC2';
      ctx.font = 'bold 36px "Fraunces", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MAN 1', cx, cy - 35);
      ctx.fillText('SURAKARTA', cx, cy + 15);

      ctx.fillStyle = '#99E4BE';
      ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('X E-11 · EUPHORIA', cx, cy + 65);

      // Star accents
      ctx.fillStyle = '#E8C971';
      ctx.font = '22px serif';
      ctx.fillText('★ 2026 - 2029 ★', cx, cy + 98);
    }

    const faceTexture = new THREE.CanvasTexture(canvas);
    const faceMat = new THREE.MeshStandardMaterial({
      map: faceTexture,
      roughness: 0.35,
      metalness: 0.6,
    });
    const facePlaneGeo = new THREE.CircleGeometry(1.95, 48);
    const facePlane = new THREE.Mesh(facePlaneGeo, faceMat);
    facePlane.position.z = 0.145;
    group.add(facePlane);

    // Back face
    const backPlane = new THREE.Mesh(facePlaneGeo, faceMat);
    backPlane.position.z = -0.145;
    backPlane.rotation.y = Math.PI;
    group.add(backPlane);

    // 5. Surrounding Gold Dust Particles
    const particleCount = 65;
    const partGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const r = 2.4 + Math.random() * 1.6;
      positions[i] = Math.cos(theta) * r;
      positions[i + 1] = Math.sin(theta) * r;
      positions[i + 2] = (Math.random() - 0.5) * 1.5;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xE8C971,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
    });
    const particleSystem = new THREE.Points(partGeo, partMat);
    group.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xFFEAA0, 2.2);
    dirLight1.position.set(5, 6, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x70C2A0, 1.5);
    dirLight2.position.set(-6, -4, 4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xF8D978, 1.8, 15);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Drag / Touch to interactively orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0.15;

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotY += deltaX * 0.012;
      targetRotX += deltaY * 0.012;
      targetRotX = Math.max(-0.8, Math.min(0.8, targetRotX));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    let animId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (isRotatingRef.current && !isDragging) {
        targetRotY += delta * 0.55;
      }

      // Smooth interpolation
      group.rotation.y += (targetRotY - group.rotation.y) * 0.08;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.08;

      // Orbiting rings
      ring1.rotation.z += delta * 0.4;
      ring2.rotation.z -= delta * 0.3;

      // Floating wave motion
      group.position.y = Math.sin(time * 1.5) * 0.1;

      // Rotate particles slightly
      particleSystem.rotation.z += delta * 0.1;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <div
        ref={mountRef}
        className="w-full h-full min-h-[280px] max-h-[380px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        title="Geser atau klik untuk memutar 3D Medallion"
      />
      {/* 3D Widget Quick Controls */}
      <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-black/40 hover:bg-black/60 text-white/90 backdrop-blur-md border border-white/20 transition-colors shadow-sm"
        >
          {isRotating ? '⏸ Putar Otomatis' : '▶ Putar Otomatis'}
        </button>
        <span className="text-[10px] text-white/70 bg-black/30 px-2 py-1 rounded-full backdrop-blur-md hidden sm:inline">
          🖱 Tarik untuk melihat 3D
        </span>
      </div>
    </div>
  );
};
