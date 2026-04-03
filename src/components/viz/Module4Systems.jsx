import React, { useState, useEffect, useRef } from 'react';
import {
    Waves, Filter, Share2, Zap, ChevronRight,
    ZapOff, ArrowLeft, Target, Info, Settings2, Activity, Menu, RefreshCw, Copy,
    RotateCw, Thermometer, Ruler, Search, AlertCircle, Globe, PenTool
} from 'lucide-react';
import { MathBlock, MathInline, EquationCheatSheet } from '../MathBlock';

/* =========================================
   SHARED HELPERS (Standardized Nexus UI)
   ========================================= */

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
   1. SAGNAC GYRO LAB
   ========================================= */
const SagnacLab = () => {
    const [rotation, setRotation] = useState(10);
    const [turns, setTurns] = useState(500);
    const [radius, setRadius] = useState(1);
    const canvasRef = useRef(null);

    const wavelength = 1550e-9;
    const c = 3e8;
    const Area = Math.PI * Math.pow(radius, 2);
    const phaseShift = (8 * Math.PI * turns * Area * ((rotation * Math.PI) / 180)) / (wavelength * c);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d');
        let frame = 0;
        const render = () => {
            frame++;
            const w = canvas.width; const h = canvas.height; const cx = w / 2; const cy = h / 2;
            const r = 120;
            ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);
            
            // Draw Coil Path
            ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 15; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
            
            // Light Particles (Clockwise)
            const speed = 0.05 + rotation * 0.001;
            ctx.shadowBlur = 10; ctx.shadowColor = '#0ea5e9';
            for (let i = 0; i < 5; i++) {
                const angle = (frame * speed + i * (Math.PI * 0.4)) % (Math.PI * 2);
                const px = cx + Math.cos(angle) * r; const py = cy + Math.sin(angle) * r;
                ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
            }
            
            // Counter-Clockwise
            const ccSpeed = 0.05 - rotation * 0.001;
            ctx.shadowColor = '#f43f5e';
            for (let i = 0; i < 5; i++) {
                const angle = (frame * ccSpeed + i * (Math.PI * 0.4)) % (Math.PI * 2);
                const px = cx + Math.cos(-angle) * r; const py = cy + Math.sin(-angle) * r;
                ctx.fillStyle = '#f43f5e'; ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
            }
            
            // Detector Node
            ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(cx, cy + r, 20, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.stroke();
            ctx.fillStyle = '#fff'; ctx.font = '900 8px Inter'; ctx.textAlign = 'center'; ctx.fillText('DETECTOR', cx, cy + r + 4);

            requestAnimationFrame(render);
        };
        const animId = requestAnimationFrame(render); return () => cancelAnimationFrame(animId);
    }, [rotation]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
            <header>
                <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Laboratory 04</Badge><Badge variant="navy">Section 01</Badge></div>
                <h2 className="text-6xl font-black text-navy tracking-tighter mb-8 uppercase italic leading-[0.9]">Inertial <span className="text-indigo-600 block text-8xl">Sagnac</span></h2>
                <div className="space-y-6 max-w-4xl border-l-4 border-indigo-600 pl-8">
                    <p className="text-slate-500 font-bold leading-relaxed text-xl italic">"Light that travels with the rotation takes longer to return than light that travels against it."</p>
                    <p className="text-slate-500 font-medium leading-relaxed">The Fiber Optic Gyroscope (FOG) represents the pinnacle of optical navigation. By coiling kilometers of fiber into a small volume, we amplify the relativistic <strong>Sagnac Phase Shift</strong>, allowing for the detection of Earth's rotation (15°/hour) with zero moving parts.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <Card className="p-8 border-slate-100 bg-white shadow-2xl relative overflow-hidden group">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Coil Interference Simulator</div>
                    <div className="bg-slate-900 rounded-[3rem] border-[12px] border-slate-200 overflow-hidden h-[450px]">
                        <canvas ref={canvasRef} width={600} height={450} className="w-full h-full opacity-90" />
                    </div>
                </Card>

                <div className="space-y-8">
                     <Card className="p-10 border-slate-100 flex flex-col gap-10 bg-white">
                        <h3 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-3"><Settings2 className="w-4 h-4" /> System Parameters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase">Input Angular Rate Ω</label>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between font-mono mb-4"><span className="text-[9px] font-bold">RATE</span><span className="text-indigo-600 font-black">{rotation} °/s</span></div>
                                    <input type="range" min="-360" max="360" value={rotation} onChange={e => setRotation(parseFloat(e.target.value))} className="w-full h-1.5 accent-indigo-600 rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase">Coil Winds (N)</label>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between font-mono mb-4"><span className="text-[9px] font-bold">TURNS</span><span className="text-indigo-600 font-black">{turns}</span></div>
                                    <input type="range" min="10" max="10000" step="10" value={turns} onChange={e => setTurns(parseFloat(e.target.value))} className="w-full h-1.5 accent-indigo-600 rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] space-y-4">
                            <h4 className="text-xs font-black text-navy uppercase tracking-widest italic">The Scaling Power of N</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">In a vacuum, the Sagnac shift is tiny. By increasing the number of fiber turns <MathInline math="N" />, we effectively multiply the effective area which the light encloses, enabling sub-atomic precision in movement detection.</p>
                        </div>

                        <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-6 shadow-2xl">
                            <div className="flex items-center gap-3 opacity-50"><Activity className="w-4 h-4 text-blue-400" /><span className="text-[9px] font-black uppercase tracking-widest">Sagnac Phase Result</span></div>
                            <div className="text-5xl font-black italic tracking-tighter text-blue-400">{(phaseShift * 1e6).toFixed(2)} <span className="text-sm uppercase not-italic opacity-50 ml-2">μrad</span></div>
                            <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic uppercase">"Highly accurate navigation depends on detecting these sub-micro-radian shifts at kHz rates."</p>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
                <Card className="p-10 border-slate-100 bg-white space-y-6">
                    <h4 className="text-sm font-black text-navy uppercase tracking-widest">Phase Relation</h4>
                    <MathBlock math="\Delta\phi_S = \frac{8\pi N A \Omega}{\lambda c}" label="Sagnac Shift (Radians)" />
                    <p className="text-xs text-slate-500 leading-relaxed">Where <MathInline math="A" /> is the area of the coil, <MathInline math="N" /> the turns, <MathInline math="\Omega" /> the angular velocity, and <MathInline math="\lambda" /> the wavelength.</p>
                </Card>
                <Card className="p-10 border-slate-100 bg-indigo-50/30 space-y-6">
                    <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest">Design Constraint</h4>
                    <p className="text-xs text-indigo-900 leading-relaxed font-bold italic">"Non-Reciprocity Issue: To ensure the only phase difference is from rotation, we must ensure the fiber is perfectly symmetric. Any thermal gradient across the coil (Shupe Effect) can mimic a false rotation signal."</p>
                </Card>
            </div>
        </div>
    );
};

/* =========================================
   2. FBG SANDBOX
   ========================================= */
