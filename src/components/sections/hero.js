import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { email } from '@config';
import styled, { keyframes } from 'styled-components';
import { theme, mixins, media, Section } from '@styles';
const { colors, fontSizes, fonts, navDelay, loaderDelay } = theme;

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

function useScramble(target, active, duration = 1600) {
  const [display, setDisplay] = useState('');
  const rafRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const resolved = Math.floor(progress * target.length);
      setDisplay(
        target.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < resolved) return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join(''),
      );
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);
  return display;
}

const gradientMove = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;


const toastSlide = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const StyledContainer = styled(Section)`
  ${mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  ${media.tablet`padding-top: 150px;`};
  div {
    width: 100%;
  }
`;


const StyledOverline = styled.h1`
  color: ${colors.green};
  margin: 0 0 16px 3px;
  font-size: ${fontSizes.md};
  font-family: ${fonts.SFMono};
  font-weight: normal;
  letter-spacing: 0.08em;
  ${media.desktop`font-size: ${fontSizes.sm};`};
  ${media.tablet`font-size: ${fontSizes.smish};`};
`;

const StyledTitle = styled.h2`
  font-size: 72px;
  line-height: 1.05;
  margin: 0;
  font-weight: 700;
  background: linear-gradient(120deg, #0f172a 0%, #1e293b 25%, #4f46e5 55%, #a855f7 75%, #ec4899 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientMove} 6s ease infinite;
  font-family: ${fonts.Calibre};
  ${media.desktop`font-size: 60px;`};
  ${media.tablet`font-size: 50px;`};
  ${media.phablet`font-size: 42px;`};
  ${media.phone`font-size: 34px;`};
`;

const StyledSubtitle = styled.h3`
  font-size: 40px;
  line-height: 1.2;
  margin: 8px 0 0;
  color: ${colors.slate};
  font-weight: 500;
  ${media.desktop`font-size: 34px;`};
  ${media.tablet`font-size: 28px;`};
  ${media.phablet`font-size: 24px;`};
  ${media.phone`font-size: 20px;`};
`;

const StyledDescription = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 540px;
  color: ${colors.slate};
  font-size: ${fontSizes.lg};
  line-height: 1.6;
  a {
    ${mixins.inlineLink};
  }
`;

const StyledEmailLink = styled.button`
  display: inline-block;
  margin-top: 36px;
  padding: 1.1rem 2.2rem;
  background: ${colors.green};
  color: #fff;
  border: none;
  border-radius: 6px;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.sm};
  font-weight: 500;
  text-decoration: none;
  cursor: none;
  transition: background 0.25s ease, box-shadow 0.25s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  letter-spacing: 0.05em;
  .arrow {
    display: inline-block;
    margin-left: 8px;
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  }
  &:hover,
  &:focus {
    background: #4338ca;
    color: #fff;
    box-shadow: 0 8px 24px rgba(79, 70, 229, 0.35);
    .arrow { transform: translateX(5px); }
  }
  &:after { display: none !important; }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 22px;
  background: #1e293b;
  color: #fff;
  border-radius: 8px;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.xs};
  letter-spacing: 0.04em;
  z-index: 100;
  pointer-events: none;
  animation: ${toastSlide} 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.25);

  span {
    color: ${colors.green};
  }
`;

const useMagnetic = () => {
  const ref = useRef(null);
  const onMouseMove = e => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    el.style.transform = `translate(${(e.clientX - cx) * 0.28}px, ${(e.clientY - cy) * 0.28}px)`;
  };
  const onMouseLeave = () => { if (ref.current) ref.current.style.transform = ''; };
  return { ref, onMouseMove, onMouseLeave };
};

const Hero = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const magnetic = useMagnetic();

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const { frontmatter, html } = data[0].node;
  const scrambledName = useScramble(frontmatter.name + '.', isMounted, 1800);

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    } else {
      window.location.href = `mailto:${email}`;
    }
  };

  const items = [
    <StyledOverline>Business Central Developer</StyledOverline>,
    <StyledTitle>{scrambledName}</StyledTitle>,
    <StyledSubtitle>{frontmatter.subtitle}</StyledSubtitle>,
    <StyledDescription dangerouslySetInnerHTML={{ __html: html }} />,
    <div>
      <StyledEmailLink
        ref={magnetic.ref}
        onMouseMove={magnetic.onMouseMove}
        onMouseLeave={magnetic.onMouseLeave}
        onClick={handleCopyEmail}>
        Let's Get In Touch! <span className="arrow">→</span>
      </StyledEmailLink>
    </div>,
  ];

  return (
    <StyledContainer>
      <TransitionGroup component={null}>
        {isMounted &&
          items.map((item, i) => (
            <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
              <div style={{ transitionDelay: `${i * 100}ms` }}>{item}</div>
            </CSSTransition>
          ))}
      </TransitionGroup>
      {copied && (
        <Toast>
          <span>{email}</span> copied to clipboard!
        </Toast>
      )}
    </StyledContainer>
  );
};

Hero.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Hero;
