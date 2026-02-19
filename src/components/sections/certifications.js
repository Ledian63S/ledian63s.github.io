import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import sr from '@utils/sr';
import { srConfig } from '@config';
import styled from 'styled-components';
import { theme, mixins, media, Section } from '@styles';
const { colors, fontSizes, fonts } = theme;

const StyledContainer = styled(Section)`
  ${mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
`;
const StyledTitle = styled.h4`
  margin: 0 auto 50px;
  font-size: ${fontSizes.h3};
  ${media.tablet`font-size: 24px;`};
`;
const StyledGrid = styled.div`
  width: 100%;
  margin-left: 10%;
  ${media.tablet`margin-left: 0;`};

  .certifications {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    grid-gap: 10px;
    position: relative;
    ${media.desktop`grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));`};
  }
`;
const StyledCertInner = styled.div`
  ${mixins.boxShadow};
  ${mixins.flexBetween};
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  padding: 2rem 1.75rem;
  height: 100%;
  border-radius: ${theme.borderRadius};
  transition: ${theme.transition};
  background-color: ${colors.lightNavy};
`;
const StyledCert = styled.div`
  transition: ${theme.transition};
  cursor: default;
  &:hover,
  &:focus {
    outline: 0;
    ${StyledCertInner} {
      transform: translateY(-5px);
    }
  }
`;
const StyledCertHeader = styled.div`
  ${mixins.flexBetween};
  margin-bottom: 20px;
  width: 100%;
`;
const StyledBadge = styled.div`
  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }
`;
const StyledExternalLink = styled.a`
  color: ${colors.lightSlate};
  position: relative;
  top: -10px;
  padding: 10px;
  svg {
    width: 20px;
    height: 20px;
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
    revealCerts.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <StyledContainer id="certifications">
      <StyledTitle ref={revealTitle}>Certifications</StyledTitle>

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
                    <header>
                      <StyledCertHeader>
                        <StyledBadge>
                          {image && <img src={image} alt={title} />}
                        </StyledBadge>
                        {external && (
                          <StyledExternalLink
                            href={external}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            aria-label="Certification Link">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <title>External Link</title>
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </StyledExternalLink>
                        )}
                      </StyledCertHeader>
                      <StyledCertName>{title}</StyledCertName>
                      {company && <StyledCompany>{company}</StyledCompany>}
                      <StyledCertDescription dangerouslySetInnerHTML={{ __html: html }} />
                    </header>
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
