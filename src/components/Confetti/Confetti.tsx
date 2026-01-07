import { useEffect, useRef, useCallback } from 'react';

interface ConfettiParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  opacity: number;
  decay: number;
}

const CONFETTI_COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

interface ConfettiProps {
  trigger: boolean;
  originX?: number;
  originY?: number;
  onComplete?: () => void;
}

export function Confetti({ trigger, originX, originY, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationRef = useRef<number | null>(null);

  const createParticle = useCallback((x: number, y: number): ConfettiParticle => ({
    x,
    y,
    size: Math.random() * 8 + 4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    velocityX: (Math.random() - 0.5) * 15,
    velocityY: Math.random() * -15 - 5,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    gravity: 0.3,
    opacity: 1,
    decay: 0.015,
  }), []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter(p => p.opacity > 0);

    particlesRef.current.forEach(p => {
      // Update physics
      p.velocityY += p.gravity;
      p.x += p.velocityX;
      p.y += p.velocityY;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;

      // Draw particle
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });

    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onComplete?.();
    }
  }, [onComplete]);

  const triggerConfetti = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize canvas to window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles from the origin point
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push(createParticle(x, y));
    }

    // Start animation if not already running
    if (!animationRef.current) {
      animate();
    }
  }, [createParticle, animate]);

  // Trigger confetti when prop changes
  useEffect(() => {
    if (trigger) {
      const x = originX ?? window.innerWidth / 2;
      const y = originY ?? window.innerHeight / 3;
      triggerConfetti(x, y);
    }
  }, [trigger, originX, originY, triggerConfetti]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="confetti-canvas"
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
}
