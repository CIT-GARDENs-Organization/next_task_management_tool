"use client";

import {Canvas} from "@react-three/fiber";
import {OrbitControls, Html, useGLTF} from "@react-three/drei";
import {Suspense, useEffect, useState} from "react";
import {useSpring, animated} from "@react-spring/three";
import {
  useSpring as useTextSpring,
  animated as animatedText,
} from "@react-spring/web";
import Image from "next/image";
import * as THREE from "three";

type GLTF = {
  nodes: Record<string, THREE.Object3D>;
  materials: Record<string, THREE.Material>;
  scene: THREE.Scene;
};

function usePreloadedGLTF(paths: string[]): Record<string, GLTF> {
  const gltfCache: Record<string, GLTF> = {};

  paths.forEach((path) => {
    if (!gltfCache[path]) {
      gltfCache[path] = useGLTF(path) as unknown as GLTF;
    }
  });

  return gltfCache;
}

function AnimatedModel({
  scene,
  rotationOffset,
  isLoaded,
}: {
  scene: THREE.Scene;
  rotationOffset: number;
  isLoaded: boolean;
}) {
  const {scale, rotation} = useSpring({
    scale: isLoaded ? 1 : 0.1,
    rotation: isLoaded ? [0, rotationOffset, 0] : [Math.PI, Math.PI, Math.PI],
    config: {
      mass: 1,
      tension: 280,
      friction: 60,
    },
    immediate: !isLoaded,
  });

  return (
    <animated.primitive object={scene} scale={scale} rotation={rotation} />
  );
}

export default function Viewer() {
  const gltfCache = usePreloadedGLTF(["/BOTAN.glb", "/BOTAN_INT.glb"]);
  const [currentModel, setCurrentModel] = useState<string>("/BOTAN.glb");
  const [rotationOffset, setRotationOffset] = useState<number>(0);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const {opacity} = useTextSpring({
    opacity: isLoaded ? 1 : 0,
    config: {duration: 800},
    immediate: !isLoaded,
  });

  useEffect(() => {
    if (gltfCache[currentModel]) {
      setIsLoaded(true);
    }
  }, [gltfCache, currentModel]);

  useEffect(() => {
    if (isAutoRotate) {
      const interval = setInterval(() => {
        setRotationOffset((prev) => prev + (2 * Math.PI) / (60 * 10));
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isAutoRotate]);

  const handleSwitchModel = () => {
    setCurrentModel((prev) =>
      prev === "/BOTAN.glb" ? "/BOTAN_INT.glb" : "/BOTAN.glb"
    );
  };

  const handleToggleAutoRotate = () => {
    setIsAutoRotate((prev) => !prev);
  };

  return (
    <main className="w-full h-screen relative">
      {/* 3Dモデル */}
      <Canvas
        camera={{
          position: [400, -300, -300],
          fov: 40,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="animate-pulse text-lg">Loading Satellite...</div>
            </Html>
          }
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />

          {gltfCache[currentModel] && (
            <AnimatedModel
              scene={gltfCache[currentModel].scene}
              rotationOffset={rotationOffset}
              isLoaded={isLoaded}
            />
          )}

          <OrbitControls
            target={[0, 0, 0]}
            minDistance={100}
            maxDistance={800}
            enablePan={true}
            enableZoom={true}
          />
        </Suspense>
      </Canvas>

      {/* ロゴと衛星名 */}
      <animatedText.div
        className="absolute top-4 left-4 bg-gray-500 bg-opacity-80 text-white p-4 rounded shadow-lg flex items-center"
        style={{
          backdropFilter: "blur(10px)",
          opacity,
        }}
      >
        <Image
          src="/BTN_LOG_monochrome.png"
          alt="BOTAN_LOGO"
          width={30}
          height={30}
          className="mr-4"
        />
        <h2 className="text-xl font-bold">SAT.4 BOTAN</h2>
      </animatedText.div>

      {/* スイッチボタン */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-4">
        {/* モデル切り替えボタン */}
        <button
          onClick={handleSwitchModel}
          className={`${
            currentModel === "/BOTAN_INT.glb"
              ? "bg-black text-white"
              : "bg-gray-700 text-gray-200"
          } bg-opacity-80 p-3 rounded shadow-lg`}
        >
          {currentModel === "/BOTAN_INT.glb"
            ? "External Panel ON"
            : "External Panel OFF"}
        </button>

        {/* 自動回転切り替えボタン */}
        <button
          onClick={handleToggleAutoRotate}
          className={`${
            isAutoRotate ? "bg-black text-white" : "bg-gray-700 text-gray-200"
          } bg-opacity-80 p-3 rounded shadow-lg`}
        >
          {isAutoRotate ? "Auto Rotate ON" : "Auto Rotate OFF"}
        </button>
      </div>
    </main>
  );
}
