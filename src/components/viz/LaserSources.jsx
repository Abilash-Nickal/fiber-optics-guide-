import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2'; // assume Chart.js React wrapper is available

/* Shared UI components (local copy) */
const Card = ({ children, className = '' }) => (
  <div className={`glass-card rounded-[2rem] hover:bg-white/60 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'navy' }) => {
  const styles = {
    navy: 'bg-navy/10 text-navy border-navy/20',
    indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    red: 'bg-red-500/10 text-red-600 border-red-500/20',
    gold: 'bg-gold/10 text-navy border-gold/40',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${styles[variant]}`}>
      {children}
    </span>
  );
};

/* =========================================
   4. LASER SOURCES – DEEP EXPLANATION & SIMULATOR
   ========================================= */

const LaserSourcesMasterclass = () => {
  // Simulation state
  const canvasRef = useRef(null);
  const [pump, setPump] = useState(0); // 0‑100 %
  const [design, setDesign] = useState('FP'); // 'FP' or 'DFB'
  const [spectrum, setSpectrum] = useState({}); // wavelength bucket counts

  // Constants
  const cavity = { width: 500, height: 200, mirrorX: 20 };
  const atomCount = 80;
  const atomRadius = 4;
  const photonSpeed = 2;
  const wavelengthBuckets = Array.from({ length: 30 }, (_, i) => 1500 + i * 0.5); // 1500‑1515nm

  // Initialise atoms once
  const [atoms, setAtoms] = useState(() => {
    const arr = [];
    for (let i = 0; i < atomCount; i++) {
      arr.push({
        x: cavity.mirrorX + Math.random() * (cavity.width - 2 * cavity.mirrorX),
        y: Math.random() * cavity.height,
        state: 'ground', // or 'excited'
        timer: 0,
      });
    }
    return arr;
  });

  // Helper: pick a random wavelength bucket index
  const randomBucket = () => Math.floor(Math.random() * wavelengthBuckets.length);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let photons = [];
    let animationId;

    const draw = () => {
      // Clear background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw cavity walls (mirrors)
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cavity.mirrorX, 0);
      ctx.lineTo(cavity.mirrorX, cavity.height);
      ctx.moveTo(cavity.width - cavity.mirrorX, 0);
      ctx.lineTo(cavity.width - cavity.mirrorX, cavity.height);
      ctx.stroke();

      // Draw atoms (ground = gray, excited = amber)
      atoms.forEach(atom => {
        ctx.fillStyle = atom.state === 'excited' ? '#fbbf24' : '#64748b';
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, atomRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update photons
      photons = photons.filter(p => {
        p.x += p.dx;
        p.y += p.dy;
        // Draw photon trail
        ctx.fillStyle = '#22d3ee';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Stimulated emission – clone when hitting an excited atom
        for (let atom of atoms) {
          if (atom.state === 'excited') {
            const dx = p.x - atom.x;
            const dy = p.y - atom.y;
            if (dx * dx + dy * dy < (atomRadius + 2) ** 2) {
              photons.push({ x: atom.x, y: atom.y, dx: p.dx, dy: p.dy, bucket: p.bucket });
              atom.state = 'ground';
              break;
            }
          }
        }

        // Mirror handling (Fabry‑Perot)
        if (design === 'FP') {
          if (p.x <= cavity.mirrorX) p.dx = Math.abs(p.dx);
          if (p.x >= cavity.width - cavity.mirrorX) {
            if (Math.random() < 0.05) {
              // Photon exits – record its wavelength bucket
              setSpectrum(prev => {
                const newSpec = { ...prev };
                newSpec[p.bucket] = (newSpec[p.bucket] || 0) + 1;
                return newSpec;
              });
              return false; // remove photon from simulation
            } else {
              p.dx = -Math.abs(p.dx); // reflect
            }
          }
        } else {
          // DFB – only perfectly horizontal photons survive
          if (Math.abs(p.dy) > 0.1) return false; // absorbed by grating
        }

        // Keep photon inside vertical bounds (reflect off top/bottom)
        if (p.y <= 0 || p.y >= cavity.height) p.dy = -p.dy;
        return true;
      });

      // Spontaneous emission from excited atoms (decay after a timer)
      atoms.forEach(atom => {
        if (atom.state === 'ground' && Math.random() < pump / 5000) {
          atom.state = 'excited';
          atom.timer = 0;
        }
        if (atom.state === 'excited') {
          atom.timer += 1;
          if (atom.timer > 120) {
            atom.state = 'ground';
            const angle = Math.random() * Math.PI * 2;
            photons.push({
              x: atom.x,
              y: atom.y,
              dx: Math.cos(angle) * photonSpeed,
              dy: Math.sin(angle) * photonSpeed,
              bucket: randomBucket(),
            });
          }
        }
      });

      // Draw DFB grating (if selected)
      if (design === 'DFB') {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const period = 30;
        for (let x = cavity.mirrorX; x <= cavity.width - cavity.mirrorX; x += period) {
          const y = cavity.height / 2 + Math.sin((x / period) * Math.PI) * 20;
          ctx.moveTo(x, y - 5);
          ctx.lineTo(x, y + 5);
        }
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [pump, design, atoms]);

  // Prepare data for Chart.js (output spectrum)
  const chartData = {
    labels: wavelengthBuckets.map(w => w.toFixed(1) + 'nm'),
    datasets: [
      {
        label: 'Output Spectrum',
        data: wavelengthBuckets.map((_, i) => spectrum[i] || 0),
        backgroundColor: design === 'DFB' ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.6)',
        borderColor: design === 'DFB' ? '#10b981' : '#ef4444',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Intensity' } },
      x: { title: { display: true, text: 'Wavelength (nm)' } },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <Card className="p-10 bg-white shadow-2xl border-slate-100">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Explanatory Text */}
        <div className="lg:w-1/3 space-y-8">
          <header>
            <Badge variant="indigo">Laser Sources</Badge>
          </header>
          <div className="space-y-6 text-sm text-slate-600">
            <p><strong>Start From the Very Beginning</strong>: To send the internet across an optical fiber, we need a light source that is perfectly organized – every photon the same colour and direction. A normal flashlight or LED emits a chaotic mix of colours and phases, which would blur and die inside the fiber.</p>
            <p><strong>Spontaneous vs. Stimulated Emission</strong>: In a semiconductor, injecting current excites electrons. Spontaneous emission (LED) releases a random photon in a random direction. Stimulated emission (laser) occurs when an existing photon forces an excited electron to drop, emitting an identical photon – same colour, phase, direction. This cloning cascade creates a coherent beam.</p>
            <p><strong>The Optical Cavity (Mirrors)</strong>: By cleaving the semiconductor ends flat, the glass‑to‑air interface acts as a mirror, forming a Fabry‑Perot resonator. Light bounces back and forth, repeatedly stimulating emission and amplifying the beam. One mirror is slightly transparent, allowing the amplified beam to exit.</p>
            <p><strong>Fabry‑Perot (FP) Laser</strong>: Two flat mirrors create a simple, cheap laser. Because the cavity is relatively wide, several closely spaced wavelengths (e.g., 1549 nm, 1550 nm, 1551 nm) can resonate, producing a spectral width that leads to chromatic dispersion over long distances.</p>
            <p><strong>Distributed Feedback (DFB) Laser</strong>: A microscopic corrugated grating etched into the semiconductor replaces the end mirrors. The grating reflects light continuously along the chip, but only for one exact wavelength. All other colours are destroyed by destructive interference, yielding an ultra‑pure single‑colour beam essential for WDM and submarine links.</p>
            <p><strong>Analogy – Stadium Wave vs. Marching Band</strong>: An LED is like a crowd randomly standing up (white noise). A laser is a marching band in a hallway – one note triggers the next, the sound bounces, and the band amplifies a single, perfectly synchronized note.</p>
          </div>
        </div>
        {/* Controls */}
        <div className="lg:w-1/3 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pump Current ({pump} %)</label>
            <input type="range" min="0" max="100" value={pump} onChange={e => setPump(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-indigo-600" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Laser Design</label>
            <div className="flex gap-2">
              {['FP', 'DFB'].map(d => (
                <button key={d} onClick={() => setDesign(d)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${design === d ? 'bg-navy text-white' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>{d === 'FP' ? 'Fabry‑Perot' : 'DFB'}</button>
              ))}
            </div>
          </div>
        </div>
        {/* Visualisation */}
        <div className="flex-1 bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-200 overflow-hidden relative min-h-[400px]">
          <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
        </div>
        {/* Spectrum Chart */}
        <div className="lg:w-1/3 h-[400px]">
          <div className="h-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LaserSourcesMasterclass;
