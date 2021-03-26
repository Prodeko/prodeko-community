import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { SrOnly } from 'components/SrOnly';

type BannerProps = {
  bannerUrl: string;
  logoUrl: string;
  logoText?: string;
  decorative?: boolean;
};

export const Banner: React.FC<BannerProps> = ({ bannerUrl, logoUrl, logoText, decorative }) => (
  <BannerWrapper>
    <Image src={bannerUrl} alt="" layout="fill" objectFit="cover" />

    <LogoWrapper>
      <Image src={logoUrl} alt="" layout="fill" objectFit="contain" />
      {!decorative && (
        <SrOnly>
          <h1>{logoText}</h1>
        </SrOnly>
      )}
    </LogoWrapper>
  </BannerWrapper>
);

const BannerWrapper = styled.header`
  grid-column: main;
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
