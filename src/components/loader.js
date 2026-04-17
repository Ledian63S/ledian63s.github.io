import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';

const fillBar = keyframes`
  0%   { width: 0%; }
  70%  { width: 85%; }
  90%  { width: 96%; }
  100% { width: 100%; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const StyledContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;

  ${({ leaving }) =>
    leaving &&
    css`
      animation: ${fadeOut} 0.45s ease forwards;
    `}
`;

const StyledCount = styled.span`
  font-family: 'Space Grotesk', 'Calibre', sans-serif;
  font-size: 72px;
  font-weight: 700;
  color: #4f46e5;
  letter-spacing: -2px;
  line-height: 1;
  min-width: 3ch;
  text-align: center;
`;

const TrackWrap = styled.div`
  width: 160px;
  height: 2px;
  background: #e2e8f8;
  border-radius: 2px;
  overflow: hidden;
`;

const Bar = styled.div`
  height: 100%;
  background: #4f46e5;
  border-radius: 2px;
  width: 0%;
  animation: ${fillBar} 1.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
`;

const Loader = ({ finishLoading }) => {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const DURATION = 1700;
    let raf;

    const tick = () => {
      const progress = Math.min((Date.now() - start) / DURATION, 1);
      setCount(Math.round(progress * 100));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setLeaving(true);
          setTimeout(finishLoading, 460);
        }, 100);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <StyledContainer leaving={leaving}>
      <Helmet bodyAttributes={{ class: 'hidden' }} />
      <StyledCount>{count}</StyledCount>
      <TrackWrap>
        <Bar />
      </TrackWrap>
    </StyledContainer>
  );
};

Loader.propTypes = {
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;
