import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import {
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Terminal,
  Cpu,
  AlertTriangle,
  Fingerprint,
  Database,
  Globe,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const Access: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState({ id: '', key: '', seed: '' });

  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<SVGSVGElement>(null);
  const dataStreamRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    // Entrance Animation
    const ctx = gsap.context(() => {
      gsap.from('.auth-card', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.2
      });

      gsap.from('.terminal-line', {
        opacity: 0,
        x: -10,
        duration: 0.5,
        stagger: 0.05,
        delay: 0.5
      });

      // Continuous scanner animation
      gsap.to(scanLineRef.current, {
        y: 120,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      // Data Stream background animation
      const dataNodes = dataStreamRef.current?.querySelectorAll('.data-packet');
      if (dataNodes) {
        dataNodes.forEach((node) => {
          gsap.to(node, {
            y: '100vh',
            duration: gsap.utils.random(10, 25),
            repeat: -1,
            ease: 'none',
            delay: gsap.utils.random(0, 10),
            opacity: gsap.utils.random(0.1, 0.4)
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(null);

    // Simulate authentication delay - redirect to dashboard on success
    setTimeout(() => {
      setIsAuthenticating(false);
      // For demo, redirect to dashboard
      window.location.href = '/dashboard';
    }, 2400);
  };

  const generateDataPackets = () => {
    return Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="data-packet absolute font-mono text-[10px] text-[var(--accent-primary)] opacity-0 whitespace-nowrap pointer-events-none"
        style={{ left: `${Math.random() * 100}%`, top: '-50px' }}
      >
        {Math.random().toString(16).substring(2, 15).toUpperCase()}
        <br />
        {Math.random().toString(16).substring(2, 10).toUpperCase()}
      </div>
    ));
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[var(--bg-void)] flex items-center justify-center p-4 overflow-hidden font-sans text-[var(--text-primary)]">
      {/* Background Layers */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 noise-overlay opacity-10 pointer-events-none" />
      <div ref={dataStreamRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {generateDataPackets()}
      </div>
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: System Status */}
        <div className="lg:col-span-4 space-y-6 hidden lg:block">
          {/* Node Info */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-5 rounded-sm glow-box">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="font-mono text-xs tracking-widest text-[var(--text-secondary)] uppercase">Node Status</span>
            </div>
            <div className="space-y-3 font-mono text-[11px]">
              <div className="flex justify-between border-b border-[var(--border-subtle)] pb-1">
                <span className="text-[var(--text-muted)]">LOCATION:</span>
                <span className="text-[var(--accent-secondary)]">UNKNOWN // PROXY-4</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-subtle)] pb-1">
                <span className="text-[var(--text-muted)]">PROTOCOL:</span>
                <span className="text-[var(--accent-primary)]">TLS 1.3 / CHACHA20</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-subtle)] pb-1">
                <span className="text-[var(--text-muted)]">UPTIME:</span>
                <span className="text-[var(--text-primary)]">482:12:09:44</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">STRENGTH:</span>
                <span className="text-[var(--accent-primary)] animate-pulse-glow">QUANTUM-SAFE</span>
              </div>
            </div>
          </div>

          {/* Biometric Scan */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-sm flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 mb-4 bg-[var(--bg-abyss)] border border-[var(--accent-muted)] flex items-center justify-center overflow-hidden">
              <svg ref={scannerRef} width="80" height="100" viewBox="0 0 80 100" className="text-[var(--accent-primary)] opacity-60">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="M10,30 Q20,10 40,10 T70,30 M10,50 Q20,30 40,30 T70,50 M10,70 Q20,50 40,50 T70,70 M10,90 Q20,70 40,70 T70,90"
                />
                <rect
                  ref={scanLineRef}
                  x="0" y="0" width="80" height="2"
                  fill="var(--accent-primary)"
                  className="shadow-[0_0_15px_var(--accent-primary)]"
                />
              </svg>
              <Fingerprint className="w-16 h-16 absolute text-[var(--accent-primary)] opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent-primary)]/5 to-transparent pointer-events-none" />
            </div>
            <span className="font-mono text-[10px] text-[var(--accent-primary-dim)] tracking-tighter animate-pulse">
              WAITING FOR BIOMETRIC CONFIRMATION...
            </span>
          </div>

          {/* Warning Card */}
          <div className="bg-[var(--bg-abyss)] border border-[var(--accent-danger)]/20 p-4 rounded-sm">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[var(--accent-danger)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-[11px] text-[var(--accent-danger)] leading-relaxed">
                  UNAUTHORIZED ACCESS IS A VIOLATION OF SYNDICATE BYLAWS. ALL PACKETS ARE TRACED AND LOGGED TO YOUR PHYSICAL COORDINATES.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Column: Authentication Form */}
        <div className="lg:col-span-8">
          <div className="auth-card bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-sm shadow-2xl overflow-hidden">
            {/* Header Terminal Bar */}
            <div className="bg-[var(--bg-elevated)] border-b border-[var(--border-default)] p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-danger)]/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-warning)]/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)]/40" />
                </div>
                <div className="h-4 w-[1px] bg-[var(--border-default)] mx-1" />
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
                    obsidian-core-auth // node_77
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 font-mono text-[10px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span className="hidden sm:inline">82.19.0.1</span>
                </span>
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span className="hidden sm:inline">DB_SECURE</span>
                </span>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-8 md:p-12 relative">
              <div className="mb-10 text-center lg:text-left">
                <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tighter text-[var(--text-primary)] mb-2 glow-text">
                  IDENTITY VERIFICATION
                </h1>
                <p className="text-[var(--text-secondary)] font-mono text-sm max-w-xl">
                  Establish a secure tunnel to the Syndicate Obsidian mesh.
                  Provide valid credentials and encryption seeds to proceed.
                </p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-[var(--accent-danger)]/10 border border-[var(--accent-danger)]/30 flex items-center gap-4 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-[var(--accent-danger)] flex-shrink-0" />
                  <span className="font-mono text-xs text-[var(--accent-danger)] uppercase tracking-tight">
                    {error}
                  </span>
                </div>
              )}

              <form onSubmit={handleAuthenticate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Syndicate ID */}
                  <div className="space-y-2 group">
                    <label className="flex items-center gap-2 text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest group-focus-within:text-[var(--accent-primary)] transition-colors">
                      <User className="w-3 h-3" />
                      Syndicate ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="U-####-#####"
                        value={formState.id}
                        onChange={(e) => setFormState({...formState, id: e.target.value})}
                        className="w-full bg-[var(--bg-abyss)] border border-[var(--border-default)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]/20 outline-none px-4 py-3 font-mono text-sm text-[var(--accent-primary)] placeholder:text-[var(--text-ghost)] transition-all"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100">
                        <span className="text-[10px] font-mono text-[var(--accent-primary)]/40 cursor-blink">_</span>
                      </div>
                    </div>
                  </div>

                  {/* Access Key */}
                  <div className="space-y-2 group">
                    <label className="flex items-center gap-2 text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest group-focus-within:text-[var(--accent-primary)] transition-colors">
                      <Lock className="w-3 h-3" />
                      Access Key
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={formState.key}
                        onChange={(e) => setFormState({...formState, key: e.target.value})}
                        className="w-full bg-[var(--bg-abyss)] border border-[var(--border-default)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]/20 outline-none px-4 py-3 font-mono text-sm text-[var(--accent-primary)] placeholder:text-[var(--text-ghost)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Encryption Seed */}
                <div className="space-y-2 group">
                  <label className="flex items-center gap-2 text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest group-focus-within:text-[var(--accent-primary)] transition-colors">
                    <Cpu className="w-3 h-3" />
                    Encryption Seed (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="HEX-0x00... (Leave blank for auto-negotiation)"
                      value={formState.seed}
                      onChange={(e) => setFormState({...formState, seed: e.target.value})}
                      className="w-full bg-[var(--bg-abyss)] border border-[var(--border-default)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]/20 outline-none px-4 py-3 font-mono text-sm text-[var(--accent-primary)] placeholder:text-[var(--text-ghost)] transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                  <button
                    disabled={isAuthenticating}
                    type="submit"
                    className="relative w-full sm:w-auto min-w-[200px] py-4 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)] text-[var(--accent-primary)] font-mono font-bold uppercase tracking-widest hover:bg-[var(--accent-primary)] hover:text-[var(--bg-void)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {isAuthenticating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[var(--bg-void)]/30 border-t-[var(--bg-void)] rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Authenticate</span>
                        </>
                      )}
                    </div>
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-[var(--accent-primary)] opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
                  </button>

                  <Link to="/" className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] uppercase tracking-tighter flex items-center gap-2 transition-colors group">
                    <ChevronRight className="w-3 h-3 text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform" />
                    Return to landing interface
                  </Link>
                </div>
              </form>

              {/* Terminal Logs (Simulated) */}
              <div className="mt-12 bg-[var(--bg-abyss)]/50 border border-[var(--border-subtle)] rounded p-4 font-mono text-[10px] text-[var(--text-muted)] leading-relaxed max-h-32 overflow-hidden select-none">
                <div className="terminal-line">[ 0.000000 ] Booting authentication kernel v4.2.0-syndicate...</div>
                <div className="terminal-line">[ 0.041283 ] Initializing encrypted sandbox environment...</div>
                <div className="terminal-line text-[var(--accent-primary-dim)]">[ 0.124551 ] Handshaking with obsidian-mesh-node-alpha...</div>
                <div className="terminal-line">[ 0.182239 ] Loading RSA-4096 / AES-GCM-256 modules...</div>
                <div className="terminal-line text-[var(--accent-secondary)]">[ 0.291002 ] Connection established via Secure Tunnel [402.112.5.1]</div>
                <div className="terminal-line">[ 0.355112 ] Ready for user input. Awaiting ID_TOKEN.</div>
                <div className="terminal-line cursor-blink">_</div>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="bg-[var(--bg-elevated)] border-t border-[var(--border-default)] px-6 py-3 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)] animate-pulse" />
                  <span className="text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-widest">System Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] shadow-[0_0_8px_var(--accent-secondary)]" />
                  <span className="text-[10px] font-mono text-[var(--accent-secondary)] uppercase tracking-widest">TLS 1.3 Active</span>
                </div>
              </div>
              <div className="text-[10px] font-mono text-[var(--text-ghost)] uppercase tracking-widest">
                SESSION ID: {Math.random().toString(36).substring(7).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        <div className="px-6 py-2 border-x border-[var(--border-subtle)] bg-[var(--bg-void)]/80 backdrop-blur-sm">
          <p className="font-mono text-[10px] text-[var(--text-ghost)] tracking-[0.3em] uppercase">
            © 2024 Obsidian Syndicate // Cryptographic Intelligence Division
          </p>
        </div>
      </div>
    </div>
  );
};

// Activity icon import was missing in Gemini's output
import { Activity } from 'lucide-react';

export default Access;
