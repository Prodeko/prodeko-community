import { ArticleBlock } from '_pages/Archive/ArticleBlock';
import { Filters } from '_pages/Archive/Filters';
import { Search } from '_pages/Archive/Search';
import { ArticlesContext } from '_pages/Archive/useArticlesContext';
import { useBasicFiltering } from '_pages/Archive/useBasicFiltering';
import { useGlobalContext } from 'api/globalContext';
import { Line } from 'components/Line';
import { Main as MainBase } from 'components/Main';
import { itemTransitionUp } from 'components/transitionConfigs';
import { AnimatePresence, m } from 'framer-motion';
import { NextPage } from 'next';
import React from 'react';
import styled from 'styled-components';
import { ArchivePageData } from 'types';

/**
 * Archive page stores its 'state' in query parameters, so that users can
 * copy the current address of what they see and by sending a link the
 * recipient also gets the same view. We could persist the state in
 * `localstorage` or similar if desired, too.
 *
 * Concatenating filters (for example `/archive?filter=video&filter=podcast`)
 * might look a bit weird, but there isn't an official standard on this and
 * it works out of the box with Next.js
 * https://en.wikipedia.org/wiki/Query_string#Web_forms
 */
export const Archive: NextPage<ArchivePageData> = ({ translations, articles }) => {
  const { language } = useGlobalContext();
  const { visibleArticles } = useBasicFiltering(articles);

  const { page_title } = translations[language];

  return (
    <Main>
      <ArticlesContext.Provider value={{ articles }}>
        <Header>
          <h1>{page_title}</h1>
          <Line variant="long" />
        </Header>

        <Filters translations={translations} />

        <SearchResultsWrapper>
          <Search
            defaultView={
              <ol>
                <AnimatePresence>
                  {visibleArticles.map(([year, articles]) => (
                    <ArticleBlockWrapper variants={itemTransitionUp} key={year} layout="position">
                      <ArticleBlock articles={articles} year={year} />
                    </ArticleBlockWrapper>
                  ))}
                </AnimatePresence>
              </ol>
            }
          />
        </SearchResultsWrapper>
      </ArticlesContext.Provider>
    </Main>
  );
};

const Header = styled.header`
  * + * {
    margin-top: var(--spacing-regular);
  }
`;

const Main = styled(MainBase)`
  padding-top: calc(var(--navbar-height) + var(--spacing-xlarge));

  grid-template-rows: min-content min-content 1fr;

  & > * + * {
    margin-top: var(--spacing-xlarge);
  }
`;

const ArticleBlockWrapper = styled(m.li)`
  display: flex;

  & + & {
    margin-top: calc(var(--spacing-xlarge) * 2);
  }

  @media (max-width: 26em) {
    flex-direction: column;
    & > h2 {
      margin-bottom: var(--spacing-large);
    }
  }
`;

const SearchResultsWrapper = styled.div``;
