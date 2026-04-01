import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';

// ── 3D shapes ──────────────────────────────────────────────
const RotatingShape = () => {
  const meshRef = useRef();
  useFrame(() => {
    meshRef.current.rotation.x += 0.004;
    meshRef.current.rotation.y += 0.006;
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 0]} />
      <meshStandardMaterial color="#4f46e5" metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

const FloatingOrb = ({ position, color, speed }) => {
  const ref = useRef();
  useFrame((state) => {
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
    </mesh>
  );
};

// ── Magic cursor trail ──────────────────────────────────────
const CursorTrail = () => {
  useEffect(() => {
    const particles = [];
    const colors = ['#f59e0b', '#fb923c', '#a78bfa', '#818cf8', '#fbbf24'];

    const handleMouseMove = (e) => {
      const particle = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 10 + 4;

      Object.assign(particle.style, {
        position: 'fixed',
        left: e.clientX + 'px',
        top: e.clientY + 'px',
        width: size + 'px',
        height: size + 'px',
        borderRadius: '50%',
        background: color,
        pointerEvents: 'none',
        zIndex: '9999',
        transform: 'translate(-50%, -50%)',
        opacity: '1',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        boxShadow: `0 0 ${size * 2}px ${color}`,
      });

      document.body.appendChild(particle);
      particles.push(particle);

      requestAnimationFrame(() => {
        particle.style.opacity = '0';
        particle.style.transform = `translate(-50%, -50%) scale(0.2)`;
      });

      setTimeout(() => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
      }, 700);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null;
};

// ── ASCII art (mango/amber colored) ────────────────────────
const ASCII_ART = `
                                    ▄▄██████████▄▄
                                  ▄██▓▓▓███▓███████▄
                                 ▐█▓▒▀     ▀▀▀▓█████▌
                                 ▓▒▒          ▒▒▓▓███
                                 ▓           ░▒▒▒▒███
                                ▐▒            ▄▄▒▒▀██
                               ▐▒▌    ▄▄   ▐▓▓▒▄▓▒░██
                              ▐█▌      ▀   ▐▓▓▓▓▓▀░███
                              ▐██           ▒░     ██▌▌▄
                               ▓█▄         ▓▓▌  ░░▒▒█▌▌ ▌
                               ▐█▓         ▓▒█▓▒▒▒████▓▓▐
                               ██▓▓        ▐▓▒▓▒▒███████▒▌
                            ▄▄██████       ░▒▒▒█████████▓▌
                           ▐████████▌      ░▒███████████▌▌
                         ▄▓██████████      ▒▓▓████████████▀
                         ▐▒███████████▄     ▒▒███████████▄▌▄
                     ▄▄▄▓▓█████████████▄▄   ▐▓███████████████▄▄
                  ▄▌▒▒▒▓▓▓█▓████████████▒▒   ▐▓███████████████████▄
                 ▐ █░▒▒▓███████████████▓▌▒▒▒███████████████████████▌
                 ▐ ▐▌ ▒▐███████████████▓▌ ▒▌▒███████████████████████
                ▐ ▄ ▓▄ ▐█████████▓█████▓░▒  ▓██████████████████████▌
                ▒  ▀▄▓▄ █████████▓▓▀███▓▌  ▄▐████████▓▓█████████████▌
               ▐   ▄▄▀█▌▐█████▓█▓▓▓▓▓▓▓▀    ▓▓██▓▓█▓▓▓▓██████████████
               ▒░  ▐█▓▒█▐██████▓█▓▓▓▓▓▓    ▐▓▓▓▓▓██▓▓▓▓██████████████
              ▐ ▒▒   ███ ▓██▓██▒▓██▓▓▓█▌   ▓▓▓▒▓▀▒▓▓▓████████████████▌
`;

// ── Skills ──────────────────────────────────────────────────
const skills = [
  { label: 'Java / Spring Boot', level: '80%' },
  { label: 'React / JavaScript', level: '78%' },
  { label: 'Python / ML', level: '82%' },
  { label: 'MySQL / PostgreSQL', level: '75%' },
  { label: 'OpenCV / scikit-learn', level: '78%' },
  { label: 'Three.js / 3D Web', level: '65%' },
];

// ── Main component ──────────────────────────────────────────
const HomePage = () => {
  const aboutRef = useRef(null);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-black min-h-screen">
      <CursorTrail />

      {/* ── HERO SECTION ── */}
      <div className="h-screen w-full relative">

        {/* Three.js canvas */}
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} className="absolute inset-0">
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#4f46e5" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#7c3aed" />
          <spotLight position={[0, 10, 0]} intensity={1} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <RotatingShape />
          </Float>
          <FloatingOrb position={[-3, 1, 0]} color="#f59e0b" speed={1.2} />
          <FloatingOrb position={[3, -1, 0]} color="#4f46e5" speed={0.8} />
          <FloatingOrb position={[2, 2, -1]} color="#fb923c" speed={1.5} />
          <FloatingOrb position={[-2, -2, 1]} color="#6366f1" speed={1.0} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>

        {/* Hero text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-amber-400 text-sm mb-4 tracking-widest uppercase font-medium">
            Welcome to my portfolio
          </p>
          <h1 className="text-white text-6xl font-bold text-center mb-4 leading-tight">
            Hi, I'm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Harshita Ranjan
            </span>
          </h1>
          <p className="text-gray-400 text-xl text-center max-w-lg mb-2">
            Electrical and Computer Science Engineer
          </p>
          <p className="text-gray-500 text-base text-center max-w-lg mb-10">
            Full Stack Developer · ML Enthusiast
          </p>

          {/* Nav buttons */}
          <div className="flex gap-4 pointer-events-auto flex-wrap justify-center">
            <a
              href="/projects"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-full font-semibold transition-all hover:scale-105"
            >
              Projects
            </a>
            <a
              href="/resume"
              className="bg-amber-500 hover:bg-amber-600 text-black px-7 py-3 rounded-full font-semibold transition-all hover:scale-105"
            >
              Resume
            </a>
            <a
              href="/contact"
              className="border border-white/30 hover:border-white/60 text-white px-7 py-3 rounded-full font-semibold transition-all hover:scale-105"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce cursor-pointer"
        >
          <span className="text-gray-500 text-sm">About Me</span>
          <span className="text-amber-400 text-xl">↓</span>
        </button>
      </div>

      {/* ── ABOUT ME SECTION ── */}
      <div ref={aboutRef} className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-white text-4xl font-bold mb-3">About Me</h2>
        <div className="w-16 h-1 bg-amber-500 mb-12 rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ASCII portrait */}
          <div className="flex flex-col items-center">
            <div className="bg-black border border-amber-500/20 rounded-2xl p-4 overflow-auto max-w-full">
              <pre
                style={{
                  fontFamily: 'monospace',
                  fontSize: '7px',
                  lineHeight: '8px',
                  color: '#f59e0b',
                  textShadow: '0 0 8px #f59e0b88',
                  whiteSpace: 'pre',
                  margin: 0,
                }}
              >
                {ASCII_ART}
              </pre>
            </div>
            <p className="text-amber-500/60 text-xs mt-3 tracking-widest uppercase">
              Harshita Ranjan
            </p>
          </div>

          {/* Bio + skills */}
          <div className="flex flex-col gap-8">

            {/* Bio */}
            <div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                I'm an Electrical and Computer Science student who enjoys turning
                ideas into working systems. My work spans machine learning, web
                development, and hands-on engineering projects.
              </p>
              <p className="text-gray-400 text-base leading-relaxed mb-4">
                I've built projects ranging from data-driven applications to
                interactive web platforms, focusing on both functionality and
                user experience. I'm especially interested in solving practical
                problems and understanding how systems work end-to-end.
              </p>
              <p className="text-gray-400 text-base leading-relaxed">
                Currently, I'm looking for opportunities to apply my skills in
                real-world environments and continue improving as a developer.
              </p>
            </div>

            {/* Social links */}
            <div className="flex gap-4">
              <a
                href="https://github.com/harshita-pihoo"
                target="_blank"
                rel="noreferrer"
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              >
                GitHub
              </a>
              <a
                href="www.linkedin.com/in/harshita-ranjan26"
                target="_blank"
                rel="noreferrer"
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              >
                LinkedIn
              </a>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Skills</h3>
              <div className="grid grid-cols-1 gap-3">
                {skills.map((skill) => (
                  <div key={skill.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">{skill.label}</span>
                      <span className="text-amber-400 text-sm">{skill.level}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 rounded-full"
                        style={{ width: skill.level }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── STATS SECTION ── */}
      <div className="border-t border-white/10 py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '10+', label: 'Projects Built' },
            { number: '5+', label: 'Technologies' },
            { number: '1', label: 'ML Model Deployed' },
            { number: '100%', label: 'Passion' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-amber-400 text-4xl font-bold mb-2">{stat.number}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HomePage;