import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { FormattedIcon } from '@components/icons';
import styled, { keyframes } from 'styled-components';
import { theme, mixins, media, Section, Heading } from '@styles';
const { colors, fontSizes, fonts } = theme;

const badgeSpin = keyframes`
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(360deg); }
`;

const StyledContainer = styled(Section)`
  ${mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
`;
const StyledGrid = styled.div`
  width: 100%;

  .certifications {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 20px;
    position: relative;
  }
`;
const StyledCertInner = styled.div`
  ${mixins.boxShadow};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 2rem 1.75rem;
  height: 100%;
  border-radius: ${theme.borderRadius};
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
  background-color: ${colors.lightNavy};
  text-align: center;
  will-change: transform;
`;
const StyledCert = styled.div`
  transition: ${theme.transition};
  cursor: default;
  perspective: 800px;
  &:hover,
  &:focus {
    outline: 0;
    ${StyledCertInner} {
      transform: translateY(-8px) rotateX(2deg);
      box-shadow: 0 24px 48px -16px rgba(79, 70, 229, 0.28);
    }
  }
`;
const StyledExternalLink = styled.a`
  position: absolute;
  top: 10px;
  right: 10px;
  color: ${colors.lightSlate};
  padding: 5px;
  svg {
    width: 20px;
    height: 20px;
  }
  &:hover {
    color: ${colors.green};
  }
`;
const StyledBadge = styled.div`
  margin-bottom: 20px;
  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease;
    filter: saturate(0.85);
  }
  ${StyledCert}:hover & img {
    transform: scale(1.1);
    filter: saturate(1.15);
  }
`;
const StyledCertName = styled.h5`
  margin: 0 0 8px;
  font-size: ${fontSizes.xxl};
  color: ${colors.lightestSlate};
`;
const StyledCompany = styled.span`
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.xs};
  color: ${colors.green};
`;
const StyledCertDescription = styled.div`
  font-size: 17px;
  color: ${colors.lightSlate};
  margin-top: 10px;
`;

const Certifications = ({ data }) => {
  const revealTitle = useRef(null);
  const revealCerts = useRef([]);

  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    revealCerts.current.forEach((ref, i) => sr.reveal(ref, { ...srConfig(i * 60), distance: '30px', duration: 600, scale: 0.96 }));
  }, []);

  return (
    <StyledContainer id="certifications">
      <Heading ref={revealTitle}>Certifications</Heading>

      <StyledGrid>
        <div className="certifications">
          {data &&
            data.map(({ node }, i) => {
              const { frontmatter, html } = node;
              const { title, external, image, company } = frontmatter;
              return (
                <StyledCert
                  key={i}
                  ref={el => (revealCerts.current[i] = el)}
                  tabIndex="0">
                  <StyledCertInner>
                    {external && (
                      <StyledExternalLink
                        href={external}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        aria-label="Certification Link">
                        <FormattedIcon name="External" />
                      </StyledExternalLink>
                    )}
                    <StyledBadge>
                      {image && <img src={image} alt={title} />}
                    </StyledBadge>
                    <StyledCertName>{title}</StyledCertName>
                    {company && <StyledCompany>{company}</StyledCompany>}
                    <StyledCertDescription dangerouslySetInnerHTML={{ __html: html }} />
                  </StyledCertInner>
                </StyledCert>
              );
            })}
        </div>
      </StyledGrid>
    </StyledContainer>
  );
};

Certifications.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Certifications;
