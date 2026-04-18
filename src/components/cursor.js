import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const ringExpand = keyframes`
  to { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
`;

const Dot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  background: #4f46e5;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: width 0.2s ease, height 0.2s ease, background 0.2s ease;
  will-change: transform;

  &.hovering {
    width: 10px;
    height: 10px;
    background: #a855f7;
  }
`;

const Ring = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  border: 1.5px solid rgba(79, 70, 229, 0.45);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  will-change: transform;
  transition: width 0.25s ease, height 0.25s ease, border-color 0.25s ease;

  &.hovering {
    width: 52px;
    height: 52px;
    border-color: rgba(168, 85, 247, 0.5);
  }
`;

const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.style.cursor = 'none';

    const onMove = e => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = () => {
      hovering.current = true;
      dotRef.current?.classList.add('hovering');
      ringRef.current?.classList.add('hovering');
    };

    const onLeave = () => {
      hovering.current = false;
      dotRef.current?.classList.remove('hovering');
      ringRef.current?.classList.remove('hovering');
    };

    window.addEventListener('mousemove', onMove);

    const attachListeners = () => {
      document.querySelectorAll('a, button, [role="button"], [tabindex]').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attachListeners();

    // Re-attach when DOM changes (e.g. scroll reveals)
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    let raf;
    const animate = () => {
      // Dot snaps to cursor
      if (dotRef.current) {
        dotRef.current.style.left = pos.current.x + 'px';
        dotRef.current.style.top  = pos.current.y + 'px';
      }
      // Ring lags behind
      ring.current.x += (pos.current.x - ring.current.x) * 0.14;
      ring.current.y += (pos.current.y - ring.current.y) * 0.14;
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px';
        ringRef.current.style.top  = ring.current.y + 'px';
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <Dot ref={dotRef} />
      <Ring ref={ringRef} />
    </>
  );
};

export default Cursor;
