import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';

const CIRCUMFERENCE = 2 * Math.PI * 44; // r=44

const drawCircle = keyframes`
  from { stroke-dashoffset: ${CIRCUMFERENCE}; }
  to   { stroke-dashoffset: 0; }
`;

const wordReveal = keyframes`
  from { transform: translateY(110%); }
  to   { transform: translateY(0); }
`;

const fadeInSub = keyframes`
  from { opacity: 0; }
  to   { opacity: 0.5; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const Wrap = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  ${({ leaving }) =>
    leaving &&
    css`
      animation: ${fadeOut} 0.45s ease forwards;
    `}
`;

const RingWrap = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Ring = styled.svg`
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);

  circle {
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-dasharray: ${CIRCUMFERENCE};
    stroke-dashoffset: ${CIRCUMFERENCE};
  }

  .track {
    stroke: rgba(79, 70, 229, 0.1);
    stroke-dashoffset: 0;
  }

  .fill {
    stroke: url(#ringGrad);
    animation: ${drawCircle} 1.6s cubic-bezier(0.65, 0, 0.35, 1) 0.15s forwards;
  }
`;

const Initials = styled.span`
  font-family: 'Space Grotesk', 'Calibre', sans-serif;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, #4f46e5, #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  position: relative;
  z-index: 1;
`;

const NameRow = styled.div`
  display: flex;
  gap: 0.3em;
  font-family: 'Space Grotesk', 'Calibre', sans-serif;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1;
`;

const Mask = styled.span`
  overflow: hidden;
  display: inline-block;
`;

const Word = styled.span`
  display: inline-block;
  transform: translateY(110%);
  color: #0f172a;
  animation: ${wordReveal} 0.65s cubic-bezier(0.77, 0, 0.175, 1) ${p => p.delay}s forwards;

  ${p =>
    p.accent &&
    css`
      background: linear-gradient(110deg, #4f46e5, #a855f7);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    `}
`;

const Sub = styled.div`
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.32em;
  color: #64748b;
  opacity: 0;
  animation: ${fadeInSub} 0.5s ease 1.4s forwards;
`;

const Loader = ({ finishLoading }) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLeaving(true);
      setTimeout(finishLoading, 450);
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <Wrap leaving={leaving}>
      <Helmet bodyAttributes={{ class: 'hidden' }} />

      <RingWrap>
        <Ring viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <circle className="track" cx="50" cy="50" r="44" />
          <circle className="fill"  cx="50" cy="50" r="44" />
        </Ring>
        <Initials>LL</Initials>
      </RingWrap>

      <NameRow>
        <Mask><Word delay={0.9}>Ledian</Word></Mask>
        <Mask><Word delay={1.05} accent>Leka.</Word></Mask>
      </NameRow>

      <Sub>Software Engineer</Sub>
    </Wrap>
  );
};

Loader.propTypes = {
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;
