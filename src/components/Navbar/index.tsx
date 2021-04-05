import { useGlobalContext } from 'api/globalContext';
import { AnimatedImage } from 'components/AnimatedImage';
import { LanguageSwitcher } from 'components/LanguageSwitcher';
import { ProfileButton } from 'components/Navbar/ProfileButton';
import { SrOnly } from 'components/SrOnly';
import { TextLink } from 'components/TextLink';
import { containerTransitions, itemTransitionDown } from 'components/transitionConfigs';
import { m } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { FiMenu as MenuIcon, FiX as CrossIcon } from 'react-icons/fi';
import { useClickAway } from 'react-use';
import styled from 'styled-components';
import { slugify } from 'utils/slugify';

/**
 * The order of nav bar links is currently determined by the order of API calls
 * in `getAllPages`
 */
export const Navbar: React.FC = () => {
  const { language, commonData, routes } = useGlobalContext();
  const { query, asPath } = useRouter();
  const panelRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useClickAway(panelRef, close);

  const { logo } = commonData;

  // Close the navbar whenever path changes, i.e. user navigated somewhere
  useEffect(close, [asPath]);

  const currentSlug = query.slug?.[0] || '';

  return (
    <NavbarWrapper>
      <DesktopWrapper initial="initial" animate="enter" variants={containerTransitions}>
        <LogoImageLink href={slugify(routes[language][0].slug)} logo={logo} />

        <NavLinks>
          {routes[language].map((route) => (
            <m.li variants={itemTransitionDown} key={route.slug}>
              <Link href={slugify(route.slug)} passHref>
                <TextLink aria-current={route.slug === currentSlug}>{route.title}</TextLink>
              </Link>
            </m.li>
          ))}
        </NavLinks>

        <RightGroup>
          <LanguageSwitcher focusable={isOpen} />
          <ProfileButton />
        </RightGroup>
      </DesktopWrapper>

      <MobileWrapper>
        <MenuButton onClick={toggleIsOpen} aria-expanded={isOpen}>
          {isOpen && <CrossIcon />}
          {!isOpen && <MenuIcon />}
          <SrOnly>Menu</SrOnly>
        </MenuButton>

        <LogoImageLink href={slugify(routes[language][0].slug)} logo={logo} />

        <ProfileButton />

        <MenuPanel aria-hidden={!isOpen} ref={panelRef}>
          <MobileNavLinks>
            {routes[language].map((route) => (
              <m.li
                initial="initial"
                animate="enter"
                variants={itemTransitionDown}
                key={route.slug}
              >
                <Link href={slugify(route.slug)} passHref>
                  <TextLink aria-current={route.slug === currentSlug} tabIndex={isOpen ? 0 : -1}>
                    {route.title}
                  </TextLink>
                </Link>
              </m.li>
            ))}
          </MobileNavLinks>

          <LanguageSwitcher focusable={isOpen} />
        </MenuPanel>
      </MobileWrapper>
    </NavbarWrapper>
  );
};

const LogoImageLink: React.FC<{ href: string; logo: string }> = ({ href, logo }) => (
  <Link href={href} passHref>
    <LogoLink variants={itemTransitionDown} aria-hidden tabIndex={-1}>
      <AnimatedImage src={logo} alt="" layout="fill" objectFit="contain" />
    </LogoLink>
  </Link>
);

const NavbarWrapper = styled.nav`
  position: fixed;
  width: 100%;
  height: var(--navbar-height);

  color: var(--white);

  font-size: var(--text-navigation);

  z-index: 999;
`;

const DesktopWrapper = styled(m.div)`
  width: 100%;
  height: 100%;
  padding: 0 var(--spacing-regular);

  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: var(--black);
  box-shadow: var(--dark-shadow);

  @media (max-width: 55em) {
    display: none;
  }
`;

const LogoLink = styled(m.a)`
  position: relative;
  width: var(--navbar-logo-width);
  height: 100%;
`;

const NavLinks = styled(m.ul)`
  display: flex;

  & > li + li {
    margin-left: var(--spacing-xlarge);
  }
`;

const RightGroup = styled(m.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  width: var(--navbar-logo-width);
`;

const MobileWrapper = styled(DesktopWrapper)`
  display: flex !important;
  padding-left: var(--spacing-small);

  box-shadow: var(--dark-shadow);

  @media (min-width: 55em) {
    display: none !important;
  }
`;

const MenuButton = styled.button`
  color: currentColor;
  background-color: transparent;
  border: none;
  display: flex;
  font-size: 1.5em;
  padding: 0.25em;
`;

const MenuPanel = styled.div`
  position: absolute;
  top: var(--navbar-height);
  left: 0;
  width: 100%;
  padding: var(--spacing-large);

  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: var(--black);
  box-shadow: var(--dark-shadow);

  transition: transform 0.5s ease;

  &[aria-hidden='true'] {
    transform: translateY(-100%);
  }

  & > * + * {
    margin-top: var(--spacing-large);
  }

  z-index: -1;
`;

const MobileNavLinks = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > li + li {
    margin-top: var(--spacing-regular);
  }
`;
