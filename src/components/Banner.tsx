import { AnimatedImage } from 'components/AnimatedImage';
import { SrOnly } from 'components/SrOnly';
import { m } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

type BannerProps = {
  bannerUrl: string;
  logoUrl: string;
  logoText?: string;
  decorative?: boolean;
};

export const Banner: React.FC<BannerProps> = ({ bannerUrl, logoUrl, logoText, decorative }) => (
  <BannerWrapper layoutId="banner">
    <AnimatedImage src={bannerUrl} alt="" layout="fill" objectFit="cover" />

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

  display: flex;
  justify-content: center;

  /* Fixes issue with next/image absolute positioning going on top */
  z-index: -1;
`;

const LogoWrapper = styled.div`
  position: relative;
  width: min(var(--min-content-width), var(--content-width));
  margin-top: var(--banner-logo-offset);
`;
