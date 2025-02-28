"use client"; // Ensure it runs only on the client side

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeHeart = () => {
  const mountRef = useRef(null);
  const requestRef = useRef(null); // Store animation frame ID

  useEffect(() => {
    // Create Scene, Camera & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(625, 525);
    renderer.setClearColor(0x000000, 0); // Transparent background

    if (mountRef.current) {
      mountRef.current.innerHTML = ""; // Clear previous renderers
      mountRef.current.appendChild(renderer.domElement);
    }

    const vertices = [
      new THREE.Vector3(0, 0, 0), // point C
      new THREE.Vector3(0, 5, -1.5),
      new THREE.Vector3(5, 5, 0), // point A
      new THREE.Vector3(9, 9, 0),
      new THREE.Vector3(5, 9, 2),
      new THREE.Vector3(7, 13, 0),
      new THREE.Vector3(3, 13, 0),
      new THREE.Vector3(0, 11, 0),
      new THREE.Vector3(5, 9, -2),
      new THREE.Vector3(0, 8, -3),
      new THREE.Vector3(0, 8, 3),
      new THREE.Vector3(0, 5, 1.5), // point B
      new THREE.Vector3(-9, 9, 0),
      new THREE.Vector3(-5, 5, 0),
      new THREE.Vector3(-5, 9, -2),
      new THREE.Vector3(-5, 9, 2),
      new THREE.Vector3(-7, 13, 0),
      new THREE.Vector3(-3, 13, 0),
    ];
    const trianglesIndexes = [
      // face 1
      2,
      11,
      0, // This represents the 3 points A,B,C which compose the first triangle
      2,
      3,
      4,
      5,
      4,
      3,
      4,
      5,
      6,
      4,
      6,
      7,
      4,
      7,
      10,
      4,
      10,
      11,
      4,
      11,
      2,
      0,
      11,
      13,
      12,
      13,
      15,
      12,
      15,
      16,
      16,
      15,
      17,
      17,
      15,
      7,
      7,
      15,
      10,
      11,
      10,
      15,
      13,
      11,
      15,
      // face 2
      0,
      1,
      2,
      1,
      9,
      2,
      9,
      8,
      2,
      5,
      3,
      8,
      8,
      3,
      2,
      6,
      5,
      8,
      7,
      6,
      8,
      9,
      7,
      8,
      14,
      17,
      7,
      14,
      7,
      9,
      14,
      9,
      1,
      9,
      1,
      13,
      1,
      0,
      13,
      14,
      1,
      13,
      16,
      14,
      12,
      16,
      17,
      14,
      12,
      14,
      13,
    ];
    const geometry = new THREE.BufferGeometry();
    const verticesArray = new Float32Array(
      vertices.flatMap((v) => [v.x / 6, v.y / 4 - 1.5, v.z / 6])
    );
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(verticesArray, 3)
    );
    geometry.setIndex(trianglesIndexes);
    geometry.computeVertexNormals(); // Smooth shading

    // 🎨 **Create Material**
    const material = new THREE.MeshPhongMaterial({
      color: 0xad0c00,
      side: THREE.DoubleSide,
    });

    // ❤️ **Create Mesh**
    const heartMesh = new THREE.Mesh(geometry, material);
    scene.add(heartMesh);

    // 🕸️ **Wireframe**
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 5 })
    );
    scene.add(wireframe);

    // 🎥 Camera Position
    camera.position.z = 4;

    // 🎬 **Animation Loop**
    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      heartMesh.rotation.y += 0.01; // Rotate heart
      wireframe.rotation.y += 0.01; // Rotate wireframe
      renderer.render(scene, camera);
    };
    animate();

    // 🔄 **Cleanup on Unmount**
    return () => {
      cancelAnimationFrame(requestRef.current); // Stop animation
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      scene.remove(heartMesh);
      scene.remove(wireframe);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="three-container" />;
};

export default ThreeHeart;
