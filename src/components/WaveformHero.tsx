'use client';

import { useRef, useEffect } from 'react';

interface Wave {
  frequency: number;
  amplitude: number;
  speed: number;
  opacity: number;
  phase: number;
}

const WAVES: Wave[] = [
  { frequency: 0.008, amplitude: 0.35, speed: 0.015, opacity: 0.6, phase: 0 },
  { frequency: 0.012, amplitude: 0.25, speed: 0.022, opacity: 0.4, phase: 2 },
  { frequency: 0.018, amplitude: 0.18, speed: 0.028, opacity: 0.25, phase: 4 },
  { frequency: 0.025, amplitude: 0.12, speed: 0.035, opacity: 0.15, phase: 1 },
];

const ACCENT = { r: 0, g: 229, b: 204 }; // #00E5CC

export default function WaveformHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!running) return;

      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const centerY = h * 0.5;

      ctx.clearRect(0, 0, w, h);

      for (const wave of WAVES) {
        ctx.beginPath();
        ctx.moveTo(0, centerY);

        for (let x = 0; x <= w; x += 2) {
          const y =
            centerY +
            Math.sin(x * wave.frequency + timeRef.current * wave.speed + wave.phase) *
              h *
              wave.amplitude +
            Math.sin(x * wave.frequency * 0.5 + timeRef.current * wave.speed * 1.3) *
              h *
              wave.amplitude *
              0.3;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${wave.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw filled area beneath the wave
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const gradient = ctx.createLinearGradient(0, centerY - h * wave.amplitude, 0, h);
        gradient.addColorStop(0, `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${wave.opacity * 0.15})`);
        gradient.addColorStop(1, `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Visualizer bars (subtle vertical lines that pulse)
      const barCount = Math.floor(w / 8);
      for (let i = 0; i < barCount; i++) {
        const x = (i / barCount) * w;
        const barHeight =
          Math.abs(Math.sin(i * 0.15 + timeRef.current * 0.02)) *
          h *
          0.12 *
          Math.abs(Math.sin(i * 0.08 + timeRef.current * 0.01));

        ctx.fillStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${0.04 + barHeight / h * 0.15})`;
        ctx.fillRect(x, centerY - barHeight, 2, barHeight * 2);
      }

      timeRef.current += 1;
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
