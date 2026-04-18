import styled, { keyframes } from 'styled-components';
import theme from './theme';
import media from './media';
const { colors, fontSizes, fonts } = theme;

const gradientSettle = keyframes`
  0%   { background-position: 0% 50%; }
  100% { background-position: 60% 50%; }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

const Heading = styled.h3`
  position: relative;
  display: flex;
  align-items: center;
  margin: 10px 0 40px;
  width: 100%;
  white-space: nowrap;
  font-size: ${fontSizes.h3};
  font-weight: 700;
  letter-spacing: -0.01em;
  background: linear-gradient(120deg, #0f172a 0%, #1e293b 30%, #4f46e5 55%, #a855f7 75%, #ec4899 100%);
  background-size: 220% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientSettle} 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
  ${media.tablet`font-size: 24px;`};

  &:before {
    counter-increment: section;
    content: '0' counter(section) '.';
    margin-right: 10px;
    font-family: ${fonts.SFMono};
    font-weight: normal;
    color: #4f46e5;
    -webkit-text-fill-color: #4f46e5;
    font-size: ${fontSizes.xl};
    position: relative;
    bottom: 4px;
    ${media.tablet`font-size: ${fontSizes.lg};`};
  }

  &:after {
    content: '';
    display: block;
    height: 2px;
    width: 300px;
    background: linear-gradient(90deg, #4f46e5, #a855f7, #ec4899);
    border-radius: 2px;
    position: relative;
    top: -5px;
    margin-left: 20px;
    transform-origin: left center;
    animation: ${lineGrow} 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
    ${media.desktop`width: 200px`};
    ${media.tablet`width: 100%;`};
    ${media.thone`margin-left: 10px;`};
  }
`;

export default Heading;
