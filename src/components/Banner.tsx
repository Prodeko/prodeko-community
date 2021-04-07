import { AnimatedImage } from 'components/AnimatedImage';
import { SrOnly } from 'components/SrOnly';
import { m } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

type BannerProps = {
  bannerUrl: string;
  animationUrl: string;
  logoUrl: string;
  logoText?: string;
  decorative?: boolean;
};

export const Banner: React.FC<BannerProps> = ({
  animationUrl,
  bannerUrl,
  logoUrl,
  logoText,
  decorative,
}) => (
  <BannerWrapper layoutId="banner">
    <AnimatedImage src={bannerUrl} alt="" layout="fill" objectFit="cover" />

    <AnimationWrapper autoPlay muted playsInline loop>
      <source src={animationUrl} type="video/mp4" />
    </AnimationWrapper>

    <LogoWrapper>
      <AnimatedImage src={logoUrl} alt="" layout="fill" objectFit="contain" transitionUpwards />
      {!decorative && (
        <SrOnly>
          <h1>{logoText}</h1>
        </SrOnly>
      )}
    </LogoWrapper>
  </BannerWrapper>
);

const BannerWrapper = styled(m.header)`
  && {
    grid-column: main;
  }
  position: relative;
  width: 100%;
  height: var(--banner-height);
  margin-top: var(--navbar-height);

  background-color: var(--black);

  display: flex;
  justify-content: center;

  /* Fixes issue with next/image absolute positioning going on top */
  z-index: -1;

  &:after {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(to bottom, transparent 0%, transparent 85%, var(--white) 100%);
  }
`;

const LogoWrapper = styled.div`
  position: relative;
  width: min(var(--min-content-width), var(--content-width));
  filter: drop-shadow(0px 0.25rem 1rem var(--gray-dark));
`;

const AnimationWrapper = styled.video`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;

  object-fit: cover;
`;
