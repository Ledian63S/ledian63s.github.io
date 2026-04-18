import React from 'react';
import PropTypes from 'prop-types';
import { socialMedia } from '@config';
import { Side } from '@components';
import { FormattedIcon } from '@components/icons';
import styled from 'styled-components';
import { theme } from '@styles';
const { colors } = theme;

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 0;
  list-style: none;

  &:after {
    content: '';
    display: block;
    width: 1px;
    height: 90px;
    margin: 0 auto;
    background: linear-gradient(180deg, #4f46e5, #a855f7, rgba(168,85,247,0));
  }

  li:last-of-type {
    margin-bottom: 20px;
  }
`;
const StyledLink = styled.a`
  padding: 14px;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  &:hover,
  &:focus {
    transform: translateY(-4px);
    color: ${colors.green};
  }
  svg {
    width: 18px;
    height: 18px;
    color: ${colors.slate};
    transition: color 0.2s ease;
    &:hover,
    &:focus {
      color: ${colors.green};
    }
  }
`;

const Social = ({ isHome }) => (
  <Side isHome={isHome} orientation="left">
    <StyledList>
      {socialMedia &&
        socialMedia.map(({ url, name }, i) => (
          <li key={i}>
            <StyledLink
              href={url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              aria-label={name}>
              <FormattedIcon name={name} />
            </StyledLink>
          </li>
        ))}
    </StyledList>
  </Side>
);

Social.propTypes = {
  isHome: PropTypes.bool,
};

export default Social;
