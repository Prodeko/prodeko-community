import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { useGlobalContext } from 'api/globalContext';
import { LanguageSwitcher } from 'components/LanguageSwitcher';
import { TextLink } from 'components/TextLink';

/**
 * The order of nav bar links is currently determined by the order of API calls
 * in `getAllPages`
 */
export const Navbar: React.FC = () => {
  const { query } = useRouter();
  const { language, commonData, routes } = useGlobalContext();
  const { logo } = commonData;

  const currentSlug = query.slug?.[0] || '';

  return (
    <NavbarWrapper>
      <LogoLink>
        <Image src={logo} alt="" layout="fill" objectFit="contain" />
      </LogoLink>

      <NavLinks>
        {routes[language].map((route) => (
          <li key={route.slug}>
            <Link href={route.slug}>
              <TextLink aria-current={route.slug === currentSlug}>{route.title}</TextLink>
            </Link>
          </li>
        ))}
      </NavLinks>

      <LanguageSwitcher />
    </NavbarWrapper>
  );
};

const NavbarWrapper = styled.nav`
  position: fixed;
  width: 100%;
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 var(--spacing-regular);

  color: var(--white);
  background-color: var(--black);
  box-shadow: 0 0.25rem 1.5rem #00000040;

  --logo-width: 8rem;

  z-index: 999;
`;

const LogoLink = styled.a`
  position: relative;
  width: var(--logo-width);
  height: 100%;
`;

const NavLinks = styled.ul`
  display: flex;

  & > li + li {
    margin-left: var(--spacing-regular);
  }
`;
