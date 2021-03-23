import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import {
  FiFileText as ArticleIcon,
  FiVolume2 as PodcastIcon,
  FiYoutube as VideoIcon,
  FiMessageCircle as CommentIcon,
} from 'react-icons/fi';

import { Article } from 'types';
import { Line } from 'components/Line';
import { RainbowIconGrayscale } from 'components/RainbowIcon';
import { useGlobalContext } from 'api/globalContext';
import { SrOnly } from 'components/SrOnly';

type CardProps = {
  article: Article;
};

/** Card component for displaying a single article, be that a video, podcast or a blog post */
export const Card: React.FC<CardProps> = ({ article }) => {
  const { language, commonData } = useGlobalContext();

  const { type, photo } = article;
  const { title, tagline, slug } = article.translations[language];
  const { comment_icon_alternative_text, rainbow_icon_alternative_text } = commonData.translations[
    language
  ];

  const commentCount = 0;
  const rainbowCount = 0;

  const MediaIcon =
    type === 'blog_post'
      ? ArticleIcon
      : type === 'podcast'
      ? PodcastIcon
      : type === 'video'
      ? VideoIcon
      : React.Fragment;

  const mediaAltText = commonData.translations[language][`${type}_icon_alternative_text` as const];

  return (
    <CardWrapper>
      <Image src={photo} alt="" layout="fill" objectFit="cover" />
      <Link href={slug}>
        <LinkContents>
          <Title>{title}</Title>
          <Line />
          <Tagline>{tagline}</Tagline>

          <IconRow>
            <MediaIcon />
            <SrOnly>{mediaAltText}</SrOnly>
            <IconGroup>
              <IconWrapper>
                <CommentIcon />
                <SrOnly>{comment_icon_alternative_text}</SrOnly>
                {commentCount}
              </IconWrapper>
              <IconWrapper>
                <RainbowIconGrayscale />
                <SrOnly>{rainbow_icon_alternative_text}</SrOnly>
                {rainbowCount}
              </IconWrapper>
            </IconGroup>
          </IconRow>
        </LinkContents>
      </Link>
    </CardWrapper>
  );
};

const CardWrapper = styled.li`
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
    transform: scale(1.02);
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
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  line-height: 1;

  & > *:first-child {
    margin-right: 0.25em;
  }
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;

  & > * + * {
    margin-left: 1em;
  }
`;

export const CardList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-flow: column;
  grid-gap: var(--spacing-large);
`;
