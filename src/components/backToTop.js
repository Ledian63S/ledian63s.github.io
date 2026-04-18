import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme, mixins } from '@styles';
const { colors } = theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const StyledButton = styled.button`
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${colors.green};
  border: none;
  cursor: none;
  z-index: 20;
  ${mixins.flexCenter};
  box-shadow: 0 4px 16px rgba(79, 70, 229, 0.3);
  transition: background 0.25s ease, box-shadow 0.25s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
  opacity: ${p => (p.visible ? 1 : 0)};
  pointer-events: ${p => (p.visible ? 'auto' : 'none')};
  ${p => p.visible && css`animation: ${fadeIn} 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;`}

  &:hover {
    background: #4338ca;
    box-shadow: 0 8px 24px rgba(79, 70, 229, 0.4);
    transform: translateY(-3px);
  }

  svg {
    width: 18px;
    height: 18px;
    stroke: #fff;
    fill: none;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <StyledButton
      onClick={handleClick}
      visible={visible}
      aria-label="Back to top">
      <svg viewBox="0 0 24 24">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </StyledButton>
  );
};

export default BackToTop;
