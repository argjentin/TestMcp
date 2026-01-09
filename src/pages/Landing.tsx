import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { Shield, Lock, Activity, Cpu, Terminal as TerminalIcon, Globe, Wifi } from 'lucide-react';

/**
 * ANIMATED BACKGROUND COMPONENTS (THREE.JS)
 */
const CryptographicNodes = () => {
  const ref = useRef<THREE.Points>(null!);
  const [sphere] = useState(() => {
    const positions = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  });

  useFrame((_, delta) => {
    ref.current.rotation.x -= delta / 15;
    ref.current.rotation.y -= delta / 20;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00ff88"
          size={0.035}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

const DataLines = () => {
  const count = 40;
  const lines = useMemo(() => {
    return Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ),
      speed: Math.random() * 0.02 + 0.01,
      length: Math.random() * 4 + 2,
    }));
  }, []);

  return (
    <group>
      {lines.map((line, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh position={line.pos}>
            <boxGeometry args={[0.01, line.length, 0.01]} />
            <meshBasicMaterial color="#0affef" transparent opacity={0.2} />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

/**
 * UI SUB-COMPONENTS
 */
const DecryptText = ({ text, className }: { text: string; className?: string }) => {
  const [display, setDisplay] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((_, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{display}</span>;
};

interface StatusBadgeProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 px-4 py-2 border border-[var(--border-accent)] bg-[var(--bg-surface)]/40 backdrop-blur-md rounded-sm">
    <Icon size={14} className="text-[var(--accent-primary)] animate-pulse" />
    <div className="flex flex-col">
      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">{label}</span>
      <span className="text-xs font-mono text-[var(--accent-secondary)] font-bold">{value}</span>
    </div>
  </div>
);

/**
 * MAIN LANDING PAGE
 */
const Landing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [timestamp, setTimestamp] = useState(new Date().toISOString());

  useEffect(() => {
    const timer = setInterval(() => setTimestamp(new Date().toISOString()), 1000);

    // Entrance Animation
    const ctx = gsap.context(() => {
      gsap.from('.reveal-up', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
      });

      gsap.from('.scanline-overlay', {
        opacity: 0,
        duration: 2,
        ease: 'none',
      });
    }, containerRef);

    return () => {
      clearInterval(timer);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-[var(--bg-void)] overflow-hidden flex flex-col font-sans selection:bg-[var(--accent-primary)]/30 selection:text-[var(--accent-primary)]"
    >
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <color attach="background" args={['#000000']} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <CryptographicNodes />
          <DataLines />
        </Canvas>
      </div>

      {/* Visual Overlays */}
      <div className="fixed inset-0 pointer-events-none z-10 scanlines opacity-20" />
      <div className="fixed inset-0 pointer-events-none z-10 grid-pattern opacity-10" />
      <div className="fixed inset-0 pointer-events-none z-10 noise-overlay opacity-[0.03]" />

      {/* Header / Top Navigation */}
      <header className="relative z-20 w-full p-6 flex justify-between items-center border-b border-[var(--border-subtle)] bg-[var(--bg-abyss)]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center border border-[var(--accent-primary)] glow-box">
            <Shield size={18} className="text-[var(--accent-primary)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono text-[var(--text-primary)] font-bold tracking-[0.2em]">SYNDICATE_OS</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse shadow-[0_0_8px_var(--accent-primary)]" />
              <span className="text-[10px] font-mono text-[var(--accent-primary)]">ENCRYPTED_CONNECTION_ESTABLISHED</span>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {['PROTOCOL', 'NODES', 'SECURITY', 'LOGS'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors tracking-widest px-2 py-1"
            >
              [ {item} ]
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-[var(--text-muted)]">UPTIME</span>
            <span className="text-[10px] font-mono text-[var(--text-primary)]">99.9997%</span>
          </div>
          <div className="w-10 h-10 border border-[var(--border-default)] rounded-full flex items-center justify-center bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] cursor-pointer transition-all">
            <Activity size={16} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main ref={contentRef} className="relative z-20 flex-grow flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-primary-glow)]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="reveal-up mb-4 px-3 py-1 border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 inline-flex items-center gap-2 rounded-full backdrop-blur-sm">
          <Lock size={12} className="text-[var(--accent-primary)]" />
          <span className="text-[10px] font-mono text-[var(--accent-primary)] tracking-[0.3em] uppercase">Security Level: Omega</span>
        </div>

        <h1 className="reveal-up text-5xl md:text-8xl font-mono font-black text-[var(--text-primary)] tracking-tighter mb-6 relative">
          <DecryptText text="OBSIDIAN" className="block text-white" />
          <DecryptText text="SYNDICATE" className="block text-[var(--accent-primary)] glow-text mt-[-0.2em]" />
        </h1>

        <p className="reveal-up max-w-xl text-[var(--text-secondary)] text-sm md:text-base mb-12 font-sans leading-relaxed tracking-wide">
          Private node access restricted. The shadow network is a decentralized sovereign collective.
          Your presence here has been logged. Access requires a valid cryptographic handshake.
        </p>

        <div className="reveal-up flex flex-col md:flex-row items-center gap-6">
          <button
            className="group relative px-10 py-4 bg-transparent border border-[var(--accent-primary)] overflow-hidden transition-all hover:bg-[var(--accent-primary)]/10"
            onClick={() => window.location.href = '/acces'}
          >
            <div className="absolute inset-0 w-1 bg-[var(--accent-primary)] transition-all group-hover:w-full -z-10" />
            <div className="flex items-center gap-3">
              <TerminalIcon size={18} className="text-[var(--accent-primary)] group-hover:text-[var(--bg-void)] transition-colors" />
              <span className="font-mono text-sm font-bold tracking-[0.3em] text-[var(--accent-primary)] group-hover:text-[var(--bg-void)] transition-colors uppercase">
                Request Access
              </span>
            </div>
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[var(--accent-primary)]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[var(--accent-primary)]" />
          </button>

          <button className="px-8 py-4 text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] tracking-[0.2em] uppercase transition-colors">
            View Protocol Documentation
          </button>
        </div>

        {/* Stats Grid */}
        <div className="reveal-up grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 w-full max-w-4xl">
          <StatusBadge label="Network" value="ACTIVE / ENCRYPTED" icon={Globe} />
          <StatusBadge label="Global Nodes" value="2,847 VERIFIED" icon={Cpu} />
          <StatusBadge label="Protocol" value="AES-256-GCM" icon={Shield} />
          <StatusBadge label="Signal" value="STABLE / -42dBm" icon={Wifi} />
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="relative z-20 w-full p-6 flex flex-col md:flex-row justify-between items-center border-t border-[var(--border-subtle)] bg-[var(--bg-abyss)]/80 backdrop-blur-md gap-4">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[var(--text-muted)]">LOCATION_ID</span>
            <span className="text-[10px] font-mono text-[var(--text-primary)] tracking-widest">37.7749° N, 122.4194° W</span>
          </div>
          <div className="h-8 w-px bg-[var(--border-subtle)]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[var(--text-muted)]">LOCAL_TIMESTAMP</span>
            <span className="text-[10px] font-mono text-[var(--text-primary)] tracking-widest">{timestamp}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-default)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] cursor-blink shadow-[0_0_5px_var(--accent-primary)]" />
            <span className="text-[10px] font-mono text-[var(--text-secondary)] tracking-widest uppercase">Live Connection</span>
          </div>
          <p className="text-[10px] font-mono text-[var(--text-ghost)]">
            © 2024 OBSIDIAN SYNDICATE. ALL DATA FRAGMENTED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
