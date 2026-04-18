import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
`;

const RippleBackground = () => {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);
  const mouseRef = useRef({ x: -1, y: -1 });
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;
    const ctx = canvas.getContext('2d');
    let raf;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Soft drifting bulbs
    const bulbs = [
      { x: 0.18, y: 0.22, r: 420, color: [79, 70, 229],  alpha: 0.08, vx: 0.00055, vy: 0.00038 },
      { x: 0.78, y: 0.68, r: 380, color: [168, 85, 247], alpha: 0.07, vx: -0.00045, vy: -0.00050 },
      { x: 0.52, y: 0.12, r: 320, color: [236, 72, 153], alpha: 0.06, vx: 0.00035, vy: 0.00060 },
    ];

    // Mouse ripples
    const onMove = e => {
      const now = performance.now();
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (now - lastSpawnRef.current > 80) {
        ripplesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          r: 0,
          alpha: 0.55,
          speed: 2.8 + Math.random() * 1.6,
          width: 1.5,
          color: Math.random() > 0.45 ? [79, 70, 229] : [139, 92, 246],
        });
        lastSpawnRef.current = now;
      }
    };
    window.addEventListener('mousemove', onMove);

    const ambientInterval = setInterval(() => {
      const w = canvas.width;
      const h = canvas.height;
      ripplesRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0,
        alpha: 0.18,
        speed: 1.2 + Math.random() * 0.8,
        width: 1,
        color: [99, 102, 241],
      });
    }, 1800);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      // Draw bulbs — positions stored as 0-1 fractions, drift and wrap gently
      bulbs.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;
        // Slow bounce at edges
        if (b.x < -0.1 || b.x > 1.1) b.vx *= -1;
        if (b.y < -0.1 || b.y > 1.1) b.vy *= -1;

        // Gentle breathe
        const breathe = 0.85 + 0.15 * Math.sin(t * 0.008 + b.r);
        const px = b.x * w;
        const py = b.y * h;
        const pr = b.r * breathe;

        const g = ctx.createRadialGradient(px, py, 0, px, py, pr);
        g.addColorStop(0,   `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.alpha})`);
        g.addColorStop(0.5, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.alpha * 0.4})`);
        g.addColorStop(1,   `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });

      // Draw ripples
      ripplesRef.current = ripplesRef.current.filter(rip => rip.alpha > 0.005);
      ripplesRef.current.forEach(rip => {
        rip.r += rip.speed;
        rip.alpha *= 0.964;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rip.color[0]}, ${rip.color[1]}, ${rip.color[2]}, ${rip.alpha})`;
        ctx.lineWidth = rip.width;
        ctx.stroke();
      });

      // Cursor glow
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      if (mx >= 0) {
        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        glow.addColorStop(0,   'rgba(99, 102, 241, 0.12)');
        glow.addColorStop(0.5, 'rgba(99, 102, 241, 0.04)');
        glow.addColorStop(1,   'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }

      t++;
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(ambientInterval);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <Canvas ref={canvasRef} />;
};

export default RippleBackground;
