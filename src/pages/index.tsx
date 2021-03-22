import { getCommonData, getFrontPageData } from 'api';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { ParsedUrlQuery } from 'node:querystring';
import styled from 'styled-components';

import { Article, LanguageCode } from 'types';
import { Main as MainBase } from 'components/Main';
import { Banner } from 'components/Banner';
import { Section } from 'components/Section';
import { Card, CardList } from 'components/Card';
import { Line } from 'components/Line';
import React from 'react';

export default function Home(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { background_banner, main_logo, highlighted_articles, language } = props;
  const {
    logo_alternative_text,
    videos_title,
    podcasts_title,
    blog_posts_title,
  } = props.translations[language];

  // TODO: remove
  const mockArticles = highlighted_articles
    .concat(highlighted_articles)
    .concat(highlighted_articles);

  return (
    <Main>
      <Banner bannerUrl={background_banner} logoUrl={main_logo} logoText={logo_alternative_text} />

      <FirstCardSection articles={mockArticles} type="video" title={videos_title} />

      <CardSection articles={mockArticles} type="podcast" title={podcasts_title} />

      <CardSection articles={mockArticles} type="blog_post" title={blog_posts_title} />
    </Main>
  );
}

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
`;

const CardSectionTitle = styled.h2`
  line-height: 0.7;
  font-size: 3rem;
  font-weight: 700;
`;

const FirstCardSection = styled(CardSection)`
  color: var(--white);
  margin-top: -15vh;
`;

export async function getStaticProps(context: GetStaticPropsContext<ParsedUrlQuery>) {
  const [frontPageData, commonData] = await Promise.all([getFrontPageData(), getCommonData()]);
  return { props: { ...frontPageData, commonData, language: 'fi' as LanguageCode }, revalidate: 1 };
}
