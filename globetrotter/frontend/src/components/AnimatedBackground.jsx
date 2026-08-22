import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background">
      {/* Dark overlay to ensure contrast remains strong */}
      <div className="absolute inset-0 bg-background/40 z-10 backdrop-blur-3xl" />
      
      {/* Orb 1 - Top Right - Primary color (Teal) */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/40 rounded-full mix-blend-screen blur-3xl opacity-100 animate-blob" />
      
      {/* Orb 2 - Bottom Left - Accent color (Violet) */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/40 rounded-full mix-blend-screen blur-3xl opacity-100 animate-blob" style={{ animationDelay: '2s' }} />
      
      {/* Orb 3 - Center - Slight purple glow */}
      <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-indigo-500/30 rounded-full mix-blend-screen blur-3xl opacity-80 animate-blob" style={{ animationDelay: '4s' }} />
    </div>
  );
}
