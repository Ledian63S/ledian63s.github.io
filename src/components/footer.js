import React from 'react';
import styled from 'styled-components';
import { theme, mixins } from '@styles';
const { colors, fontSizes, fonts } = theme;

const StyledContainer = styled.footer`
  ${mixins.flexCenter};
  flex-direction: column;
  padding: 28px 20px;
  text-align: center;
  gap: 6px;
`;

const StyledCredit = styled.p`
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.xs};
  color: ${colors.lightSlate};
  margin: 0;
  letter-spacing: 0.04em;

  a {
    color: ${colors.green};
    text-decoration: none;
    transition: ${theme.transition};
    &:hover { opacity: 0.75; }
    &:after { display: none !important; }
  }
`;

const StyledSub = styled.p`
  font-family: ${fonts.SFMono};
  font-size: 10px;
  color: ${colors.slate};
  margin: 0;
  letter-spacing: 0.06em;
  opacity: 0.5;
`;

const Footer = () => (
  <StyledContainer>
    <StyledCredit>
      Designed &amp; Built by <a href="https://github.com/Ledian63S" target="_blank" rel="noopener noreferrer">Ledian Leka</a>
    </StyledCredit>
    <StyledSub>&copy; {new Date().getFullYear()}</StyledSub>
  </StyledContainer>
);

export default Footer;
