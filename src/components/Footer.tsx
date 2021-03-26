import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import {
  FiFacebook as FacebookIcon,
  FiInstagram as InstagramIcon,
  FiLinkedin as LinkedInIcon,
} from 'react-icons/fi';

import { useGlobalContext } from 'api/globalContext';
import { SrOnly } from 'components/SrOnly';
import { TextLink } from 'components/TextLink';

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
    <FooterWrapper>
      <LogoLink href={prodeko_link}>
        <Image src={prodeko_logo} alt="" layout="fill" objectFit="contain" />
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

const FooterWrapper = styled.footer`
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

  background-color: var(--background);
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
