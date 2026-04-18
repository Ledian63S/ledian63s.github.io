import React from 'react';
import PropTypes from 'prop-types';
import { email } from '@config';
import { Side } from '@components';
import styled from 'styled-components';
import { theme } from '@styles';
const { colors, fontSizes, fonts } = theme;

const StyledLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  &:after {
    content: '';
    display: block;
    width: 1px;
    height: 90px;
    margin: 0 auto;
    background: linear-gradient(180deg, #4f46e5, #a855f7, rgba(168,85,247,0));
  }
`;
const StyledEmailLink = styled.a`
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.s};
  letter-spacing: 0.1em;
  writing-mode: vertical-rl;
  margin: 20px auto;
  padding: 10px;
  font-size: 13px;
  color: ${colors.slate};
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), color 0.2s ease;

  &:hover,
  &:focus {
    transform: translateY(-5px);
    background: linear-gradient(180deg, #4f46e5, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Email = ({ isHome }) => (
  <Side isHome={isHome} orientation="right">
    <StyledLinkWrapper>
      <StyledEmailLink href={`mailto:${email}`}>{email}</StyledEmailLink>
    </StyledLinkWrapper>
  </Side>
);
Email.propTypes = {
  isHome: PropTypes.bool,
};

export default Email;
