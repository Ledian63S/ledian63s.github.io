import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'gatsby';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { throttle } from '@utils';
import { navLinks, navHeight } from '@config';
import { Menu } from '@components';
import { IconLogo } from '@components/icons';
import styled from 'styled-components';
import { theme, mixins, media } from '@styles';
import { useTheme } from '../context/ThemeContext';
const { colors, fontSizes, fonts, loaderDelay } = theme;

const StyledContainer = styled.header`
  ${mixins.flexBetween};
  position: fixed;
  top: 0;
  padding: 0px 50px;
  background: ${props => props.scrolled ? 'rgba(255,255,255,0.82)' : 'transparent'};
  backdrop-filter: ${props => props.scrolled ? 'blur(12px)' : 'none'};
  -webkit-backdrop-filter: ${props => props.scrolled ? 'blur(12px)' : 'none'};
  box-shadow: ${props => props.scrolled ? '0 1px 0 rgba(0,0,0,0.05)' : 'none'};
  transition: ${theme.transition}, background 0.35s ease, backdrop-filter 0.35s ease, box-shadow 0.35s ease;
  z-index: 11;
  filter: none !important;
  pointer-events: auto !important;
  user-select: auto !important;
  width: 100%;
  height: ${props => (props.scrollDirection === 'none' ? theme.navHeight : theme.navScrollHeight)};
  transform: translateY(
    ${props => (props.scrollDirection === 'down' ? `-${theme.navScrollHeight}` : '0px')}
  );
  ${media.desktop`padding: 0 40px;`};
  ${media.tablet`padding: 0 25px;`};
`;
const StyledNav = styled.nav`
  ${mixins.flexBetween};
  position: relative;
  width: 100%;
  color: ${colors.lightestSlate};
  font-family: ${fonts.Calibre};
  counter-reset: item 0;
  z-index: 12;
`;
const StyledLogo = styled.div`
  ${mixins.flexCenter};
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${fonts.Calibre};
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.04em;
    background: linear-gradient(135deg, #4f46e5, #a855f7);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    transition: ${theme.transition};
    user-select: none;
    text-decoration: none;
    &:hover,
    &:focus {
      opacity: 0.75;
    }
    &:after {
      display: none !important;
    }
  }
`;
const StyledHamburger = styled.div`
  ${mixins.flexCenter};
  overflow: visible;
  margin: 0 -12px 0 0;
  padding: 15px;
  cursor: pointer;
  transition-timing-function: linear;
  transition-duration: 0.15s;
  transition-property: opacity, filter;
  text-transform: none;
  color: inherit;
  border: 0;
  background-color: transparent;
  display: none;
  ${media.tablet`display: flex;`};
`;
const StyledHamburgerBox = styled.div`
  position: relative;
  display: inline-block;
  width: ${theme.hamburgerWidth}px;
  height: 24px;
`;
const StyledHamburgerInner = styled.div`
  background-color: ${colors.green};
  position: absolute;
  width: ${theme.hamburgerWidth}px;
  height: 2px;
  border-radius: ${theme.borderRadius};
  top: 50%;
  left: 0;
  right: 0;
  transition-duration: 0.22s;
  transition-property: transform;
  transition-delay: ${props => (props.menuOpen ? `0.12s` : `0s`)};
  transform: rotate(${props => (props.menuOpen ? `225deg` : `0deg`)});
  transition-timing-function: cubic-bezier(
    ${props => (props.menuOpen ? `0.215, 0.61, 0.355, 1` : `0.55, 0.055, 0.675, 0.19`)}
  );
  &:before,
  &:after {
    content: '';
    display: block;
    background-color: ${colors.green};
    position: absolute;
    left: auto;
    right: 0;
    width: ${theme.hamburgerWidth}px;
    height: 2px;
    transition-timing-function: ease;
    transition-duration: 0.15s;
    transition-property: transform;
    border-radius: 4px;
  }
  &:before {
    width: ${props => (props.menuOpen ? `100%` : `120%`)};
    top: ${props => (props.menuOpen ? `0` : `-10px`)};
    opacity: ${props => (props.menuOpen ? 0 : 1)};
    transition: ${props => (props.menuOpen ? theme.hamBeforeActive : theme.hamBefore)};
  }
  &:after {
    width: ${props => (props.menuOpen ? `100%` : `80%`)};
    bottom: ${props => (props.menuOpen ? `0` : `-10px`)};
    transform: rotate(${props => (props.menuOpen ? `-90deg` : `0`)});
    transition: ${props => (props.menuOpen ? theme.hamAfterActive : theme.hamAfter)};
  }
`;
const StyledLink = styled.div`
  display: flex;
  align-items: center;
  ${media.tablet`display: none;`};
`;
const StyledList = styled.ol`
  ${mixins.flexBetween};
  padding: 0;
  margin: 0;
  list-style: none;
`;
const StyledListItem = styled.li`
  margin: 0 10px;
  position: relative;
  font-size: ${fontSizes.xs};
  counter-increment: item 1;
  font-family: ${fonts.Calibre};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  &:before {
    content: '0' counter(item) '.';
    text-align: right;
    color: ${colors.green};
    font-size: ${fontSizes.xs};
    font-family: ${fonts.SFMono};
    margin-right: 4px;
    letter-spacing: 0;
  }
`;
const StyledListLink = styled(Link)`
  padding: 12px 10px;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: 6px;
    left: 10px;
    right: 10px;
    height: 1.5px;
    background: linear-gradient(90deg, #4f46e5, #a855f7);
    border-radius: 2px;
    transform: scaleX(0);
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    transform-origin: left center;
  }
  &.active-section:after,
  &:hover:after,
  &:focus:after {
    transform: scaleX(1);
  }
`;
const StyledResumeButton = styled.a`
  ${mixins.smallButton};
  margin-left: 10px;
  font-size: ${fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 600;
`;
const StyledThemeToggle = styled.button`
  ${mixins.flexCenter};
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  width: 34px;
  height: 34px;
  cursor: pointer;
  color: ${colors.green};
  transition: ${theme.transition};
  margin-left: 12px;
  padding: 0;
  flex-shrink: 0;

  &:hover {
    border-color: ${colors.green};
    background: ${colors.transGreen};
    transform: rotate(20deg);
  }

  svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

const SunIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #4f46e5, #a855f7, #ec4899);
  width: ${p => p.progress}%;
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
`;