const BraggView = () => {
    const [strain, setStrain] = useState(0);
    const [temp, setTemp] = useState(25);
    const canvasRef = useRef(null);

    const lambda0 = 1550;
    const deltaLambdaStrain = lambda0 * (1 - 0.22) * (strain * 1e-6);
    const deltaLambdaTemp = lambda0 * (0.5e-6 + 6.7e-6) * (temp - 25);
    const totalDelta = deltaLambdaStrain + deltaLambdaTemp;

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d');
        const render = () => {
            const w = canvas.width; const h = canvas.height;
            ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);
            
            // Draw Fiber with Gratings
            const fiberY = h / 2 - 20;
            ctx.fillStyle = '#1e293b'; ctx.fillRect(50, fiberY, w - 100, 40);
            
            // Gratings (Bragg Structure)
            // Period changes with strain. Shift with temp.
            const basePeriod = 15;
            const stretch = 1 + strain * 0.0001;
            const tempShift = (temp - 25) * 0.1;
            
            ctx.strokeStyle = 'cyan'; ctx.lineWidth = 2;
            for (let x = 100; x < w - 100; x += basePeriod * stretch) {
                const drawX = x + tempShift;
                ctx.globalAlpha = 0.3;
                ctx.beginPath(); ctx.moveTo(drawX, fiberY); ctx.lineTo(drawX, fiberY + 40); ctx.stroke();
            }
            ctx.globalAlpha = 1.0;

            // Spectral Response (The Peak)
            const graphH = 100; const graphY = h - 120;
            ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(50, graphY + graphH); ctx.lineTo(w - 50, graphY + graphH); ctx.stroke(); // X-axis
            
            const peakPos = w / 2 + totalDelta * 50;
            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3; ctx.beginPath();
            for (let x = 50; x < w - 50; x++) {
                const dist = Math.abs(x - peakPos);
                const height = Math.exp(-(dist * dist) / 400) * graphH;
                if (x === 50) ctx.moveTo(x, graphY + graphH - height);
                else ctx.lineTo(x, graphY + graphH - height);
            }
            ctx.stroke();
            
            // Peak Marker
            ctx.fillStyle = '#fff'; ctx.font = '900 8px Inter'; ctx.textAlign = 'center';
            ctx.fillText(`${(lambda0 + totalDelta).toFixed(3)} nm`, peakPos, graphY - 10);
            
            requestAnimationFrame(render);
        };
        const animId = requestAnimationFrame(render); return () => cancelAnimationFrame(animId);
    }, [strain, temp, totalDelta]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
            <header>
                <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Laboratory 04</Badge><Badge variant="navy">Section 02</Badge></div>
                <h2 className="text-6xl font-black text-navy tracking-tighter mb-8 uppercase italic leading-[0.9]">Bragg <span className="text-indigo-600 block text-8xl">Sandbox</span></h2>
                <div className="space-y-6 max-w-4xl border-l-4 border-indigo-600 pl-8">
                    <p className="text-slate-500 font-bold leading-relaxed text-xl italic leading-tight">"A permanent, selective mirror written directly into the glass core of a fiber."</p>
                    <p className="text-slate-500 font-medium leading-relaxed">The Fiber Bragg Grating (FBG) acts as a high-precision optical filter. By creating a periodic variation in the refractive index (via UV interference), we create a structure that reflects only one exact color. As the fiber is pulled or heated, this "barcode" stretches, moving the spectral peak.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <Card className="p-8 border-slate-100 bg-white shadow-2xl overflow-hidden relative">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Dynamic Spectral Response</div>
                    <div className="bg-slate-900 rounded-[3rem] border-[12px] border-slate-200 overflow-hidden h-[450px]">
                        <canvas ref={canvasRef} width={600} height={450} className="w-full h-full" />
                    </div>
                </Card>

                <div className="space-y-8">
                    <Card className="p-10 border-slate-100 flex flex-col gap-10 bg-white">
                        <h3 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-3"><Thermometer className="w-4 h-4" /> Calibration Control</h3>
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between"><span>Microstrain (με)</span><span className="text-indigo-600">{strain}</span></label>
                                <input type="range" min="-2000" max="2000" step="1" value={strain} onChange={e => setStrain(parseFloat(e.target.value))} className="w-full h-2 accent-indigo-600 rounded-full appearance-none bg-slate-100" />
                                <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase italic"><span>Compression</span><span>Tension</span></div>
                            </div>
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between"><span>Core Temp (°C)</span><span className="text-rose-600">{temp}°C</span></label>
                                <input type="range" min="-50" max="200" step="1" value={temp} onChange={e => setTemp(parseFloat(e.target.value))} className="w-full h-2 accent-rose-600 rounded-full appearance-none bg-slate-100" />
                                <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase italic"><span>Cryogenic</span><span>Combustion</span></div>
                            </div>
                        </div>
                        <div className="mt-8 p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Activity className="w-24 h-24" /></div>
                             <div className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Total Bragg Shift</div>
                             <div className="text-5xl font-black italic tracking-tighter">{(totalDelta * 1000).toFixed(1)} <span className="text-lg opacity-40 not-italic">pm</span></div>
                        </div>
                    </Card>
                    
                    <Card className="p-10 border-slate-100 flex flex-col gap-8 bg-white">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-navy uppercase tracking-widest">Resonance Condition</h4>
                            <MathBlock math="\lambda_B = 2 n_{\text{eff}} \Lambda" label="Bragg Wavelength" />
                            <p className="text-[11px] text-slate-500 font-medium italic">The reflected wavelength <MathInline math="\lambda_B" /> is exactly twice the effective index <MathInline math="n_{\text{eff}}" /> times the physical grating period <MathInline math="\Lambda" />.</p>
                        </div>
                        <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2rem] space-y-4">
                             <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Engineering Fact</h4>
                             <p className="text-[10px] text-indigo-900 leading-relaxed font-bold italic">"FBGs are widely used in structural health monitoring of aircraft wings. They are lightweight, EMI-proof, and can be multiplexed to 'read' the health of the wing at hundreds of points from a single fiber."</p>
                        </div>
                    </Card>
                </div>
            </div>
            
            <section className="mt-12">
                <EquationCheatSheet title="Optical Sensing Constants — Fiber Baseline" equations={[
                    { name: 'Strain sensitivity', math: '1.2 \\text{ pm}/\\mu\\epsilon', color: 'text-indigo-600', description: 'At 1550nm. Physical stretch of the glass lattice.' },
                    { name: 'Thermal sensitivity', math: '10 \\text{ pm}/^\\circ \\text{C}', color: 'text-rose-600', description: 'Thermal expansion + Thermo-optic effect.' },
                    { name: 'Photo-elastic constant', math: 'P_e \\approx 0.22', color: 'text-slate-600', description: 'Relates refractive index change to physical strain.' },
                ]} />
            </section>
        </div>
    );
};

/* =========================================
   3. FIBER OPTIC SENSORS
   ========================================= */

