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

const PALETTE = ['#4f46e5', '#7c3aed', '#ec4899', '#2563eb', '#0891b2'];
const COUNT = 200;

function fieldAngle(x, y, t) {
  const nx = x * 0.0018;
  const ny = y * 0.0018;
  return (
    Math.sin(nx * 3.2 + t * 0.35) * Math.cos(ny * 2.6 + t * 0.28) +
    Math.sin(nx * 1.4 + t * 0.48) * Math.cos(ny * 3.8 + t * 0.22)
  ) * Math.PI;
}

class Particle {
  constructor(w, h) {
    this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    this.reset(w, h);
  }

  reset(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = 0;
    this.vy = 0;
    this.age = 0;
    this.maxAge = 120 + Math.random() * 120;
  }

  update(t, w, h, mx, my) {
    const a = fieldAngle(this.x, this.y, t);
    this.vx = this.vx * 0.92 + Math.cos(a) * 0.22;
    this.vy = this.vy * 0.92 + Math.sin(a) * 0.22;

    const dx = this.x - mx;
    const dy = this.y - my;
    const d2 = dx * dx + dy * dy;
    if (d2 < 7000 && d2 > 0) {
      const d = Math.sqrt(d2);
      const f = ((84 - d) / 84) * 0.45;
      this.vx += (dx / d) * f;
      this.vy += (dy / d) * f;
    }

    const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (spd > 1.9) {
      this.vx = (this.vx / spd) * 1.9;
      this.vy = (this.vy / spd) * 1.9;
    }

    this.x += this.vx;
    this.y += this.vy;
    this.age++;

    if (
      this.age > this.maxAge ||
      this.x < -10 || this.x > w + 10 ||
      this.y < -10 || this.y > h + 10
    ) {
      this.reset(w, h);
    }
  }

  draw(ctx) {
    const alpha = Math.sin((this.age / this.maxAge) * Math.PI) * 0.28;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

const FlowField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;

    const ctx = canvas.getContext('2d');
    let raf;
    let t = 0;
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const particles = Array.from(
      { length: COUNT },
      () => new Particle(canvas.width, canvas.height),
    );

    const animate = () => {
      const { width: w, height: h } = canvas;

      ctx.fillStyle = 'rgba(255,255,255,0.20)';
      ctx.fillRect(0, 0, w, h);

      particles.forEach(p => {
        p.update(t, w, h, mouse.x, mouse.y);
        p.draw(ctx);
      });

      ctx.globalAlpha = 1;
      t += 0.012;
      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <Canvas ref={canvasRef} />;
};

export default FlowField;
