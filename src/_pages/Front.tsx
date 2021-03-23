import { NextPage } from 'next';
import styled from 'styled-components';

import { Article, FrontPageData } from 'types';
import { Main as MainBase } from 'components/Main';
import { Banner } from 'components/Banner';
import { Section } from 'components/Section';
import { Card, CardList } from 'components/Card';
import { Line } from 'components/Line';
import React from 'react';
import { useGlobalContext } from 'api/globalContext';

export const Front: NextPage<FrontPageData> = ({
  background_banner,
  main_logo,
  highlighted_articles,
  translations,
}) => {
  const { language } = useGlobalContext();
  const { logo_alternative_text, videos_title, podcasts_title, blog_posts_title } = translations[
    language
  ];

  // TODO: remove
  const mockArticles = highlighted_articles
    .concat(highlighted_articles)
    .concat(highlighted_articles);

  return (
    <Main>
      <Banner bannerUrl={background_banner} logoUrl={main_logo} logoText={logo_alternative_text} />

      <CardSection articles={mockArticles} type="video" title={videos_title} />

      <CardSection articles={mockArticles} type="podcast" title={podcasts_title} />

      <CardSection articles={mockArticles} type="blog_post" title={blog_posts_title} />
    </Main>
  );
};

type CardSectionProps = {
  articles: Article[];
  type: Article['type'];
  title: string;
};

const CardSection: React.FC<CardSectionProps> = ({ articles, type, title, ...rest }) => (
  <CardSectionWrapper {...rest}>
    <CardSectionTitle>{title}</CardSectionTitle>
    <Line variant="long" />
    <CardList>
      {articles
        .filter((a) => a.type === type)
        .map((article) => (
          <Card article={article} key={article.id} />
        ))}
    </CardList>
  </CardSectionWrapper>
);

const Main = styled(MainBase)`
  grid-row-gap: var(--spacing-xlarge);
`;

const CardSectionWrapper = styled(Section)`
  & > * + * {
    margin-top: var(--spacing-medium);
  }

  &:first-of-type {
    color: var(--white);
    margin-top: -15vh;
  }
`;

const CardSectionTitle = styled.h2`
  line-height: 0.7;
  font-size: 3rem;
  font-weight: 700;
`;