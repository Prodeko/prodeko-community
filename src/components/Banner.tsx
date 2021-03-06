import { AnimatedImage } from 'components/AnimatedImage';
import { SrOnly } from 'components/SrOnly';
import { m } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

type BannerProps = {
  bannerUrl: string;
  bannerNarrowUrl?: string;
  animationUrl: string;
  logoUrl: string;
  logoText?: string;
  decorative?: boolean;
};

/**
 * The main banner / hero component currently used in the frontpage and infopage
 */
export const Banner: React.FC<BannerProps> = ({
  animationUrl,
  bannerUrl,
  bannerNarrowUrl,
  logoUrl,
  logoText,
  decorative,
}) => (
  <BannerWrapper fade={!!animationUrl}>
    <AnimatedImage src={bannerUrl} alt="" layout="fill" objectFit="cover" />
    {bannerNarrowUrl && (
      <NarrowImage src={bannerNarrowUrl} alt="" layout="fill" objectFit="cover" />
    )}

    {animationUrl && (
      <AnimationWrapper autoPlay muted playsInline loop>
        <source src={animationUrl} type="video/mp4" />
      </AnimationWrapper>
    )}

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

const BannerWrapper = styled(m.header)<{ fade?: boolean }>`
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

  ${(p) =>
    p.fade
      ? `
  &:after {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(to bottom, transparent 0%, transparent 85%, var(--white) 100%);
  }
  `
      : ''}
`;

const LogoWrapper = styled.div`
  position: relative;
  margin-top: var(--banner-logo-offset);
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

// Layout prop needed with issues on styled-components and Next.js Image
const NarrowImage = styled(AnimatedImage)<{ layout: unknown }>`
  display: none;
  @media (max-width: 55em) {
    display: block;
  }
`;
