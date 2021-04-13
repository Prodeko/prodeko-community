import { useGlobalContext } from 'api/globalContext';
import { AnimatedImage } from 'components/AnimatedImage';
import { ArticleStats } from 'components/ArticleStats';
import { Line } from 'components/Line';
import { SrOnly } from 'components/SrOnly';
import { Tooltip } from 'components/Tooltip';
import { containerTransitions, itemTransitionUp } from 'components/transitionConfigs';
import { m } from 'framer-motion';
import Link from 'next/link';
import React from 'react';
import {
  FiFileText as ArticleIcon,
  FiGlobe as BilingualIcon,
  FiVolume2 as PodcastIcon,
  FiYoutube as VideoIcon,
} from 'react-icons/fi';
import styled from 'styled-components';
import { Article } from 'types';

type CardProps = {
  article: Article;
  titleOverride?: React.ReactNode;
  taglineOverride?: React.ReactNode;
};

/** Card component for displaying a single article, be that a video, podcast or a blog post */
export const Card: React.FC<CardProps> = ({ article, titleOverride, taglineOverride }) => {
  const { language, commonData } = useGlobalContext();

  const { type, photo } = article;
  const { title, tagline, slug } = article.translations[language];
  const { bilingual_icon_alternative_text } = commonData.translations[language];

  const MediaIcon =
    type === 'blog_post'
      ? ArticleIcon
      : type === 'podcast'
      ? PodcastIcon
      : type === 'video'
      ? VideoIcon
      : React.Fragment;

  const mediaAltText = commonData.translations[language][`${type}_icon_alternative_text` as const];

  const linkPrefix = commonData.translations[language][`${type}_slug` as const];

  return (
    <Link href={{ query: { slug: [linkPrefix, slug] } }} passHref>
      <LinkContents>
        <AnimatedImage
          src={photo || commonData.article_default_picture}
          alt=""
          layout="fill"
          objectFit="cover"
          sizes="40vw"
        />
        <Wrapper>
          <Title>{titleOverride || title}</Title>
          <Line />
          <Tagline>{taglineOverride || tagline}</Tagline>

          <IconRow>
            <LeftIconsWrapper>
              <Tooltip content={mediaAltText}>
                <MediaIcon />
                <SrOnly>{mediaAltText}</SrOnly>
              </Tooltip>
              {article.bilingual && (
                <>
                  <span>|</span>
                  <Tooltip content={bilingual_icon_alternative_text}>
                    <BilingualIcon />
                    <SrOnly>{bilingual_icon_alternative_text}</SrOnly>
                  </Tooltip>
                </>
              )}
            </LeftIconsWrapper>

            <ArticleStats article={article} />
          </IconRow>
        </Wrapper>
      </LinkContents>
    </Link>
  );
};

const LinkContents = styled.a`
  position: relative;
  overflow: hidden;
  display: block;

  border-radius: var(--border-radius-large);
  height: var(--card-height);
  box-shadow: var(--card-shadow);

  // Fix Safari issue with transitioning overflowing elements with border radius
  // sigh...
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);

  &,
  & img {
    transition: transform cubic-bezier(0.165, 0.84, 0.44, 1) 0.8s;
  }
  &:hover,
  &:hover img {
    // We need !important for these to apply even with Framer Motion's entering/
    // exiting animations
    transform: scale(1.02) !important;
  }

  &:active {
    transform: scale(0.95) !important;
  }
`;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  padding: var(--spacing-regular);
  display: flex;
  justify-content: flex-end;
  flex-direction: column;

  color: var(--white);
  background: var(--photo-overlay);
  text-decoration: none;

  & > * + * {
    margin-top: var(--spacing-small);
  }
`;

const Title = styled.h3`
  font-size: var(--text-card-title);
  line-height: 1em;
`;

const Tagline = styled.p`
  line-height: 1.2;
`;

const IconRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 0.25em;
  font-size: var(--text-body);

  & svg {
    font-size: 1.25em;
  }
`;

const LeftIconsWrapper = styled.div`
  display: flex;
  align-items: center;
  & > * + * {
    margin-left: 0.5em;
  }
`;

export const CardList = styled(m.ul).attrs({
  initial: 'initial',
  animate: 'enter',
  exit: 'exit',
  variants: containerTransitions,
})`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--card-min-width), 1fr));
  grid-gap: var(--spacing-large);
`;

export const CardWrapper = styled(m.li).attrs({
  initial: 'initial',
  animate: 'enter',
  variants: itemTransitionUp,
})``;
