import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

interface ConfettiProps {
  trigger: number;
}

const Confetti: React.FC<ConfettiProps> = ({ trigger }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationId = useRef<number | null>(null);

  useEffect(() => {
    if (trigger === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#3b82f6', '#8b5cf6', '#10b981'];

    // Spawn particles
    const newParticles: Particle[] = Array(40).fill(null).map(() => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 80
    }));

    particles.current = [...particles.current, ...newParticles];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let active = false;
      particles.current.forEach(p => {
        if (p.life > 0) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.5; // gravity
          p.life--;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, 6, 6);
          active = true;
        }
      });
      
      // Cleanup dead particles occasionally to prevent array bloat if running long term
      if (particles.current.length > 200) {
         particles.current = particles.current.filter(p => p.life > 0);
      }

      if (active) {
        animationId.current = requestAnimationFrame(draw);
      }
    };

    if (animationId.current) cancelAnimationFrame(animationId.current);
    draw();

    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, [trigger]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[150]" />;
};

export default Confetti;