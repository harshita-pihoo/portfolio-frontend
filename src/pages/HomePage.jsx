import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";

/* ================= CAMERA ZOOM ================= */

const CameraAnimation = () => {
  useFrame(({ camera }) => {
    if (camera.position.z > 2.5) {
      camera.position.z -= 0.01;
    }
  });

  return null;
};

/* ================= DESK ================= */

const Desk = () => (
  <mesh
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, -1, 0]}
    receiveShadow
  >
    <planeGeometry args={[20, 20]} />
    <meshStandardMaterial color="#5b3a29" roughness={0.9} />
  </mesh>
);

/* ================= LAPTOP ================= */

const Laptop = () => {
  const ref = useRef();

  useFrame(({ mouse }) => {
    if (ref.current) {
      ref.current.rotation.y = mouse.x * 0.4;
    }
  });

  return (
    <group ref={ref} position={[0, -0.3, 0]}>
      {/* Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1.5]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      {/* Screen */}
      <mesh
        position={[0, 0.8, -0.7]}
        rotation={[-0.4, 0, 0]}
        castShadow
      >
        <boxGeometry args={[2, 1.2, 0.05]} />
        <meshStandardMaterial
          color="#020617"
          emissive="#facc15"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
};

/* ================= COFFEE ================= */

const Coffee = () => (
  <mesh position={[1, -0.5, 0.5]} castShadow>
    <cylinderGeometry args={[0.25, 0.25, 0.6, 32]} />
    <meshStandardMaterial color="#d1d5db" roughness={0.5} />
  </mesh>
);

/* ================= STEAM ================= */

const Steam = () => {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y =
        Math.sin(clock.elapsedTime * 2) * 0.2 + 0.8;
    }
  });

  return (
    <mesh ref={ref} position={[1, 0, 0.5]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial
        color="white"
        transparent
        opacity={0.3}
      />
    </mesh>
  );
};

/* ================= SHADOW FLOOR ================= */

const ShadowFloor = () => (
  <mesh
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, -1.01, 0]}
    receiveShadow
  >
    <planeGeometry args={[20, 20]} />
    <shadowMaterial opacity={0.3} />
  </mesh>
);

/* ================= SCENE ================= */

const DeskScene = () => {
  return (
    <div className="relative w-full h-screen">
      
      <Canvas
        shadows
        camera={{ position: [0, 1, 3], fov: 50 }}
      >
        {/* Background */}
        <color attach="background" args={["#0a0a0a"]} />

        <CameraAnimation />

        {/* Lights */}
        <ambientLight intensity={0.3} />

        <pointLight
          position={[3, 3, 2]}
          intensity={2}
          color="#facc15"
          castShadow
        />

        {/* Objects */}
        <Desk />
        <ShadowFloor />
        <Laptop />
        <Coffee />

        <Float speed={2}>
          <Steam />
        </Float>
      </Canvas>

      {/* Overlay text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-white text-4xl md:text-6xl font-bold">
          Welcome to my portfolio
        </h1>
      </div>
    </div>
  );
};

export default DeskScene;