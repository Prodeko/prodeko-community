import { ArticleBlock } from '_pages/Archive/ArticleBlock';
import { Filters } from '_pages/Archive/Filters';
import { NoResults } from '_pages/Archive/NoResults';
import { Search } from '_pages/Archive/Search';
import { ArchiveContext } from '_pages/Archive/useArchiveContext';
import { useBasicFiltering } from '_pages/Archive/useBasicFiltering';
import { getArchivePageData } from 'api';
import { useGlobalContext } from 'api/globalContext';
import { Line } from 'components/Line';
import { Main as MainBase } from 'components/Main';
import { itemTransitionUp } from 'components/transitionConfigs';
import { AnimatePresence, m } from 'framer-motion';
import { NextPage } from 'next';
import React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
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
export const Archive: NextPage<ArchivePageData> = (props) => {
  const { data } = useSWR('archivePageData', getArchivePageData, { initialData: props });
  const { translations, articles } = data!;

  const { language } = useGlobalContext();
  const { visibleArticles } = useBasicFiltering(articles);

  const { page_title } = translations[language];

  return (
    <Main>
      <ArchiveContext.Provider value={{ articles, translations: translations[language] }}>
        <Header>
          <h1>{page_title}</h1>
          <Line variant="long" />
        </Header>

        <Filters translations={translations} />

        <SearchWrapper>
          <Search
            defaultView={
              visibleArticles.length !== 0 ? (
                <YearlyListing>
                  <AnimatePresence>
                    {visibleArticles.map(([year, articles]) => (
                      <ArticleBlockWrapper variants={itemTransitionUp} key={year} layout="position">
                        <ArticleBlock articles={articles} year={year} />
                      </ArticleBlockWrapper>
                    ))}
                  </AnimatePresence>
                </YearlyListing>
              ) : (
                <NoResults />
              )
            }
          />
        </SearchWrapper>
      </ArchiveContext.Provider>
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
  grid-row-gap: var(--spacing-large);
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

const YearlyListing = styled.ol`
  && {
    margin-top: var(--spacing-xlarge);
  }
`;

const SearchWrapper = styled.div`
  & > * + * {
    margin-top: var(--spacing-large);
  }
`;
