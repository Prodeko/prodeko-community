import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import { useGlobalContext } from 'api/globalContext';
import { LanguageSwitcher } from 'components/LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { language, commonData } = useGlobalContext();
  const { logo } = commonData;

  return (
    <NavbarWrapper>
      <LogoLink>
        <Image src={logo} alt="" layout="fill" objectFit="contain" />
      </LogoLink>

      <NavLinks></NavLinks>

      <LanguageSwitcher />
    </NavbarWrapper>
  );
};

const NavbarWrapper = styled.nav`
  position: fixed;
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 var(--spacing-regular);

  background-color: var(--black);
  box-shadow: 0 0.25rem 1.5rem #00000040;

  z-index: 999;
`;

const LogoLink = styled.a`
  position: relative;
  width: 8rem;
  height: 100%;
`;

const NavLinks = styled.ul``;
