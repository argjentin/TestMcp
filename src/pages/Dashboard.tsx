import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import {
  Shield,
  Activity,
  Database,
  Lock,
  MessageSquare,
  Power,
  Radio,
  Terminal,
  Globe,
  TrendingUp,
  Settings,
  Briefcase,
  Share2
} from 'lucide-react';

// --- THREE.js Components ---

const NetworkGlobe: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null!);

  const particleCount = 1500;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      const distance = 2.5;

      pos[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = distance * Math.cos(theta);
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.002;
      pointsRef.current.rotation.x += 0.001;
    }
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#00ff88"
          size={0.035}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <mesh>
        <sphereGeometry args={[2.48, 32, 32]} />
        <meshBasicMaterial color="#00ff88" wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
};

// --- UI Sub-Components ---

interface CardProps {
  children: React.ReactNode;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  className?: string;
  badge?: string;
}

const Card: React.FC<CardProps> = ({ children, title, icon: Icon, className = "", badge = "" }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative group bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[var(--accent-primary)] transition-all duration-300 rounded-sm overflow-hidden flex flex-col ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary-glow)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]/50">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-sm">
            <Icon size={16} className="text-[var(--accent-primary)]" />
          </div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-primary)]">{title}</h3>
        </div>
        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 rounded-full animate-pulse">
            {badge}
          </span>
        )}
      </div>
      <div className="flex-1 p-4 relative z-10">
        {children}
      </div>
      <div className="h-0.5 w-full bg-[var(--border-subtle)] overflow-hidden">
        <div className="h-full bg-[var(--accent-primary)] w-1/3 group-hover:w-full transition-all duration-1000 ease-in-out" />
      </div>
    </div>
  );
};

interface MetricRowProps {
  label: string;
  value: string;
  trend?: number;
  color?: string;
}

const MetricRow: React.FC<MetricRowProps> = ({ label, value, trend, color = "text-[var(--accent-primary)]" }) => (
  <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)]/50 last:border-0">
    <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-tighter">{label}</span>
    <div className="flex items-center gap-3">
      {trend !== undefined && <span className={`text-[10px] ${trend > 0 ? 'text-[var(--accent-primary)]' : 'text-[var(--accent-danger)]'}`}>{trend > 0 ? '+' : ''}{trend}%</span>}
      <span className={`font-mono text-xs font-bold ${color}`}>{value}</span>
    </div>
  </div>
);

interface TerminalLogProps {
  text: string;
  time: string;
}

const TerminalLog: React.FC<TerminalLogProps> = ({ text, time }) => (
  <div className="flex gap-3 py-1 font-mono text-[10px] group/line cursor-default">
    <span className="text-[var(--text-ghost)]">[{time}]</span>
    <span className="text-[var(--text-muted)] group-hover/line:text-[var(--accent-secondary)] transition-colors truncate">
      <span className="text-[var(--accent-primary)] mr-1">SYS:</span> {text}
    </span>
  </div>
);

// --- Main Dashboard Component ---

