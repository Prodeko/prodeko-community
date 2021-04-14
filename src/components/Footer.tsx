import { useGlobalContext } from 'api/globalContext';
import { AnimatedImage } from 'components/AnimatedImage';
import { SrOnly } from 'components/SrOnly';
import { TextLink } from 'components/TextLink';
import { containerTransitions } from 'components/transitionConfigs';
import { m } from 'framer-motion';
import React from 'react';
import {
  FiFacebook as FacebookIcon,
  FiInstagram as InstagramIcon,
  FiLinkedin as LinkedInIcon,
} from 'react-icons/fi';
import styled from 'styled-components';

export const Footer: React.FC = () => {
  const { language, commonData } = useGlobalContext();
  const {
    prodeko_link,
    prodeko_logo,
    alumni_link,
    department_link,
    facebook_link,
    instagram_link,
    linkedin_link,
  } = commonData;
  const { alumni_link_text, department_link_text } = commonData.translations[language];

  return (
    <FooterWrapper initial="initial" animate="enter" variants={containerTransitions}>
      <LogoLink href={prodeko_link}>
        <AnimatedImage src={prodeko_logo} alt="" layout="fill" objectFit="contain" />
        <SrOnly>Prodeko</SrOnly>
      </LogoLink>

      <StyledTextLink href={alumni_link}>{alumni_link_text}</StyledTextLink>
      <StyledTextLink href={department_link}>{department_link_text}</StyledTextLink>

      <IconWrapper>
        <IconLink href={facebook_link}>
          <FacebookIcon />
          <SrOnly>Facebook</SrOnly>
        </IconLink>
        <IconLink href={instagram_link}>
          <InstagramIcon />
          <SrOnly>Instagram</SrOnly>
        </IconLink>
        <IconLink href={linkedin_link}>
          <LinkedInIcon />
          <SrOnly>LinkedIn</SrOnly>
        </IconLink>
      </IconWrapper>
    </FooterWrapper>
  );
};

const FooterWrapper = styled(m.footer)`
  display: grid;
  grid-template-rows: min-content;
  grid-template-columns:
    [footer-start] 1fr [content-start]
    min(var(--content-width), var(--min-content-width))
    [content-end] 1fr [footer-end];

  grid-row-gap: var(--spacing-medium);
  justify-items: center;

  & > * {
    grid-column: content;
  }

  background-color: var(--black);
  color: var(--white);

  margin-top: calc(var(--spacing-xlarge) * 2);
  padding: var(--spacing-xlarge) 0;
`;

const LogoLink = styled.a`
  position: relative;
  width: min(100%, 30rem);
  padding-top: 20%;
  color: currentColor;
`;

const StyledTextLink = styled(TextLink)`
  font-size: var(--text-navigation);
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 0.8;

  & > a {
    padding: var(--spacing-regular);
    font-size: var(--text-card-title);
  }
  & > a + a {
    margin-left: var(--spacing-small);
  }
`;

const IconLink = styled.a`
  color: currentColor;
  text-decoration: none;
`;
