import React, { useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';

import { ArchivePageData, Article } from 'types';
import { useGlobalContext } from 'api/globalContext';
import { Main as MainBase } from 'components/Main';
import { Line } from 'components/Line';
import { Card, CardList } from 'components/Card';
import { groupBy } from 'utils/groupBy';

export const Archive: NextPage<ArchivePageData> = ({ translations, articles }) => {
  const { language, commonData } = useGlobalContext();
  const { page_title, filter_label, sort_order_label, newest_first, oldest_first } = translations[
    language
  ];
  const {
    blog_post_icon_alternative_text,
    podcast_icon_alternative_text,
    video_icon_alternative_text,
  } = commonData.translations[language];

  const [visibleArticles, setVisibleArticles] = useState(articles);
  const articlesByYear = groupBy(visibleArticles, (article) =>
    new Date(article.publish_date).getFullYear()
  );

  return (
    <Main>
      <header>
        <h1>{page_title}</h1>
        <Line variant="long" />
      </header>

      <ol>
        {Object.entries(articlesByYear).map(([year, articles]) => (
          <ArticleBlock articles={articles} year={year} />
        ))}
      </ol>
    </Main>
  );
};

type ArticleBlockProps = {
  articles: Article[];
  year: number | string;
};

const ArticleBlock: React.FC<ArticleBlockProps> = ({ articles, year }) => (
  <ArticleBlockWrapper>
    <BlockTitle>{year}</BlockTitle>
    <StyledCardList>
      {articles.map((article) => (
        <Card article={article} />
      ))}
    </StyledCardList>
  </ArticleBlockWrapper>
);

const Main = styled(MainBase)`
  --content-width: 60rem;
  padding-top: calc(var(--navbar-height) + var(--spacing-xlarge));

  & > * + * {
    margin-top: var(--spacing-xlarge);
  }
`;

const ArticleBlockWrapper = styled.li`
  display: flex;
  & + & {
    margin-top: calc(var(--spacing-xlarge) * 2);
  }
`;

const BlockTitle = styled.h2`
  margin-right: var(--spacing-large);
  line-height: 0.5; // To vertically align with top of the cards
`;

const StyledCardList = styled(CardList)`
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
`;

const FilterWrapper = styled.div``;
