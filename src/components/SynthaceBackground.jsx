import React from 'react';

/**
 * SynthaceBackground — Refactored for a premium Glassmorphism aesthetic.
 * Features vibrant, animated blobs that provide the "backlight" for glass elements.
 */
const SynthaceBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-[#f8faff]">
      {/* Soft Pastel Backlight Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] max-w-[800px] rounded-full bg-periwinkle/15 blur-[120px] animate-blob" />
      <div className="absolute top-[20%] left-[-10%] w-[55vw] h-[55vw] max-w-[700px] rounded-full bg-lavender/10 blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vw] max-w-[650px] rounded-full bg-pink-400/10 blur-[110px] animate-blob animation-delay-4000" />
      <div className="absolute top-[40%] right-[20%] w-[40vw] h-[40vw] max-w-[500px] rounded-full bg-blue-400/10 blur-[90px] animate-blob" />

      {/* Subtle Texture Layers */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: 'radial-gradient(#6366f1 0.5px, transparent 0.5px)', 
        backgroundSize: '32px 32px' 
      }} />

      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />
    </div>
  );
};

export default SynthaceBackground;
