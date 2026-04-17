import React from 'react';
import styled from 'styled-components';
import { theme, mixins } from '@styles';
const { colors, fontSizes, fonts } = theme;

const StyledContainer = styled.footer`
  ${mixins.flexCenter};
  padding: 20px;
  text-align: center;
`;
const StyledCredit = styled.p`
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.xs};
  color: ${colors.slate};
  margin: 0;
`;

const Footer = () => (
  <StyledContainer>
    <StyledCredit>Ledian Leka &copy; {new Date().getFullYear()}</StyledCredit>
  </StyledContainer>
);

export default Footer;
