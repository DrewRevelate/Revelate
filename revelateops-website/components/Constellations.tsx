'use client';

import { useEffect, useRef } from 'react';

interface ConstellationsProps {
  density?: 'low' | 'medium' | 'high';
  className?: string;
}

export default function Constellations({ density = 'medium', className = '' }: ConstellationsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Star configuration based on density
    const starCounts = {
      low: 50,
      medium: 100,
      high: 150,
    };

    const starCount = starCounts[density];
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Star class
    class Star {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      twinkleSpeed: number;
      twinklePhase: number;

      constructor() {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.radius = Math.random() * 1.5 + 0.5; // 0.5 to 2px
        this.opacity = Math.random() * 0.5 + 0.3; // 0.3 to 0.8
        this.twinkleSpeed = Math.random() * 0.02 + 0.01; // Slow twinkle
        this.twinklePhase = Math.random() * Math.PI * 2;
      }

      update() {
        // Twinkle effect
        this.twinklePhase += this.twinkleSpeed;
        const currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(this.twinklePhase));
        return currentOpacity;
      }

      draw(ctx: CanvasRenderingContext2D, opacity: number) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        // Create a subtle glow
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 3
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(0, 217, 255, ${opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 217, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Create stars
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        const opacity = star.update();
        star.draw(ctx, opacity);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      style={{ opacity: 0.4 }}
    />
  );
}