const Dashboard: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [latency, setLatency] = useState(24);
  const [isSidebarOpen] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      setLatency(prev => Math.max(18, Math.min(42, prev + (Math.random() * 4 - 2))));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-void)] text-[var(--text-primary)] font-sans flex flex-col selection:bg-[var(--accent-primary)] selection:text-[var(--bg-void)] relative overflow-hidden">
      {/* Visual Overlays */}
      <div className="fixed inset-0 pointer-events-none noise-overlay opacity-[0.03] z-50" />
      <div className="fixed inset-0 pointer-events-none scanlines opacity-[0.05] z-50" />
      <div className="fixed inset-0 pointer-events-none grid-pattern opacity-[0.1] z-0" />

      {/* --- Top Navigation --- */}
      <nav className="h-14 border-b border-[var(--border-default)] bg-[var(--bg-abyss)]/80 backdrop-blur-md flex items-center justify-between px-6 z-40 sticky top-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--accent-primary)] flex items-center justify-center rounded-sm rotate-45 group cursor-pointer hover:rotate-180 transition-transform duration-700">
              <Shield className="-rotate-45 group-hover:rotate-180 transition-transform duration-700 text-[var(--bg-void)]" size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-mono text-sm font-bold tracking-[0.2em] text-[var(--text-primary)]">OBSIDIAN <span className="text-[var(--accent-primary)]">SYNDICATE</span></h1>
              <div className="text-[9px] font-mono text-[var(--text-muted)] tracking-widest uppercase">Central Intelligence Protocol v8.4.1</div>
            </div>
          </div>

          <div className="hidden lg:flex items-center bg-[var(--bg-surface)] border border-[var(--border-default)] px-3 py-1.5 rounded-sm gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse shadow-[0_0_8px_var(--accent-primary)]" />
                <span className="font-mono text-[10px] text-[var(--accent-primary)] uppercase tracking-tighter">Encrypted Connection Stable</span>
             </div>
             <div className="w-[1px] h-3 bg-[var(--border-default)]" />
             <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Ping: {latency.toFixed(0)}ms</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase leading-none">Accessing Node</span>
            <span className="font-mono text-xs text-[var(--text-primary)] font-bold">OPERATIVE: <span className="text-[var(--accent-secondary)]">SHADOW-7X</span></span>
          </div>
          <button
            className="p-2 hover:bg-[var(--accent-danger)]/10 hover:text-[var(--accent-danger)] border border-transparent hover:border-[var(--accent-danger)]/20 transition-all rounded-sm text-[var(--text-muted)]"
            onClick={() => window.location.href = '/'}
          >
            <Power size={18} />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 relative">
        {/* --- Sidebar Navigation --- */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} border-r border-[var(--border-default)] bg-[var(--bg-abyss)]/50 backdrop-blur-sm transition-all duration-300 hidden md:flex flex-col z-30`}>
          <div className="flex-1 py-8 px-4 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: Activity, active: true },
              { id: 'ops', label: 'Operations', icon: Briefcase },
              { id: 'network', label: 'Network', icon: Share2 },
              { id: 'comm', label: 'Comms', icon: MessageSquare, badge: '4' },
              { id: 'vault', label: 'Asset Vault', icon: Database },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm transition-all group relative ${item.active ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] border border-transparent'}`}
              >
                <item.icon size={18} strokeWidth={item.active ? 2.5 : 2} />
                {isSidebarOpen && <span className="font-mono text-xs uppercase tracking-widest">{item.label}</span>}
                {item.badge && isSidebarOpen && (
                  <span className="ml-auto bg-[var(--accent-primary)] text-[var(--bg-void)] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {item.active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-[var(--accent-primary)] shadow-[0_0_12px_var(--accent-primary)]" />
                )}
              </button>
            ))}
          </div>

          <div className="p-6 border-t border-[var(--border-default)]">
            <div className="bg-[var(--bg-elevated)] p-3 rounded-sm border border-[var(--border-default)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-[var(--text-muted)]">SYNC STATUS</span>
                <span className="text-[10px] font-mono text-[var(--accent-primary)]">98%</span>
              </div>
              <div className="h-1 bg-[var(--bg-void)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent-primary)] w-[98%]" />
              </div>
            </div>
          </div>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 overflow-y-auto bg-[var(--bg-void)] p-6 lg:p-10 relative">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Dashboard Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[var(--border-default)] pb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-0.5 w-8 bg-[var(--accent-primary)]" />
                  <span className="font-mono text-[10px] text-[var(--accent-primary)] tracking-[0.3em] uppercase">Control Dashboard</span>
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">COMMAND <span className="font-mono font-light text-[var(--text-muted)]">CENTER</span></h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4 bg-[var(--bg-card)] border border-[var(--border-default)] px-4 py-2 rounded-sm">
                  <div className="text-right">
                    <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Global Access Level</p>
                    <p className="text-sm font-mono font-bold text-[var(--accent-warning)]">OVERRIDE ENABLED</p>
                  </div>
                  <div className="p-2 bg-[var(--accent-warning)]/10 text-[var(--accent-warning)] border border-[var(--accent-warning)]/20 rounded-sm">
                    <Lock size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">

              {/* Network Status Card (3D Visualization) */}
              <Card title="Global Network Map" icon={Globe} className="lg:col-span-8 min-h-[400px]">
                <div className="absolute inset-0 z-0">
                   <Canvas>
                      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} intensity={1} />
                      <NetworkGlobe />
                   </Canvas>
                </div>
                <div className="relative z-10 pointer-events-none h-full flex flex-col justify-between">
                   <div className="grid grid-cols-3 gap-4">
                      <div className="bg-[var(--bg-void)]/60 backdrop-blur-md p-3 border border-[var(--border-subtle)] rounded-sm">
                         <p className="text-[10px] font-mono text-[var(--text-muted)] mb-1">NODES ONLINE</p>
                         <p className="text-xl font-mono text-[var(--accent-primary)]">1,402</p>
                      </div>
                      <div className="bg-[var(--bg-void)]/60 backdrop-blur-md p-3 border border-[var(--border-subtle)] rounded-sm">
                         <p className="text-[10px] font-mono text-[var(--text-muted)] mb-1">TRAFFIC LOAD</p>
                         <p className="text-xl font-mono text-[var(--accent-secondary)]">42.8 GB/s</p>
                      </div>
                      <div className="bg-[var(--bg-void)]/60 backdrop-blur-md p-3 border border-[var(--border-subtle)] rounded-sm">
                         <p className="text-[10px] font-mono text-[var(--text-muted)] mb-1">UPTIME</p>
                         <p className="text-xl font-mono text-[var(--text-primary)]">99.99%</p>
                      </div>
                   </div>

                   <div className="flex flex-col gap-2 max-w-xs self-end">
                      <div className="bg-[var(--bg-void)]/80 backdrop-blur-sm p-3 border border-[var(--border-subtle)] border-l-2 border-l-[var(--accent-primary)]">
                         <p className="font-mono text-[10px] text-[var(--accent-primary)] mb-1 tracking-tighter">ANOMALY DETECTED: SECTOR-12</p>
                         <p className="text-[9px] text-[var(--text-muted)] leading-tight">Unauthorized intrusion attempt blocked at 02:14 UTC. Tracing origin...</p>
                      </div>
                   </div>
                </div>
              </Card>

              {/* Threat Level */}
              <Card title="Security Profile" icon={Shield} className="lg:col-span-4">
                 <div className="flex flex-col items-center justify-center h-full py-4">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                       <svg className="w-full h-full -rotate-90">
                          <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="8" className="text-[var(--bg-elevated)]" />
                          <circle
                            cx="80" cy="80" r="70"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeDasharray="440"
                            strokeDashoffset="110"
                            className="text-[var(--accent-primary)] drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]"
                          />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Threat Level</span>
                          <span className="text-3xl font-mono font-bold text-[var(--text-primary)]">MODERATE</span>
                          <span className="text-[9px] font-mono text-[var(--accent-primary)]">LEVEL 3 / 5</span>
                       </div>
                    </div>
                    <div className="w-full mt-8 space-y-3">
                       <MetricRow label="Firewall Integrity" value="OPTIMAL" />
                       <MetricRow label="IDS Monitoring" value="ACTIVE" />
                       <MetricRow label="Encryption Layer" value="AES-4096" />
                       <MetricRow label="Backdoor Traces" value="NONE" color="text-[var(--accent-primary)]" />
                    </div>
                 </div>
              </Card>

              {/* Recent Operations */}
              <Card title="Active Operations" icon={Terminal} className="lg:col-span-6">
                <div className="space-y-4">
                  <div className="bg-[var(--bg-void)] p-3 rounded-sm border-l-2 border-[var(--accent-primary)] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-mono font-bold text-[var(--accent-primary)]">OPERATION: SILENT_WHISPER</span>
                      <span className="text-[9px] font-mono text-[var(--text-ghost)]">IN PROGRESS</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)]">Exfiltrating encrypted data from Sector-7 financial node. Completion 64%.</p>
                    <div className="h-1 bg-[var(--bg-surface)] w-full">
                       <div className="h-full bg-[var(--accent-primary)] w-2/3 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <TerminalLog time="14:02:01" text="Divert protocols engaged in London hub." />
                    <TerminalLog time="13:58:45" text="Handshake accepted by Proxy-9." />
                    <TerminalLog time="13:45:12" text="Operation: DEEP_DIVE successfully archived." />
                    <TerminalLog time="13:30:00" text="System heartbeat: Synchronized." />
                    <TerminalLog time="13:12:05" text="Alert: Failed login attempt on Vault-A." />
                    <TerminalLog time="12:45:59" text="Database optimization complete." />
                  </div>
                </div>
              </Card>

              {/* Assets / Vault */}
              <Card title="Asset Vault" icon={Database} className="lg:col-span-3">
                 <div className="space-y-6">
                    <div>
                       <p className="text-[10px] font-mono text-[var(--text-muted)] mb-1 uppercase tracking-widest">Available Credits</p>
                       <div className="flex items-end gap-2">
                          <span className="text-3xl font-mono font-bold text-[var(--accent-secondary)]">14,802.45</span>
                          <span className="text-xs font-mono text-[var(--accent-secondary)] mb-1">XMR</span>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-[var(--text-muted)] uppercase">Storage Capacity</span>
                          <span className="text-[var(--text-primary)]">12.4 / 50 PB</span>
                       </div>
                       <div className="h-1.5 bg-[var(--bg-void)] rounded-full overflow-hidden flex">
                          <div className="h-full bg-[var(--accent-secondary)] w-1/4" />
                          <div className="h-full bg-[var(--accent-muted)] w-3/4" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                       <button className="bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[var(--accent-secondary)] py-2 rounded-sm transition-colors text-[10px] font-mono text-[var(--text-secondary)] uppercase">Withdraw</button>
                       <button className="bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[var(--accent-secondary)] py-2 rounded-sm transition-colors text-[10px] font-mono text-[var(--text-secondary)] uppercase">History</button>
                    </div>
                 </div>
              </Card>

              {/* Messages Preview */}
              <Card title="Comms" icon={MessageSquare} className="lg:col-span-3" badge="2 NEW">
                 <div className="space-y-4">
                    <div className="group/msg cursor-pointer">
                       <div className="flex justify-between mb-1">
                          <span className="text-[11px] font-bold text-[var(--accent-primary)]">V_ENIGMA</span>
                          <span className="text-[9px] text-[var(--text-ghost)]">08:45</span>
                       </div>
                       <p className="text-[10px] text-[var(--text-muted)] line-clamp-1 group-hover/msg:text-[var(--text-primary)] transition-colors italic">"Package delivered to the drop point. Awaiting signal..."</p>
                    </div>
                    <div className="w-full h-px bg-[var(--border-subtle)]" />
                    <div className="group/msg cursor-pointer">
                       <div className="flex justify-between mb-1">
                          <span className="text-[11px] font-bold text-[var(--accent-primary)]">GHOST_3</span>
                          <span className="text-[9px] text-[var(--text-ghost)]">04:12</span>
                       </div>
                       <p className="text-[10px] text-[var(--text-muted)] line-clamp-1 group-hover/msg:text-[var(--text-primary)] transition-colors italic">"Target identified. Moving to secondary position."</p>
                    </div>
                    <div className="w-full h-px bg-[var(--border-subtle)]" />
                    <div className="opacity-40">
                       <div className="flex justify-between mb-1">
                          <span className="text-[11px] font-bold text-[var(--text-ghost)]">X-OVERSEER</span>
                          <span className="text-[9px] text-[var(--text-ghost)]">Yesterday</span>
                       </div>
                       <p className="text-[10px] text-[var(--text-muted)] line-clamp-1">"New mandates issued for Operation Silent Whisper..."</p>
                    </div>
                 </div>
              </Card>

              {/* Statistics Sparklines */}
              <Card title="Performance Metrics" icon={TrendingUp} className="lg:col-span-12">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                      { label: "Extraction Rate", value: "98.2%", trend: +2.4 },
                      { label: "Signal Latency", value: "24ms", trend: -12.1 },
                      { label: "Encryption Depth", value: "4096-bit", trend: 0 },
                      { label: "Success Ratio", value: "94.8%", trend: +0.5 },
                    ].map((stat, i) => (
                      <div key={i} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">{stat.label}</span>
                          <span className={`text-[10px] font-mono ${stat.trend > 0 ? 'text-[var(--accent-primary)]' : stat.trend < 0 ? 'text-[var(--accent-danger)]' : 'text-[var(--text-ghost)]'}`}>
                            {stat.trend > 0 ? '↑' : stat.trend < 0 ? '↓' : '—'} {stat.trend !== 0 && Math.abs(stat.trend) + '%'}
                          </span>
                        </div>
                        <div className="text-2xl font-mono font-bold">{stat.value}</div>
                        <div className="h-8 w-full">
                           <svg viewBox="0 0 100 20" className="w-full h-full">
                              <path
                                d={`M0,${10+Math.random()*10} L20,${Math.random()*20} L40,${Math.random()*10} L60,${Math.random()*15} L80,${Math.random()*10} L100,${Math.random()*20}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-[var(--accent-primary)] opacity-50"
                              />
                           </svg>
                        </div>
                      </div>
                    ))}
                 </div>
              </Card>

            </div>
          </div>
        </main>
      </div>

      {/* --- Status Bar Footer --- */}
      <footer className="h-8 border-t border-[var(--border-default)] bg-[var(--bg-abyss)] px-4 flex items-center justify-between z-40">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
               <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Session Active: <span className="text-[var(--text-primary)]">02:45:12</span></span>
            </div>
            <div className="flex items-center gap-2">
               <Radio size={10} className="text-[var(--accent-secondary)] animate-pulse" />
               <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Proxy: <span className="text-[var(--text-primary)]">TOR-EN-RELAY-7</span></span>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Local Time:</span>
               <span className="text-[9px] font-mono text-[var(--text-primary)]">{time}</span>
            </div>
            <div className="flex items-center gap-2 border-l border-[var(--border-default)] pl-4">
               <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">System Integrity:</span>
               <span className="text-[9px] font-mono text-[var(--accent-primary)] font-bold">NOMINAL</span>
            </div>
         </div>
      </footer>

      {/* Decorative Border Glow */}
      <div className="fixed inset-0 pointer-events-none border-[1px] border-[var(--accent-primary)]/5 z-[60]" />
    </div>
  );
};

export default Dashboard;
