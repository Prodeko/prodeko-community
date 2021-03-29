import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {
  FiFileText as ArticleIcon,
  FiVolume2 as PodcastIcon,
  FiYoutube as VideoIcon,
} from 'react-icons/fi';
import { m } from 'framer-motion';

import { Article } from 'types';
import { Line } from 'components/Line';
import { useGlobalContext } from 'api/globalContext';
import { SrOnly } from 'components/SrOnly';
import { ArticleStats } from 'components/ArticleStats';
import { containerTransitions, itemTransitionUp } from 'components/transitionConfigs';
import { AnimatedImage } from 'components/AnimatedImage';

type CardProps = {
  article: Article;
};

/** Card component for displaying a single article, be that a video, podcast or a blog post */
export const Card: React.FC<CardProps> = ({ article }) => {
  const { language, commonData } = useGlobalContext();

  const { type, photo } = article;
  const { title, tagline, slug } = article.translations[language];

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
    <Wrapper>
      <AnimatedImage src={photo} alt="" layout="fill" objectFit="cover" />
      <Link href={{ query: { slug: [linkPrefix, slug] } }} passHref>
        <LinkContents>
          <Title>{title}</Title>
          <Line />
          <Tagline>{tagline}</Tagline>

          <IconRow>
            <MediaIcon />
            <SrOnly>{mediaAltText}</SrOnly>

            <ArticleStats article={article} />
          </IconRow>
        </LinkContents>
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;

  border-radius: var(--border-radius-large);
  height: var(--card-height);
  box-shadow: var(--card-shadow);

  &,
  & img {
    transition: transform cubic-bezier(0.165, 0.84, 0.44, 1) 0.8s;
  }
  &:hover,
  &:hover img {
    transform: scale(1.02) !important;
  }
`;

const LinkContents = styled.a`
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