const DELTA = 5;

const Nav = ({ isHome }) => {
  const [isMounted, setIsMounted] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('none');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const lastScrollTopRef = useRef(0);
  const scrollDirectionRef = useRef('none');
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const fromTop = window.scrollY;
      const lastScrollTop = lastScrollTopRef.current;

      // Scroll progress
      const total = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (fromTop / total) * 100 : 0);
      setScrolled(fromTop > 120);

      // Active section via IntersectionObserver ids
      const sectionIds = ['about', 'jobs', 'projects', 'certifications', 'contact'];
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sectionIds[i]);
          break;
        }
        if (i === 0) setActiveSection('');
      }

      if (Math.abs(lastScrollTop - fromTop) <= DELTA || menuOpen) {
        lastScrollTopRef.current = fromTop;
        return;
      }

      let newDir = scrollDirectionRef.current;
      if (fromTop < DELTA) {
        newDir = 'none';
      } else if (fromTop > lastScrollTop && fromTop > navHeight) {
        newDir = 'down';
      } else if (fromTop + window.innerHeight < document.body.scrollHeight) {
        newDir = 'up';
      }

      if (newDir !== scrollDirectionRef.current) {
        scrollDirectionRef.current = newDir;
        setScrollDirection(newDir);
      }
      lastScrollTopRef.current = fromTop;
    };

    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) setMenuOpen(false);
    };

    const handleKeydown = e => {
      if (menuOpen && (e.which === 27 || e.key === 'Escape')) setMenuOpen(false);
    };

    window.addEventListener('scroll', () => throttle(handleScroll()));
    window.addEventListener('resize', () => throttle(handleResize()));
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('scroll', () => throttle(handleScroll()));
      window.removeEventListener('resize', () => throttle(handleResize()));
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [menuOpen]);

  const timeout = isHome ? loaderDelay : 0;
  const fadeClass = isHome ? 'fade' : '';
  const fadeDownClass = isHome ? 'fadedown' : '';

  return (
    <StyledContainer scrollDirection={scrollDirection} scrolled={scrolled}>
      <ProgressBar progress={scrollProgress} />
      <Helmet>
        <body className={menuOpen ? 'blur' : ''} />
      </Helmet>
      <StyledNav>
        <StyledLogo style={{ opacity: scrolled ? 1 : 0, transition: 'opacity 0.35s ease' }}>
          <Link to="/" aria-label="home">LL</Link>
        </StyledLogo>

        <TransitionGroup component={null}>
          {isMounted && (
            <CSSTransition classNames={fadeClass} timeout={timeout}>
              <StyledHamburger onClick={() => setMenuOpen(o => !o)}>
                <StyledHamburgerBox>
                  <StyledHamburgerInner menuOpen={menuOpen} />
                </StyledHamburgerBox>
              </StyledHamburger>
            </CSSTransition>
          )}
        </TransitionGroup>

        <StyledLink>
          <StyledList>
            <TransitionGroup component={null}>
              {isMounted &&
                navLinks &&
                navLinks.map(({ url, name }, i) => (
                  <CSSTransition key={i} classNames={fadeDownClass} timeout={timeout}>
                    <StyledListItem
                      key={i}
                      style={{ transitionDelay: `${isHome ? i * 100 : 0}ms` }}>
                      <StyledListLink
                        to={url}
                        className={activeSection === url.replace('/#', '') ? 'active-section' : ''}>
                        {name}
                      </StyledListLink>
                    </StyledListItem>
                  </CSSTransition>
                ))}
            </TransitionGroup>
          </StyledList>

          <TransitionGroup component={null}>
            {isMounted && (
              <CSSTransition classNames={fadeDownClass} timeout={timeout}>
                <div
                  style={{
                    transitionDelay: `${isHome ? navLinks.length * 100 : 0}ms`,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <StyledResumeButton
                    href="/resume.pdf"
                    target="_blank"
                    rel="nofollow noopener noreferrer">
                    Resume
                  </StyledResumeButton>
                </div>
              </CSSTransition>
            )}
          </TransitionGroup>
        </StyledLink>
      </StyledNav>

      <Menu menuOpen={menuOpen} toggleMenu={() => setMenuOpen(o => !o)} />
    </StyledContainer>
  );
};

Nav.propTypes = {
  isHome: PropTypes.bool,
};

export default Nav;