const SensorSimulator = () => {
    const canvasRef = useRef(null);
    const [type, setType] = useState('extrinsic');
    const [stimulus, setStimulus] = useState(25);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d');
        let frame = 0;
        const particles = Array.from({ length: 20 }, () => ({ x: 0, y: 0, active: false }));

        const render = () => {
            frame++;
            const w = canvas.width; const h = canvas.height; const midY = h / 2;
            ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);

            if (type === 'extrinsic') {
                const distance = 50 + (stimulus / 100) * 150;
                // Fibers
                ctx.strokeStyle = '#334155'; ctx.lineWidth = 14; 
                ctx.beginPath(); ctx.moveTo(50, midY - 40); ctx.lineTo(300, midY - 40); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(50, midY + 40); ctx.lineTo(300, midY + 40); ctx.stroke();
                
                // Light Core
                ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(50, midY - 40); ctx.lineTo(300, midY - 40); ctx.stroke();
                
                // Cone and Mirror
                ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
                ctx.beginPath(); ctx.moveTo(300, midY - 40); ctx.lineTo(300+distance, midY - 40 - distance*0.3); ctx.lineTo(300+distance, midY - 40 + distance*0.3); ctx.fill();
                
                ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.roundRect(300 + distance, midY - 80, 15, 160, 4); ctx.fill();
                
                // Return Light
                const reflectedBack = Math.max(0, 1 - (distance - 50) / 150);
                if (reflectedBack > 0.1) {
                    ctx.shadowBlur = 15; ctx.shadowColor = '#38bdf8';
                    ctx.strokeStyle = `rgba(56, 189, 248, ${reflectedBack})`;
                    ctx.beginPath(); ctx.moveTo(300 + distance, midY); ctx.lineTo(300, midY + 40); ctx.lineTo(50, midY + 40); ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            } else {
                // Intrinsic Microbend
                const pressure = stimulus / 100;
                const fiberY = midY;
                const points = [];
                for (let x = 50; x <= 750; x += 5) {
                    let y = fiberY;
                    if (x > 250 && x < 550) {
                        y += Math.sin((x - 250) * 0.1) * (pressure * 15);
                    }
                    points.push({ x, y });
                }
                
                // Draw Teeth
                ctx.fillStyle = '#1e293b';
                for (let x = 250; x < 550; x += 40) {
                    const tx = x + 20;
                    ctx.beginPath(); ctx.moveTo(x, midY - 80 + pressure * 40); ctx.lineTo(tx, midY - 40 + pressure * 40); ctx.lineTo(x + 40, midY - 80 + pressure * 40); ctx.fill();
                    ctx.beginPath(); ctx.moveTo(x, midY + 80 - pressure * 40); ctx.lineTo(tx, midY + 40 - pressure * 40); ctx.lineTo(x + 40, midY + 80 - pressure * 40); ctx.fill();
                }

                ctx.strokeStyle = '#334155'; ctx.lineWidth = 14; ctx.beginPath();
                points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }); ctx.stroke();
                
                const intensity = 1 - pressure * 0.8;
                ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4; ctx.globalAlpha = intensity;
                ctx.beginPath();
                points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }); ctx.stroke();
                ctx.globalAlpha = 1.0;
                
                // Particles leaking
                if (pressure > 0.3) {
                    for(let i=0; i<3; i++) {
                        const px = 250 + Math.random() * 300; const py = midY + (Math.random() - 0.5) * 40;
                        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py, 1, 0, Math.PI * 2); ctx.fill();
                    }
                }
            }
            requestAnimationFrame(render);
        };
        const animId = requestAnimationFrame(render); return () => cancelAnimationFrame(animId);
    }, [type, stimulus]);

    const currentIntensity = type === 'extrinsic' ? 100 / Math.pow(1 + (stimulus * 0.05), 2) : 100 * Math.exp(-0.03 * stimulus);       

    useEffect(() => { setHistory(prev => [...prev.slice(-40), currentIntensity]); }, [stimulus, type, currentIntensity]);

    return (
        <Card className="p-10 bg-white border-slate-100 overflow-hidden shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-10">
                    <Card className="p-10 border-slate-100 flex flex-col gap-10 bg-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-2">Sensor Selection</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight italic">Choose sensing mechanism for analysis</p>
                            </div>
                            <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                                {['extrinsic', 'intrinsic'].map(t => (
                                    <button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${type === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-navy'}`}>{t}</button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase flex justify-between"><span>Environmental Applied Stimulus</span><span className="text-indigo-600">{stimulus}%</span></label>
                                <input type="range" value={stimulus} onChange={e => setStimulus(parseFloat(e.target.value))} className="w-full h-1.5 accent-indigo-600 rounded-full appearance-none bg-slate-100" />
                            </div>

                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                <h4 className="text-[11px] font-black text-navy uppercase tracking-widest">Physics Observation</h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
                                    {type === 'extrinsic' 
                                        ? "Reflective configuration: As the stimulus increases, the distance between fibers grows, causing the 'light cone' to broaden and return less power. This is used for precise vibration/position sensing." 
                                        : "Microbend configuration: Physical pressure creates sharp periodic bends in the fiber. Each bend violates the Total Internal Reflection (TIR) condition, causing light to leak into the cladding."}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-8">
                        <Card className="p-10 border-slate-100 bg-white space-y-6">
                            <h4 className="text-xs font-black text-navy uppercase tracking-widest italic">Loss Derivation (Microbending)</h4>
                            <MathBlock math="\alpha_{mb} = C \sum_i P_i \left( \frac{1}{\Delta^i} \right)" label="Microbend Loss Coefficient" />
                            <p className="text-[11px] text-slate-500 font-medium">Where <MathInline math="\Delta" /> is the relative index difference. Note that higher numerical aperture (NA) fibers are inherently more resistant to microbending losses.</p>
                        </Card>
                        
                        <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-8 opacity-10"><Activity className="w-20 h-20 text-indigo-400" /></div>
                             <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Detected Power (P_out)</div>
                             <div className="text-5xl font-black italic tracking-tighter text-blue-300">
                                {type === 'extrinsic' 
                                    ? (100 - stimulus * 0.8).toFixed(1) 
                                    : (100 - Math.pow(stimulus/10, 2)).toFixed(1)} <span className="text-sm opacity-40 not-italic uppercase ml-2">% Initial</span></div>
                             <p className="text-[9px] text-slate-500 font-bold leading-relaxed italic uppercase">"Highly sensitive to sub-nanometer perturbations in harsh environments."</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-200 overflow-hidden relative min-h-[450px]">
                    <canvas ref={canvasRef} width={800} height={450} className="w-full h-full" />
                </div>
            </div>
        </Card>
    );
};

const SensorMasterclass = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
            <header>
                <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Laboratory 04</Badge><Badge variant="navy">Section 03</Badge></div>
                <h2 className="text-6xl font-black text-navy tracking-tighter mb-8 uppercase italic leading-[0.9]">Universal <span className="text-indigo-600 block text-8xl">Sensors</span></h2>
                <div className="space-y-6 max-w-4xl border-l-4 border-indigo-600 pl-8">
                    <p className="text-slate-500 font-bold leading-relaxed text-xl italic leading-tight">"Where the fiber itself becomes the transducer, converting environmental stimuli into light modulation."</p>
                    <p className="text-slate-500 font-medium leading-relaxed">Optical sensors are divided into two fundamental architectures. <strong>Intrinsic sensors</strong> modulate light directly within the core (e.g., microbending or phase change), while <strong>Extrinsic sensors</strong> use the fiber merely as a pipeline to an external sensing element (e.g., reflective displacement or cavity-based sensing).</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="p-12 bg-white rounded-[3rem] border border-slate-100 hover:shadow-2xl transition-all space-y-8">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm"><Search className="w-6 h-6" /></div>
                    <h3 className="text-2xl font-black text-navy tracking-tight uppercase italic">Extrinsic Sensing</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">The fiber acts purely as a delivery pipe. Light leaves the glass, interacts with an external object, and returns. The sensing region is <strong>outside</strong> the fiber.</p>
                    <div className="p-6 bg-slate-50 rounded-2xl italic text-xs text-slate-400 font-bold">"Use Case: Proximity detection, chemical liquid analysis, remote temperature points."</div>
                </div>
                <div className="p-12 bg-slate-900 text-white rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Activity className="w-24 h-24" /></div>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-400"><Target className="w-6 h-6" /></div>
                    <h3 className="text-2xl font-black text-indigo-400 tracking-tight uppercase italic">Intrinsic Sensing</h3>
                    <p className="text-slate-300 font-medium leading-relaxed">The light never leaves the glass. The environment physically deforms or heats the fiber itself, altering the core properties. The fiber <strong>is</strong> the sensor.</p>
                    <div className="p-6 bg-white/5 rounded-2xl italic text-xs text-slate-500 font-bold border border-white/5">"Use Case: Bridge strain monitoring, deep-well pressure, distributed acoustic sensing (DAS)."</div>
                </div>
            </div>

            <section className="space-y-16">
                <header className="space-y-4">
                    <Badge variant="gold">Simulation Laboratory</Badge>
                    <h3 className="text-4xl font-black text-navy uppercase italic tracking-tighter">Intensity <span className="text-emerald-500 block">Modulator Lab</span></h3>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-slate-100 pt-16 font-medium">
                    <div className="space-y-10">
                        <div className="space-y-6 text-slate-500 leading-relaxed">
                            <p>In an intrinsic microbend sensor, the power loss <MathInline math="\alpha_m" /> is proportional to the number of bends and the displacement <MathInline math="d" />. The coupling between guided and radiation modes is maximized when the bend period matches the fiber's internal mode-field spacing.</p>
                            <MathBlock math="\frac{P_{\text{out}}}{P_{\text{in}}} = 1 - k \cdot (\Delta L) \cdot \sin^2(\theta)" />
                        </div>
                    </div>
                    <div className="space-y-10">
                        <div className="space-y-6 text-slate-500 leading-relaxed">
                            <h4 className="text-xl font-black text-navy uppercase italic">2. Interferometric Phase Shift</h4>
                            <p>For high-precision sensing (e.g. pressure), we measure the phase shift <MathInline math="\Delta\phi" />. Stretching a fiber of length <MathInline math="L" /> causes a shift based on physical length and the photo-elastic effect.</p>
                            <MathBlock math="\Delta\phi = \frac{2\pi n}{\lambda} \Delta L + \frac{2\pi L}{\lambda} \Delta n" />
                            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl italic text-[10px] text-indigo-900">"Sensing Limit: Advanced interferometers can detect shifts of <MathInline math="10^{-6}" /> radians, allowing for the detection of vibrations smaller than an atom."</div>
                        </div>
                    </div>
                </div>
                <SensorSimulator />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[
                    { title: 'Intensity', dev: 'Dimming', desc: 'Bending or gaps make the light leak out. Easiest to measure but susceptible to source noise.' },
                    { title: 'Phase', dev: 'Interference', desc: 'Stretching shifts the wave phase. Measured via Mach-Zehnder or Sagnac setups. Incredibly precise.' },
                    { title: 'Wavelength', dev: 'Color Shift', desc: 'Strain changes the Bragg Barcode spacing, physical moving the reflected color peak.' }
                ].map((item, i) => (
                    <Card key={i} className="p-8 border border-slate-100">
                        <div className="text-[10px] font-black text-indigo-600 uppercase mb-3 tracking-widest">{item.dev}</div>
                        <h4 className="text-xl font-bold text-navy mb-4 tracking-tighter leading-none">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};



/* =========================================
   4. OPTICAL TRAFFIC CONTROL
   ========================================= */

const TrafficControlSimulator = () => {
    const [type, setType] = useState('isolator');
    const [direction, setDirection] = useState('forward');
    const [voaLoss, setVoaLoss] = useState(0);
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d');
        let frame = 0;
        const render = () => {
            frame++;
            const w = canvas.width; const h = canvas.height; const midY = h / 2;
            ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);

            if (type === 'isolator') {
                // Main Pipe
                ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(50, midY); ctx.lineTo(w-50, midY); ctx.stroke();
                // Device Housing
                ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.roundRect(w/2 - 50, midY - 60, 100, 120, 12); ctx.fill();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)'; ctx.lineWidth = 1; ctx.stroke();
                
                // One-way Arrow
                ctx.fillStyle = '#38bdf8'; ctx.font = '24px Inter'; ctx.textAlign = 'center'; ctx.fillText(direction === 'forward' ? '→' : 'X', w/2, midY + 10);
                
                // Flowing light
                if (direction === 'forward') {
                    const flowX = (frame * 4) % w;
                    ctx.shadowBlur = 15; ctx.shadowColor = '#38bdf8';
                    ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(flowX, midY, 3, 0, Math.PI * 2); ctx.fill();
                    ctx.shadowBlur = 0;
                }
            } else if (type === 'circulator') {
                const ports = [{x: 100, y: midY-100, label: 'P1'}, {x: w-100, y: midY, label: 'P2'}, {x: 100, y: midY+100, label: 'P3'}];
                ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 8;
                ports.forEach(p => { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(w/2, midY); ctx.stroke(); });
                
                ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(w/2, midY, 60, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.stroke();
                ctx.fillStyle = '#ec4899'; ctx.font = '32px Inter'; ctx.textAlign = 'center'; ctx.fillText('↻', w/2, midY + 12);
                
                // Routing particle
                const pTime = (frame % 100) / 100;
                let px, py;
                if (pTime < 0.5) { // P1 to P2
                    px = 100 + (w/2 - 100) * (pTime * 2); py = (midY - 100) + (100) * (pTime * 2);
                } else { // Around to P2
                   px = w/2 + (w/2 - 100) * ((pTime-0.5) * 2); py = midY;
                }
                ctx.fillStyle = '#ec4899'; ctx.shadowBlur = 15; ctx.shadowColor = '#ec4899';
                ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
            } else if (type === 'attenuator') {
               const trans = Math.pow(10, -voaLoss / 10);
               ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(50, midY); ctx.lineTo(w-50, midY); ctx.stroke();
               
               // Absorption region
               ctx.fillStyle = `rgba(15, 23, 42, ${1-trans})`; ctx.fillRect(w/2 - 60, midY - 40, 120, 80);
               ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.strokeRect(w/2 - 60, midY - 40, 120, 80);
               
               // Light beam
               ctx.lineWidth = 4; ctx.strokeStyle = '#38bdf8'; ctx.shadowBlur = 10; ctx.shadowColor = '#38bdf8';
               ctx.beginPath(); ctx.moveTo(50, midY); ctx.lineTo(w/2 - 60, midY); ctx.stroke();
               ctx.globalAlpha = Math.max(0.1, trans);
               ctx.beginPath(); ctx.moveTo(w/2 + 60, midY); ctx.lineTo(w-50, midY); ctx.stroke();
               ctx.globalAlpha = 1.0; ctx.shadowBlur = 0;
            }

            requestAnimationFrame(render);
        };
        const animId = requestAnimationFrame(render); return () => cancelAnimationFrame(animId);
    }, [type, direction, voaLoss]);

    return (
        <Card className="p-10 bg-white border-slate-100 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-10">
                    <Card className="p-10 border-slate-100 flex flex-col gap-10 bg-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-2">Component Protocol</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight italic">Select non-reciprocal optical device</p>
                            </div>
                            <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                                {['isolator', 'circulator', 'attenuator'].map(t => (
                                    <button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${type === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-navy'}`}>{t}</button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                             <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                <h4 className="text-[11px] font-black text-navy uppercase tracking-widest">Logic Breakdown</h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
                                    {type === 'isolator' 
                                        ? "The Optical Isolator uses a 45° Faraday Rotator between two polarizers. Forward light passes through, but reflected back-light is rotated out of alignment and blocked." 
                                        : type === 'circulator'
                                        ? "A three-port device where light enters port 1 and exits port 2, while reflections at port 2 are routed to port 3, protecting the source."
                                        : "Attenuators use controlled misalignment or absorption to reduce signal power without ghosting."}
                                </p>
                             </div>
                             
                             <Card className="p-8 border-slate-100 bg-white space-y-6">
                                <h4 className="text-xs font-black text-navy uppercase tracking-widest italic">The Verdet Constant</h4>
                                <MathBlock math="\theta = V B L" label="Faraday Rotation" />
                                <p className="text-[10px] text-slate-500 font-medium">Rotation <MathInline math="\theta" /> is proportional to Verdet constant <MathInline math="V" />, magnetic field <MathInline math="B" />, and crystal length <MathInline math="L" />.</p>
                             </Card>
                        </div>

                        <button onClick={() => setDirection(d => d === 'forward' ? 'reverse' : 'forward')} className="w-full py-6 rounded-[2rem] bg-slate-900 text-white font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-slate-800 transition-all border border-slate-700 shadow-2xl">
                            <ArrowLeft className={`w-6 h-6 transition-transform duration-700 ${direction === 'reverse' ? 'rotate-180 text-blue-400' : 'text-rose-400'}`} />
                            TRANSMISSION: {direction === 'forward' ? 'SECURE' : 'BLOCKED'}
                            <Info className="w-4 h-4 opacity-50" />
                        </button>
                    </Card>
                </div>
                <div className="flex-1 bg-slate-950 rounded-[3.5rem] border-[12px] border-slate-200 overflow-hidden min-h-[400px]">
                    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
                </div>
            </div>
        </Card>
    );
};
const TrafficMasterclass = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
            <header>
                <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Laboratory 04</Badge><Badge variant="navy">Section 04</Badge></div>
                <h2 className="text-6xl font-black text-navy tracking-tighter mb-8 uppercase italic leading-[0.9]">Traffic <span className="text-indigo-600 block text-8xl">Control</span></h2>
                <div className="space-y-6 max-w-4xl border-l-4 border-indigo-600 pl-8">
                    <p className="text-slate-500 font-bold leading-relaxed text-xl italic leading-tight">"Enforcing one-way light flow using relativistic magnetic effects."</p>
                    <p className="text-slate-500 font-medium leading-relaxed">Optical isolators and circulators are the 'diodes' of the photonic world. Without them, back-reflections would destabilize laser sources or cause massive crosstalk. They rely on <strong>Faraday Rotation</strong>: a non-reciprocal effect where the polarization of light rotates in the same direction regardless of which way the light is traveling.</p>
                </div>
            </header>

            <section className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {[
                        { title: 'Optical Isolator', desc: 'The One-Way Wall. Preventing back-reflections that would otherwise destabilize the laser cavity.' },
                        { title: 'Optical Circulator', desc: 'The Roundabout. Enabling bi-directional data flow using Port 1 → 2 and Port 2 → 3 sequential logic.' },
                        { title: 'Attenuator', desc: 'The Speed Limit. Absorbing power to prevent drowning the sensitive APD detectors in too much light.' }
                    ].map((d, i) => (
                        <div key={i} className="p-10 border border-slate-100 rounded-[3rem] space-y-6 bg-white hover:bg-slate-50 transition-colors shadow-sm">
                            <h4 className="text-xl font-black text-navy uppercase italic">{d.title}</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{d.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <TrafficControlSimulator />

            <section className="space-y-16">
                <div className="flex justify-between items-end border-b border-slate-100 pb-12">
                    <div className="space-y-4">
                        <Badge variant="indigo">Faraday Effect Physics</Badge>
                        <h3 className="text-4xl font-black text-navy tracking-tight uppercase italic leading-[0.9]">Magnetic <span className="text-indigo-600 block">Rotation</span></h3>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 font-medium">
                    <div className="space-y-10">
                        <div className="space-y-6 text-slate-500 leading-relaxed">
                            <h4 className="text-xl font-black text-navy uppercase italic">Non-Reciprocity</h4>
                            <p>Unlike standard lenses, a Faraday Rotator is **non-reciprocal**. It is a magnetic crystal that twists light by 45° regardless of direction. This allows it to rotate forward light into matching polarizers, but rotate backward light *away* from them into a stone wall.</p>
                        </div>
                    </div>
                    <div className="space-y-10">
                        <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white space-y-6 shadow-2xl relative overflow-hidden font-mono text-xs">
                             <div className="text-[10px] text-indigo-400 font-black uppercase mb-4 tracking-[0.3em]">Phase Shift Logic</div>
                             <div className="space-y-4">
                                 <div className="flex justify-between border-b border-white/10 pb-2"><span>Forward Rotation</span><span className="text-emerald-400">+45°</span></div>
                                 <div className="flex justify-between border-b border-white/10 pb-2"><span>Backward Rotation</span><span className="text-emerald-400">+45°</span></div>
                                 <div className="flex justify-between font-black pt-4"><span>Total Back Phase</span><span className="text-rose-600">90° (Blocked)</span></div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
/* =========================================
   5. FIBER COUPLERS (Splitters/Taps)
   ========================================= */

const CouplerSimulator = () => {
    const canvasRef = useRef(null);
    const [length, setLength] = useState(50); // 0 to 100%
    const kappa = 0.08; 
    const p1 = Math.pow(Math.cos(kappa * length * 0.2), 2);
    const p2 = Math.pow(Math.sin(kappa * length * 0.2), 2);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const render = () => {
            const w = canvas.width; const h = canvas.height;
            const midY = h / 2;
            const taperX = 250; const taperW = 300;
            ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);
            const drawFiber = (y1, y2, color, intensity) => {
                ctx.strokeStyle = color; ctx.lineWidth = 14; ctx.globalAlpha = 0.1;
                ctx.beginPath(); ctx.moveTo(50, y1); ctx.bezierCurveTo(taperX, y1, taperX, midY, taperX + 50, midY);
                ctx.lineTo(taperX + taperW - 50, midY); ctx.bezierCurveTo(taperX + taperW, midY, taperX + taperW, y2, taperX + taperW + 200, y2); ctx.stroke();
                ctx.globalAlpha = intensity; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4;
                ctx.shadowBlur = 15; ctx.shadowColor = '#38bdf8'; ctx.stroke();
                ctx.shadowBlur = 0; ctx.globalAlpha = 1.0;
            };
            ctx.lineCap = 'round';
            drawFiber(midY - 40, midY - 60, '#cbd5e1', 0.1);
            drawFiber(midY + 40, midY + 60, '#cbd5e1', 0.1);
            ctx.lineWidth = 4; ctx.shadowBlur = 10; ctx.shadowColor = '#0ea5e9';
            for(let x = 0; x < taperW; x += 2) {
                const weight = Math.min(1, x / (length * 3)); if (weight <= 0) continue;
                const i1 = Math.pow(Math.cos(kappa * x * 0.2), 2);
                const i2 = Math.pow(Math.sin(kappa * x * 0.2), 2);
                ctx.strokeStyle = `rgba(14, 165, 233, ${i1})`;
                ctx.beginPath(); ctx.moveTo(taperX + x, midY - 2); ctx.lineTo(taperX + x + 2, midY - 2); ctx.stroke();
                ctx.strokeStyle = `rgba(14, 165, 233, ${i2})`;
                ctx.beginPath(); ctx.moveTo(taperX + x, midY + 2); ctx.lineTo(taperX + x + 2, midY + 2); ctx.stroke();
            }
            ctx.strokeStyle = '#0ea5e9'; ctx.lineWidth = 4; ctx.beginPath();
            ctx.moveTo(50, midY - 40); ctx.bezierCurveTo(taperX, midY - 40, taperX, midY, taperX, midY); ctx.stroke();
            ctx.strokeStyle = `rgba(14, 165, 233, ${p1})`;
            ctx.beginPath(); ctx.moveTo(taperX + taperW, midY - 4); ctx.bezierCurveTo(taperX + taperW + 50, midY, taperX + taperW + 100, midY - 60, taperX + taperW + 200, midY - 60); ctx.stroke();
            ctx.strokeStyle = `rgba(14, 165, 233, ${p2})`;
            ctx.beginPath(); ctx.moveTo(taperX + taperW, midY + 4); ctx.bezierCurveTo(taperX + taperW + 50, midY, taperX + taperW + 100, midY + 60, taperX + taperW + 200, midY + 60); ctx.stroke();
            requestAnimationFrame(render);
        };
        const animId = requestAnimationFrame(render); return () => cancelAnimationFrame(animId);
    }, [length, p1, p2]);

    return (
        <Card className="p-10 bg-white shadow-2xl border-slate-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-10">
                    <header className="space-y-4">
                        <Badge variant="indigo">Evanescent Pendulum</Badge>
                        <h4 className="text-sm font-black text-navy uppercase tracking-widest">FBT Manufacturing Lab</h4>
                    </header>
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coupling Length (z)</label>
                            <input type="range" min="0" max="100" value={length} onChange={e => setLength(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-indigo-600" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                                <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Port 3 (Top)</div>
                                <div className="text-2xl font-black text-navy">{(p1 * 100).toFixed(1)}%</div>
                            </div>
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                                <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Port 4 (Bot)</div>
                                <div className="text-2xl font-black text-indigo-600">{(p2 * 100).toFixed(1)}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-200 relative min-h-[450px] overflow-hidden">
                    <canvas ref={canvasRef} width={800} height={450} className="w-full h-full opacity-90" />
                </div>
            </div>
        </Card>
    );
};

const CouplerMasterclass = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
            <header className="mb-20">
                <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Passive Splitting</Badge><Badge variant="navy">Section 05</Badge></div>
                <h2 className="text-6xl font-black text-navy tracking-tighter mb-8 uppercase italic leading-[0.9]">Fiber <span className="text-indigo-600 block text-8xl">Couplers</span></h2>
                <div className="space-y-6 max-w-4xl border-l-4 border-indigo-600 pl-8">
                    <p className="text-slate-500 font-bold leading-relaxed text-xl italic leading-tight">"The internet is not a straight line. To broadcast signals or tap for monitoring, we use passive splitting."</p>
                    <p className="text-slate-500 font-medium leading-relaxed">Fiber couplers rely on the <strong>Evanescent Wave</strong>. When two fiber cores are brought within a few microns of each other, the light fields overlap, allowing power to 'hop' from one core to another. This is perfectly predictable using <strong>Coupled Mode Theory (CMT)</strong>.</p>
                </div>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                 <CouplerSimulator />
                 <div className="space-y-8">
                    <Card className="p-10 border-slate-100 bg-white space-y-6 shadow-xl">
                        <h4 className="text-xs font-black text-navy uppercase tracking-widest italic leading-relaxed">Coupled Mode Theory</h4>
                        <MathBlock math="P_{2}(z) = P_{1}(0) \sin^2(\kappa z)" label="Power Transfer Logic" />
                        <p className="text-[11px] text-slate-500 font-medium italic">Output power <MathInline math="P_2" /> depends on the coupling coefficient <MathInline math="\kappa" /> and the physical interaction length <MathInline math="z" />. By precisely controlling the fusion length, we create 50/50, 90/10, or 99:1 split ratios.</p>
                    </Card>

                    <div className="p-10 bg-indigo-50 border border-indigo-100 rounded-[3rem] space-y-6">
                        <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest leading-relaxed">Performance Metric</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insertion Loss</span>
                                <span className="text-xl font-black text-indigo-600">~0.15 dB</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coupling Matrix</span>
                                <span className="text-xs font-mono font-bold text-slate-500">[S] Parameter</span>
                            </div>
                        </div>
                    </div>
                 </div>
            </section>
        </div>
    );
};

/* =========================================
   5. AMPLIFIERS VS. REGENERATORS
   ========================================= */

const NetworkLinkSimulator = () => {
    const canvasRef = useRef(null);
    const [network, setNetwork] = useState(['TX']);
    const [amplitude, setAmplitude] = useState(1);
    const [noise, setNoise] = useState(0);

    const addFiber = () => { if (network.length > 8) return; setNetwork([...network, 'FIBER']); setAmplitude(a => a * 0.5); setNoise(n => n + 15); };
    const addEDFA = () => { if (network.length > 8) return; setNetwork([...network, 'EDFA']); setAmplitude(1); setNoise(n => (n * 1.2) + 10); };
    const add3R = () => { if (network.length > 8) return; setNetwork([...network, '3R']); setAmplitude(1); setNoise(0); };
    const reset = () => { setNetwork(['TX']); setAmplitude(1); setNoise(0); };

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d');
        let frame = 0;
        const render = () => {
            frame++;
            const w = canvas.width; const h = canvas.height; const midY = h / 2;
            ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);
            
            // Grid
            ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1; ctx.beginPath();
            for(let x=0; x<w; x+=50) { ctx.moveTo(x,0); ctx.lineTo(x,h); } ctx.stroke();
            
            // Oscilloscope Waveform
            ctx.strokeStyle = noise > 80 ? '#f43f5e' : '#22d3ee'; ctx.lineWidth = 3; ctx.beginPath();
            for(let x=0; x<w; x++) {
                const sig = Math.sin(x*0.05 - frame*0.1) > 0 ? 60 : -60;
                const n = (Math.random()-0.5) * noise;
                const y = midY + (sig * amplitude) + n;
                if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
            }
            ctx.stroke();
            requestAnimationFrame(render);
        };
        const animId = requestAnimationFrame(render); return () => cancelAnimationFrame(animId);
    }, [amplitude, noise]);

    const snr = noise === 0 ? 100 : (amplitude * 100) / noise;

    return (
        <Card className="p-10 bg-white shadow-2xl border-slate-100 overflow-hidden">
            <div className="space-y-12">
                <header className="flex justify-between items-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <div className="space-y-1">
                        <Badge variant="indigo">Network Builder</Badge>
                        <h4 className="text-xl font-black text-navy uppercase italic">Link Map (1000 km)</h4>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={addFiber} className="px-5 py-3 bg-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase hover:bg-slate-300 transition-all">+ 80km Fiber</button>
                        <button onClick={addEDFA} className="px-5 py-3 bg-emerald-100 text-emerald-700 rounded-xl text-[9px] font-black uppercase hover:bg-emerald-200 transition-all">+ EDFA</button>
                        <button onClick={add3R} className="px-5 py-3 bg-purple-100 text-purple-700 rounded-xl text-[9px] font-black uppercase hover:bg-purple-200 transition-all">+ 3R Regen</button>
                        <button onClick={reset} className="px-5 py-3 bg-navy text-white rounded-xl text-[9px] font-black uppercase hover:bg-slate-800 transition-all">Clear</button>
                    </div>
                </header>

                <div className="flex gap-4 items-center px-4">
                    {network.map((node, i) => (
                        <React.Fragment key={i}>
                            <div className={`px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-tighter ${node === 'TX' ? 'bg-navy text-white' : node === 'EDFA' ? 'bg-emerald-500 text-white' : node === '3R' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{node}</div>
                            {i < network.length - 1 && <div className="h-0.5 w-8 bg-slate-200" />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="bg-slate-950 rounded-[3rem] border-[12px] border-slate-200 h-[300px] relative overflow-hidden">
                    <canvas ref={canvasRef} width={800} height={300} className="w-full h-full" />
                    <div className="absolute top-10 right-10 text-right">
                         <div className="text-[9px] font-black text-slate-500 uppercase mb-2">Signal Fidelity (SNR)</div>
                         <div className={`text-4xl font-black italic tracking-tighter ${snr < 5 ? 'text-rose-500' : 'text-emerald-400'}`}>{snr < 1 ? 'DROP' : snr.toFixed(1)}</div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const AmplifiersMasterclass = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
            <header className="mb-20">
                <div className="flex items-center gap-3 mb-6"><Badge variant="gold">Signal Regeneration</Badge><Badge variant="navy">Section 06</Badge></div>
                <h2 className="text-6xl font-black text-navy tracking-tighter mb-8 uppercase italic leading-[0.9]">Boost <span className="text-emerald-600 block text-8xl">vs. Rebuild</span></h2>
                <div className="space-y-6 max-w-4xl border-l-4 border-emerald-600 pl-8">
                    <p className="text-slate-500 font-bold leading-relaxed text-xl italic leading-tight">"Light fades and blurs as it travels. We must choose: amplify the optical field or rebuild the digital data."</p>
                    <p className="text-slate-500 font-medium leading-relaxed">In ultra-long links (trans-oceanic), we face a trade-off. <strong>Optical Amplifiers (EDFA)</strong> provide massive, low-latency gain for WDM systems but introduce <strong>Amplified Spontaneous Emission (ASE)</strong> noise. <strong>3R Regenerators</strong> eliminate noise completely by converting light to electrons and back, but they add latency and massive cost.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <Card className="p-10 border border-slate-100 space-y-8 bg-white hover:shadow-2xl transition-all">
                    <div className="flex justify-between items-start">
                        <Badge variant="emerald">EDFA / SOA</Badge>
                        <span className="text-2xl font-black text-slate-200">1R</span>
                    </div>
                    <h3 className="text-3xl font-black text-navy uppercase italic">Physical <span className="text-emerald-600 block">Amplifiers</span></h3>
                    <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-emerald-600 pl-6">"Purely optical. EDFAs amplify the light without ever turning it into electricity. Fast, cheap, but they amplify noise (ASE) right along with the signal."</p>
                </Card>

                <Card className="p-10 border border-slate-100 space-y-8 bg-white hover:shadow-2xl transition-all">
                    <div className="flex justify-between items-start">
                        <Badge variant="purple">O-E-O Process</Badge>
                        <span className="text-2xl font-black text-slate-200">3R</span>
                    </div>
                    <h3 className="text-3xl font-black text-navy uppercase italic">Digital <span className="text-purple-600 block">Regenerators</span></h3>
                    <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-purple-600 pl-6">"Electrical conversion. These nodes catch light, turn it into binary, clean it, and re-fire a perfect pulse. Essential for wiping the slate clean after long distances."</p>
                </Card>
            </div>

            <NetworkLinkSimulator />

            <section className="mt-24 space-y-16">
                 <div className="flex justify-between items-end border-b border-slate-100 pb-12">
                    <div className="space-y-4">
                        <Badge variant="indigo">The 3R Definition</Badge>
                        <h3 className="text-4xl font-black text-navy tracking-tight uppercase italic leading-[0.9]">The Restoration <span className="text-indigo-600 block">Hierarchy</span></h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <Card className="p-10 border-slate-100 bg-white space-y-6 shadow-xl">
                        <h4 className="text-xs font-black text-navy uppercase tracking-widest italic leading-relaxed">EDFA Gain Dynamics</h4>
                        <MathBlock math="G(L) = \exp[ (\sigma_e + \sigma_a) \bar{N}_2 L - \sigma_a N_t L ]" label="Theoretical Gain" />
                        <p className="text-[11px] text-slate-500 font-medium italic">Where <MathInline math="\sigma" /> represents the absorption/emission cross-sections of Erbium ions and <MathInline math="\bar{N}_2" /> the average population inversion.</p>
                    </Card>
                    
                    <Card className="p-10 border-indigo-50 bg-indigo-50/20 space-y-6">
                        <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest italic leading-relaxed">Engineering Tradeoff</h4>
                        <p className="text-sm text-indigo-900 leading-relaxed font-bold italic">"EDFAs are WDM-agnostic: a single amplifier can boost 80+ channels simultaneousy. 3R systems require a separate receiver and transmitter for EVERY single wavelength, making them unfeasible for massive data centers except in rare backbone re-timing nodes."</p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { r: '1R', title: 'Re-Amplification', desc: 'Making the signal taller (brighter). Pure EDFA task.' },
                        { r: '2R', title: 'Re-Shaping', desc: 'Cleaning pulses to restore the logic square wave.' },
                        { r: '3R', title: 'Re-Timing', desc: 'Syncing to a clock to eliminate temporal jitter.' }
                    ].map((step, i) => (
                        <div key={i} className="p-10 bg-slate-900 rounded-[3rem] text-white border border-white/5 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 text-[10rem] font-black text-white opacity-5 group-hover:opacity-10 transition-opacity leading-none">{step.r[0]}</div>
                            <Badge variant="gold" className="mb-6">{step.r}</Badge>
                            <h4 className="text-xl font-black uppercase italic mb-4">{step.title}</h4>
                            <p className="text-xs text-slate-400 font-bold leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

/* =========================================
   7. COHERENT DISTRIBUTED SENSING
   ========================================= */

const DistributedSensingSimulator = () => {
    const canvasRef = useRef(null);
    const [temp, setTemp] = useState(25);
    const [isFiring, setIsFiring] = useState(false);
    const [trace, setTrace] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d');
        let frame = 0;
        const render = () => {
            frame++;
            const w = canvas.width; const h = canvas.height;
            ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);
            
            // Optical Path
            ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(50, 100); ctx.lineTo(w-50, 100); ctx.stroke();
            
            // Nodes
            const nodes = [{x: 100, l: 'DFB'}, {x: 250, l: 'ISO'}, {x: 400, l: 'AMP'}, {x: 550, l: 'CIRC'}, {x: 700, l: 'FUT'}];
            nodes.forEach(n => {
                ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.roundRect(n.x - 30, 85, 60, 30, 8); ctx.fill();
                ctx.fillStyle = '#475569'; ctx.font = '900 8px Inter'; ctx.textAlign = 'center'; ctx.fillText(n.l, n.x, 125);
            });

            // Probe fire pulse
            if (isFiring) {
                const x = (frame * 10) % (w + 100);
                if (x < w) {
                    ctx.shadowBlur = 20; ctx.shadowColor = '#38bdf8';
                    ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(x, 100, 5, 0, Math.PI * 2); ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            // ESA Trace (Spectrum)
            const graphY = h - 150; const graphH = 100;
            ctx.strokeStyle = '#1e293b'; ctx.beginPath(); ctx.moveTo(100, graphY + graphH); ctx.lineTo(w-100, graphY + graphH); ctx.stroke();
            
            const peakPos = w/2 + (temp - 25) * 1.5;
            ctx.strokeStyle = '#f472b6'; ctx.lineWidth = 2; ctx.beginPath();
            for(let x=100; x<w-100; x++) {
                const dist = Math.abs(x - peakPos);
                const val = Math.exp(-(dist * dist) / 300) * graphH + (Math.random() * 5);
                if (x === 100) ctx.moveTo(x, graphY + graphH - val);
                else ctx.lineTo(x, graphY + graphH - val);
            }
            ctx.stroke();

            requestAnimationFrame(render);
        };
        const animId = requestAnimationFrame(render); return () => cancelAnimationFrame(animId);
    }, [isFiring, temp]);

    return (
        <Card className="p-10 bg-white border-slate-100 shadow-2xl relative overflow-hidden">
            <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3"><Badge variant="red">Brillouin Probe</Badge><h4 className="text-xl font-black text-navy uppercase italic tracking-tighter">Radar Trace</h4></div>
                <button onClick={() => setIsFiring(!isFiring)} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isFiring ? 'bg-rose-600 text-white shadow-lg animate-pulse' : 'bg-slate-900 text-white'}`}>{isFiring ? 'SYSTEM ACTIVE' : 'FIRE PROBE'}</button>
            </header>
            <div className="bg-slate-950 rounded-[3rem] border-[12px] border-slate-200 overflow-hidden h-[450px] relative">
                <canvas ref={canvasRef} width={800} height={450} className="w-full h-full" />
                <div className="absolute top-10 right-10 text-right"><div className="text-[10px] font-black text-slate-500 uppercase mb-2">Backscatter Peak</div><div className="text-4xl font-black italic tracking-tighter text-rose-400">{(10.8 + (temp-25)*0.001).toFixed(4)} <span className="text-sm">GHz</span></div></div>
            </div>
            <div className="mt-10 p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex flex-col gap-6">
                <div className="flex justify-between items-center"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Environmental Temperature (°C)</label><span className="text-rose-600 font-black">{temp.toFixed(1)}°C</span></div>
                <input type="range" min="-50" max="150" step="0.5" value={temp} onChange={e => setTemp(parseFloat(e.target.value))} className="w-full h-2 accent-rose-600 rounded-full appearance-none bg-slate-200 cursor-pointer" />
            </div>
        </Card>
    );
};

const SensingSetupMasterclass = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
            <header className="mb-20">
                <div className="flex items-center gap-3 mb-6"><Badge variant="gold">Architecture</Badge><Badge variant="navy">Section 07</Badge></div>
                <h2 className="text-6xl font-black text-navy tracking-tighter mb-8 uppercase italic leading-[0.9]">Distributed <span className="text-indigo-600 block">Coherent Sensing</span></h2>
                <div className="space-y-6 max-w-4xl border-l-4 border-indigo-600 pl-8"><p className="text-slate-500 font-bold leading-relaxed text-xl leading-relaxed italic">Synthesizing lasers, amplifiers, and circulators into a unified pipeline monitoring system.</p></div>
            </header>
            <DistributedSensingSimulator />
        </div>
    );
};

/* =========================================
   8. PROBLEM SOLVER
   ========================================= */

/* =========================================
   9. COMPLETE LABORATORY SETUP (Simulation Walkthrough)
   ========================================= */

const LaboratorySetup = () => {
    const [activeComp, setActiveComp] = useState(null);
    const [temp, setTemp] = useState(25);

    const components = [
        { id: 'laser', name: '1064nm Laser', icon: <Zap />, principle: 'Source', desc: 'Provides the high-coherence seeding beam for the entire sensing system.' },
        { id: 'isolator', name: 'Isolator', icon: <ArrowLeft />, principle: 'Non-Reciprocity', desc: 'Prevents destructive back-reflections from reaching the laser cavity.' },
        { id: 'wdm', name: '976/1064 WDM', icon: <Share2 />, principle: 'Multiplexing', desc: 'Combines the 976nm pump power with the 1064nm signal.' },
        { id: 'amplifier', name: 'YDF / EDFA', icon: <Activity />, principle: 'Stimulated Emission', desc: 'The gain medium where Ytterbium ions amplify the optical signal.' },
        { id: 'coupler', name: '99:1 Coupler', icon: <Share2 />, principle: 'Power Splitting', desc: 'Taps off 1% of the signal for auxiliary monitoring without stopping the flow.' },
        { id: 'circulator', name: 'Circulator', icon: <RefreshCw />, principle: 'Directional Routing', desc: 'Routes signal to the FUT and captures backscatter for analysis.' },
        { id: 'fut', name: 'Fiber Under Test', icon: <Globe />, principle: 'Elastic Sensing', desc: 'The sensing fiber (HI1060). Distal perturbations change the Brillouin shift.' },
        { id: 'esa', name: 'ESA / Analyzer', icon: <Activity />, principle: 'Spectral Analysis', desc: 'Extracts the frequency-domain characteristics of the returned signal.' },
    ];

    // Brillouin Shift Calculation: vB = (2 * n * V_a) / lambda
    // Approximate shift: 11GHz base, ~1MHz/degC shift
    const vBase = 11.0; // GHz
    const shiftScale = 0.0012; // GHz/°C
    const currentShift = vBase + (temp - 25) * shiftScale;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-16">
            <header>
                <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Laboratory 04</Badge><Badge variant="navy">Section 09</Badge></div>
                <h2 className="text-6xl font-black text-navy tracking-tighter mb-8 uppercase italic leading-[0.9]">Architectural <span className="text-indigo-600 block text-8xl">Setup</span></h2>
                <div className="space-y-6 max-w-4xl border-l-4 border-indigo-600 pl-8">
                    <p className="text-slate-500 font-bold leading-relaxed text-xl italic leading-tight">"A masterclass in synthesizing individual components into a coherent sensing pipeline."</p>
                    <p className="text-slate-500 font-medium leading-relaxed">This simulation reproduces the industry-standard Brillouin Distributed Fiber Sensor (BDFS) setup. By managing power, directionality, and amplification, we can detect temperature variations kilometers away via non-linear light interaction in the fiber core.</p>
                </div>
            </header>

            <section className="relative p-10 bg-white border border-slate-100 rounded-[4rem] shadow-2xl overflow-hidden min-h-[600px] flex flex-col justify-between">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-12">Interactive Optical Bench (The Laboratory)</div>
                
                {/* Visual Flow Diagram */}
                <div className="relative flex flex-wrap justify-between gap-4 py-20 px-8 border-y-2 border-slate-50">
                    <div className="absolute top-1/2 left-0 w-full h-[6px] bg-slate-100 -translate-y-1/2 -z-10 rounded-full overflow-hidden">
                         <div className="h-full bg-gradient-to-r from-indigo-500 via-rose-400 to-indigo-500 animate-pulse w-[200%]" />
                    </div>

                    {components.map((comp, idx) => (
                        <div key={comp.id} onMouseEnter={() => setActiveComp(comp)} onMouseLeave={() => setActiveComp(null)}
                            className={`relative w-24 h-24 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-500 group ${activeComp?.id === comp.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 -translate-y-4' : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-indigo-600'}`}>
                            <div className={`p-4 rounded-2xl ${activeComp?.id === comp.id ? 'bg-white/20' : 'bg-slate-50'}`}>{comp.icon}</div>
                            <span className="text-[8px] font-black uppercase tracking-tight text-center px-1">{comp.name}</span>
                            <div className="absolute -bottom-2 w-1.5 h-1.5 bg-indigo-600 rounded-full scale-0 group-hover:scale-100 transition-transform" />
                        </div>
                    ))}
                </div>

                {/* Component Intelligence Card */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 items-end">
                    <Card className={`p-10 transition-all duration-700 bg-white border-slate-100 min-h-[250px] flex flex-col justify-center ${activeComp ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-50 translate-y-4'}`}>
                        {activeComp ? (
                            <div className="space-y-6">
                                <Badge variant="indigo">{activeComp.principle}</Badge>
                                <h4 className="text-4xl font-black text-navy uppercase italic">{activeComp.name}</h4>
                                <p className="text-slate-500 font-medium text-lg leading-relaxed">{activeComp.desc}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                                <Search className="w-12 h-12 text-slate-200" />
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Hover over a component to inspect physics logic</p>
                            </div>
                        )}
                    </Card>

                    <Card className="p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl space-y-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><Activity className="w-32 h-32" /></div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest">Spectral Logic</h4>
                                <div className="text-[10px] text-slate-500 font-bold uppercase">Brillouin Frequency Shift (vB)</div>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-black italic text-indigo-400">{currentShift.toFixed(4)} <span className="text-xs not-italic uppercase opacity-50">GHz</span></div>
                            </div>
                        </div>

                        {/* Frequency Shift Plot Inset (Mirroring the Image) */}
                        <div className="h-48 relative border-b border-l border-slate-700 flex items-end px-12 overflow-hidden bg-slate-800/50 rounded-2xl p-6">
                            <div className="absolute inset-0 grid grid-cols-5 border-slate-800/30"></div>
                            {/* The Frequency Peaks */}
                            <div className="absolute bottom-0 w-[4px] h-[80%] bg-indigo-500 blur-[2px] transition-all duration-1000 ease-out" 
                                style={{ left: `${20 + (temp/2)}%` }} />
                            <div className="absolute bottom-0 w-[120px] transition-all duration-1000 ease-out" 
                                style={{ left: `${20 + (temp/2) - 60}%` }}>
                                <svg viewBox="0 0 100 100" className="w-full h-24 overflow-visible">
                                    <path d="M 0 100 Q 50 0 100 100" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
                                    <path d="M 0 100 Q 50 10 100 100" fill="url(#grad)" />
                                    <defs>
                                        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            <div className="absolute bottom-4 left-6 text-[8px] font-black uppercase text-slate-500 transform -rotate-90">Intensity</div>
                            <div className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-slate-500 italic">Frequency (ν_B)</div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase flex justify-between"><span>Environmental Temperature Variance (ΔT)</span><span className="text-rose-400">{temp}°C</span></label>
                            <input type="range" min="-50" max="150" value={temp} onChange={e => setTemp(parseFloat(e.target.value))} className="w-full h-1.5 accent-rose-600 rounded-full appearance-none bg-slate-800" />
                        </div>
                    </Card>
                </div>
            </section>
            
            <section className="bg-indigo-50/30 p-10 rounded-[3rem] border border-indigo-100/50">
                 <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">Physics Correlation: The BDFS Formula</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <MathBlock math="\nu_B(T) = \nu_B(T_0) + C_T(T - T_0)" label="Brillouin Shift vs Temperature" />
                    <p className="text-xs text-slate-500 leading-relaxed font-medium pt-2">The shift in frequency is strictly linear with temperature in the typical operating range. For standard SMF-28 fiber at 1550nm, the thermal coefficient <MathInline math="C_T" /> is approximately <MathInline math="1.2 \text{ MHz/}^\circ\text{C}" />. This allows the fiber to act as a <strong>Distributed Temperature Sensor (DTS)</strong> over stretches as long as 100km.</p>
                 </div>
            </section>
        </div>
    );
};

const ProblemSolver = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
            <header>
                <div className="flex items-center gap-3 mb-6"><Badge variant="gold">System Evaluation</Badge><Badge variant="navy">Section 08</Badge></div>
                <h2 className="text-5xl md:text-6xl font-black text-navy tracking-tight mb-6">Expert <span className="text-gold italic">Problem Solver</span></h2>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 border-slate-200">
                    <Badge variant="navy" className="mb-4">Unit SI-01</Badge>
                    <h4 className="text-xl font-black text-navy mb-4 tracking-tight">FBG Sensitivity</h4>
                    <p className="text-slate-500 font-medium mb-6 italic">"Estimate wavelength shift for λ=1550nm FBG at 100°C if ξ=6.7e-6 and α=0.5e-6."</p>
                    <div className="p-4 bg-navy text-white rounded-xl font-mono text-xs border-none">
                        <span className="text-indigo-300 font-black">SOL:</span> <MathInline math="\Delta\lambda = 1550 \cdot (7.2\text{e-}6) \cdot (100-25) \approx 0.837 \text{ nm}" />
                    </div>
                </Card>
                <Card className="p-8 border-slate-200">
                    <Badge variant="navy" className="mb-4">Unit NT-02</Badge>
                    <h4 className="text-xl font-black text-navy mb-4 tracking-tight">Circulator Budget</h4>
                    <p className="text-slate-500 font-medium mb-6 italic">"If P1→P2 loss is 1.2dB and P2→P3 is 1.5dB, calculate the received power at Port 3 if a signal enters Port 1 at +3dBm and reflects perfectly at Port 2."</p>
                    <div className="p-4 bg-navy text-white rounded-xl font-mono text-xs border-none">
                        <span className="text-indigo-300 font-black">SOL:</span> <MathInline math="P_{\text{out}} = 3\text{dBm} - 1.2\text{dB} - 1.5\text{dB} = +0.3 \text{ dBm} (\approx 1.07 \text{ mW})" />
                    </div>
                </Card>
            </div>
        </div>
    );
};

/* =========================================
   MODULE 4 HUB
   ========================================= */
export default function Module4Systems({ onBack }) {
    const [activeSection, setActiveSection] = useState('sagnac');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const sections = [
        { id: 'sagnac', title: '1. Sagnac Gyro', icon: <RotateCw className="w-4 h-4" /> },
        { id: 'fbg', title: '2. Bragg Sandbox', icon: <Thermometer className="w-4 h-4" /> },
        { id: 'sensors', title: '3. Optic Sensors', icon: <Search className="w-4 h-4" /> },
        { id: 'traffic', title: '4. Traffic Control', icon: <RefreshCw className="w-4 h-4" /> },
        { id: 'couplers', title: '5. Fiber Couplers', icon: <Share2 className="w-4 h-4" /> },
        { id: 'amplifiers', title: '6. Amp vs Regen', icon: <Zap className="w-4 h-4" /> },
        { id: 'distributed', title: '7. Coherent Sensing', icon: <Globe className="w-4 h-4" /> },
        { id: 'quiz', title: '8. Problem Solver', icon: <PenTool className="w-4 h-4" /> },
        { id: 'setup', title: '9. Laboratory Setup', icon: <Activity className="w-4 h-4" /> },
    ];

    return (
        <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-body">
            {/* Sidebar — Corporate Lab Style */}
            <nav className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-72 h-full glass-navy flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl border-y-0 border-l-0`}>
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                    <button onClick={onBack} className="group flex items-center gap-4 text-slate-400 hover:text-white transition-all mb-12 w-full">
                        <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-indigo-600 transition-colors border border-white/10">
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Hub Menu</span>
                    </button>

                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 px-1">Unit 04: Systems</div>
                    <div className="space-y-2">
                        {sections.map(s => (
                            <button key={s.id} onClick={() => { setActiveSection(s.id); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 text-left group ${activeSection === s.id
                                        ? 'bg-white/90 glass-card text-navy shadow-xl scale-105 z-10'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                    }`}>
                                <span className={`${activeSection === s.id ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-300'}`}>{s.icon}</span>
                                <span className="font-bold text-sm tracking-tight">{s.title}</span>
                                {activeSection === s.id && <ChevronRight className="w-4 h-4 ml-auto text-indigo-600" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t border-white/5">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shrink-0">
                            <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-white uppercase tracking-wider">Module 04</div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Optical Systems</div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area — Stark White */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-10 md:px-12 md:py-16 scroll-smooth">
                    <div className="max-w-6xl mx-auto pb-32">
                        {activeSection === 'sagnac' && <SagnacLab />}
                        {activeSection === 'fbg' && <BraggView />}
                        {activeSection === 'sensors' && <SensorMasterclass />}
                        {activeSection === 'traffic' && <TrafficMasterclass />}
                        {activeSection === 'couplers' && <CouplerMasterclass />}
                        {activeSection === 'amplifiers' && <AmplifiersMasterclass />}
                        {activeSection === 'distributed' && <SensingSetupMasterclass />}
                        {activeSection === 'quiz' && <ProblemSolver />}
                        {activeSection === 'setup' && <LaboratorySetup />}
                    </div>
                </div>
            </main>
        </div>
    );
}