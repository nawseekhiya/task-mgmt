import { useEffect, useRef, useCallback } from 'react';

type ParticleShape = 'circle' | 'star' | 'square' | 'diamond' | 'sparkle';

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
  shape: ParticleShape;
  wobble: number;
  wobbleSpeed: number;
  scale: number;
  scaleSpeed: number;
}

// Modern, vibrant color palette
const CONFETTI_COLORS = [
  '#10b981', // emerald (success - primary)
  '#34d399', // mint
  '#6ee7b7', // light green
  '#f59e0b', // amber (accent)
  '#fbbf24', // yellow
  '#a78bfa', // purple
  '#f472b6', // pink
  '#60a5fa', // blue
];

interface ConfettiConfig {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  elementCount?: number;
  decay?: number;
  scalar?: number;
}

interface ConfettiProps {
  trigger: boolean;
  cardRect?: DOMRect;
  config?: ConfettiConfig;
  onComplete?: () => void;
}

export function Confetti({ trigger, cardRect, config, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationRef = useRef<number | null>(null);
  const triggerCountRef = useRef(0);

  const shapes: ParticleShape[] = ['circle', 'star', 'square', 'diamond', 'sparkle'];

  // Get a random point along the card's border
  const getPointOnBorder = useCallback((rect: DOMRect): { x: number; y: number; angle: number } => {
    const perimeter = 2 * (rect.width + rect.height);
    const randomPos = Math.random() * perimeter;
    
    let x: number, y: number, angle: number;
    
    if (randomPos < rect.width) {
      // Top edge
      x = rect.left + randomPos;
      y = rect.top;
      angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8; // Upward
    } else if (randomPos < rect.width + rect.height) {
      // Right edge
      x = rect.right;
      y = rect.top + (randomPos - rect.width);
      angle = 0 + (Math.random() - 0.5) * 0.8; // Rightward
    } else if (randomPos < 2 * rect.width + rect.height) {
      // Bottom edge
      x = rect.right - (randomPos - rect.width - rect.height);
      y = rect.bottom;
      angle = Math.PI / 2 + (Math.random() - 0.5) * 0.8; // Downward
    } else {
      // Left edge
      x = rect.left;
      y = rect.bottom - (randomPos - 2 * rect.width - rect.height);
      angle = Math.PI + (Math.random() - 0.5) * 0.8; // Leftward
    }
    
    return { x, y, angle };
  }, []);

  const createParticle = useCallback((x: number, y: number, outwardAngle: number): ConfettiParticle => {
    const scalar = config?.scalar ?? 1;
    const baseVelocity = config?.startVelocity ?? 4;
    
    // Scale velocity
    const velocity = (Math.random() * baseVelocity + 2) * scalar;
    
    return {
      x,
      y,
      size: (Math.random() * 4 + 2) * scalar, // Scale size
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      velocityX: Math.cos(outwardAngle) * velocity,
      velocityY: Math.sin(outwardAngle) * velocity - 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      gravity: 0.08 * scalar, // Scale gravity
      opacity: 1,
      decay: (0.02 + Math.random() * 0.015) * (1 / scalar), // Slower decay for smaller particles
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.1 + Math.random() * 0.1,
      scale: 1,
      scaleSpeed: (Math.random() - 0.5) * 0.02,
    };
  }, [config]);

  const drawShape = useCallback((ctx: CanvasRenderingContext2D, p: ConfettiParticle) => {
    const s = p.size * p.scale;
    
    switch (p.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'star':
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
          const innerAngle = angle + Math.PI / 5;
          const outerRadius = s / 2;
          const innerRadius = s / 4;
          
          if (i === 0) {
            ctx.moveTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
          } else {
            ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
          }
          ctx.lineTo(Math.cos(innerAngle) * innerRadius, Math.sin(innerAngle) * innerRadius);
        }
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'square':
        ctx.fillRect(-s / 2, -s / 4, s, s / 2);
        break;
        
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(0, -s / 2);
        ctx.lineTo(s / 3, 0);
        ctx.lineTo(0, s / 2);
        ctx.lineTo(-s / 3, 0);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'sparkle':
        ctx.beginPath();
        const points = 4;
        for (let i = 0; i < points * 2; i++) {
          const angle = (i * Math.PI) / points;
          const radius = i % 2 === 0 ? s / 2 : s / 6;
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        break;
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter(p => p.opacity > 0.02);

    particlesRef.current.forEach(p => {
      p.wobble += p.wobbleSpeed;
      p.velocityY += p.gravity;
      p.velocityX *= 0.99;
      p.x += p.velocityX + Math.sin(p.wobble) * 0.3;
      p.y += p.velocityY;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;
      p.scale += p.scaleSpeed;
      p.scale = Math.max(0.5, Math.min(1.5, p.scale));

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      
      ctx.shadowBlur = 4;
      ctx.shadowColor = p.color;
      
      ctx.fillStyle = p.color;
      drawShape(ctx, p);
      
      ctx.restore();
    });

    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animationRef.current = null;
      onComplete?.();
    }
  }, [onComplete, drawShape]);

  const triggerConfetti = useCallback((rect: DOMRect) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Spawn particles along the card border
    const particleCount = 35;
    for (let i = 0; i < particleCount; i++) {
      const { x, y, angle } = getPointOnBorder(rect);
      particlesRef.current.push(createParticle(x, y, angle));
    }

    // Second wave with slight delay
    setTimeout(() => {
      for (let i = 0; i < 20; i++) {
        const { x, y, angle } = getPointOnBorder(rect);
        const particle = createParticle(x, y, angle);
        particle.size = Math.random() * 3 + 1.5;
        particlesRef.current.push(particle);
      }
    }, 60);

    if (!animationRef.current) {
      animate();
    }
  }, [createParticle, animate, getPointOnBorder]);

  useEffect(() => {
    if (trigger && cardRect) {
      triggerCountRef.current += 1;
      triggerConfetti(cardRect);
    }
  }, [trigger, cardRect, triggerConfetti]);

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
