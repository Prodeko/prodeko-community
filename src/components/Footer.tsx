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

export const Footer: React.FC = () => {
  const { language, commonData } = useGlobalContext();
  const { prodeko_link, prodeko_logo } = commonData;
  const { alumni_link_text, department_link_text } = commonData.translations[language];

  return (
    <FooterWrapper>
      <LogoLink href={prodeko_link}>
        <Image src={prodeko_logo} alt="" layout="fill" objectFit="contain" />
      </LogoLink>

      <TextLink>{alumni_link_text}</TextLink>
      <TextLink>{department_link_text}</TextLink>

      <IconWrapper>
        <TextLink>
          <FacebookIcon />
          <SrOnly>Facebook</SrOnly>
        </TextLink>
        <TextLink>
          <InstagramIcon />
          <SrOnly>Instagram</SrOnly>
        </TextLink>
        <TextLink>
          <LinkedInIcon />
          <SrOnly>LinkedIn</SrOnly>
        </TextLink>
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

  margin-top: var(--spacing-xlarge);
  padding: var(--spacing-xlarge) 0;
`;

const LogoLink = styled.a`
  position: relative;
  width: min(100%, 30rem);
  padding-top: 20%;
`;

const TextLink = styled.a`
  font-size: 1.25rem;
  font-weight: 600;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 0.8;

  & > a {
    padding: var(--spacing-regular);
  }
  & > a + a {
    margin-left: var(--spacing-small);
  }
`;