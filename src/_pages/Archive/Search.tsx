import { NoResults } from '_pages/Archive/NoResults';
import { useArchiveContext } from '_pages/Archive/useArchiveContext';
import { useBasicFiltering } from '_pages/Archive/useBasicFiltering';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { SEARCH_KEY, SEARCH_URL } from 'api/config';
import { useGlobalContext } from 'api/globalContext';
import { Card } from 'components/Card';
import { SrOnly } from 'components/SrOnly';
import { useRouter } from 'next/router';
import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { Hit as HitType, StateResultsProvided } from 'react-instantsearch-core';
import {
  Configure,
  connectHits,
  connectSearchBox,
  connectStateResults,
  InstantSearch,
  Snippet,
} from 'react-instantsearch-dom';
import styled, { css } from 'styled-components';
import { Article, LANGUAGE_KEYS } from 'types';

const SNIPPET_MAX_LENGTH = 200;

const snippetAttributes = [
  'author.name',
  'translations.title',
  'translations.ingress',
  'translations.tagline',
  'translations.body',
] as const;
type SnippetAttribute = typeof snippetAttributes[number];

interface SearchHit extends Record<SnippetAttribute, string | null> {
  id: number;
  'translations.languages_code': keyof typeof LANGUAGE_KEYS;
  _snippetResult: Record<SnippetAttribute, { value: string }>;
}

const searchClient = instantMeiliSearch(SEARCH_URL, SEARCH_KEY);

type SearchProps = {
  defaultView: React.ReactNode;
};

export const Search: React.FC<SearchProps> = ({ defaultView }) => {
  const { language } = useGlobalContext();
  const {
    query: { search: query },
  } = useRouter();

  return (
    <InstantSearch
      indexName={`articles_${language}`}
      searchClient={searchClient}
      searchState={{ query }}
    >
      <Configure
        attributesToSnippet={snippetAttributes.map((key) => `${key}:${SNIPPET_MAX_LENGTH}`)}
        snippetEllipsisText={'...'}
      />
      <SearchBox />
      <Results defaultView={defaultView}>
        <Hits />
      </Results>
    </InstantSearch>
  );
};

const SearchBox = connectSearchBox(({ currentRefinement }) => {
  const { updateRouterQuery, clearRouterQuery } = useBasicFiltering();
  const { translations } = useArchiveContext();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    if (value === '') {
      clearRouterQuery('search');
    } else {
      updateRouterQuery('search', value);
    }
  };

  const onClear = () => {
    clearRouterQuery('search');
  };

  return (
    <SearchBoxWrapper>
      <SearchLabel>{translations.search_bar_label}</SearchLabel>
      <InputWrapper>
        <SearchIcon />
        <SearchInput type="search" value={currentRefinement} onChange={onChange} />
        {currentRefinement && currentRefinement !== '' && (
          <ClearButton onClick={onClear}>
            <FiX />
            <SrOnly>{translations.clear_search_button}</SrOnly>
          </ClearButton>
        )}
      </InputWrapper>
    </SearchBoxWrapper>
  );
});

const SearchBoxWrapper = styled.div`
  font-size: var(--text-filter);
  display: flex;
  align-items: center;
`;

const SearchLabel = styled.label`
  margin-right: 1em;
  font-weight: 700;
  &:after {
    content: ':';
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: min(100%, 20rem);
`;

const SearchIcon = styled(FiSearch)`
  --size: 1em;
  position: absolute;
  height: var(--size);
  width: var(--size);
  top: calc(50% - var(--size) / 2);
  left: 0.5em;
  pointer-events: none;
  color: var(--gray-light);
`;

const SearchInput = styled.input`
  &[type='search']::-webkit-search-decoration,
  &[type='search']::-webkit-search-cancel-button,
  &[type='search']::-webkit-search-results-button,
  &[type='search']::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  width: 100%;
  padding: 0.2em 2em;
  border-radius: 999px;
  border: 1px solid var(--gray-light);
`;

const ClearButton = styled.button`
  --size: 2em;
  position: absolute;
  height: var(--size);
  width: var(--size);
  top: calc(50% - var(--size) / 2);
  right: 0.2em;
  color: var(--gray-light);
  padding: unset;
  margin: unset;
  border: unset;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ResultsProps extends StateResultsProvided<SearchHit> {
  defaultView: React.ReactNode;
}

const Results = connectStateResults<ResultsProps>(
  ({ searchState, searchResults, defaultView, children }) => {
    if (searchState && (searchState.query === undefined || searchState.query === '')) {
      // No search, display the basic year blocks
      return <>{defaultView}</>;
    }

    return searchResults && searchResults.nbHits !== 0 ? <>{children}</> : <NoResults />;
  }
);

const Hits = connectHits<SearchHit>(({ hits }) => {
  const { language } = useGlobalContext();
  const { articles } = useArchiveContext();
  const { filteredArticles } = useBasicFiltering(articles);
  const articleIds = filteredArticles.map((article) => article.id);
  const filteredHits = hits.filter(
    (hit) =>
      articleIds.includes(hit['id']) &&
      LANGUAGE_KEYS[hit['translations.languages_code']] === language
  );

  if (filteredHits.length === 0) {
    return <NoResults />;
  }

  return (
    <HitsWrapper>
      {filteredHits.map((hit) => (
        <Hit
          hit={hit}
          article={articles.find((article) => article.id === hit['id'])!}
          key={hit.id}
        />
      ))}
    </HitsWrapper>
  );
});

const HitsWrapper = styled.ol`
  --card-height: 18rem;
  margin-top: var(--spacing-large);
`;

type HitProps = {
  hit: HitType<SearchHit>;
  article: Article;
};

const Hit: React.FC<HitProps> = ({ hit, article }) => {
  const filteredHitFields = Object.entries(hit._snippetResult)
    .filter(([_, value]) => value.value.includes('<ais-highlight')) // eslint-disable-line @typescript-eslint/no-unused-vars
    .map((pair) => pair[0]) as SnippetAttribute[];

  const highlightedAttributes = snippetAttributes.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: !!filteredHitFields.find((key) => key === curr),
    }),
    {} as Record<SnippetAttribute, boolean>
  );

  return (
    <HitWrapper>
      <Card
        article={article}
        titleOverride={getSearchResultContent(
          hit,
          'translations.title',
          highlightedAttributes,
          true
        )}
        taglineOverride={getSearchResultContent(
          hit,
          'translations.tagline',
          highlightedAttributes,
          true
        )}
      />
      <HitContents>
        <HitTitle>
          {getSearchResultContent(hit, 'translations.title', highlightedAttributes, true)}
        </HitTitle>
        {hit['author.name'] && (
          <HitAuthor>
            {getSearchResultContent(hit, 'author.name', highlightedAttributes, true)}
          </HitAuthor>
        )}
        {hit['translations.ingress'] && (
          <Ingress>
            {getSearchResultContent(hit, 'translations.ingress', highlightedAttributes)}
          </Ingress>
        )}
        <Body>{getSearchResultContent(hit, 'translations.body', highlightedAttributes)}</Body>
      </HitContents>
    </HitWrapper>
  );
};

function stripEllipses(hit: SearchHit, key: SnippetAttribute): SearchHit {
  const newSnippetResult = {
    ...hit._snippetResult,
    [key]: { value: hit._snippetResult[key].value.replaceAll('...', '') },
  };
  return {
    ...hit,
    _snippetResult: newSnippetResult,
  };
}

function getSearchResultContent(
  hit: SearchHit,
  key: SnippetAttribute,
  attributes: Record<SnippetAttribute, boolean>,
  strip: boolean | undefined = false
): React.ReactNode {
  console.log(hit, key, attributes, strip);
  return attributes[key] ? (
    <Snippet attribute={[key]} hit={strip ? stripEllipses(hit, key) : hit} tagName="mark" />
  ) : (
    hit[key]
  );
}

const HitTitle = styled.h3`
  margin-bottom: var(--spacing-small);
`;

const HitWrapper = styled.li`
  display: grid;
  grid-template-columns: var(--card-min-width) 1fr;
  grid-gap: var(--main-padding);
  --space-between-results: var(--spacing-xlarge);

  & + & {
    margin-top: var(--space-between-results);
  }

  @media (max-width: 30em) {
    --space-between-results: var(--spacing-medium);

    grid-template-columns: unset;
    padding-bottom: calc(var(--space-between-results) - var(--spacing-small));

    border-bottom: 1px solid var(--gray-lighter);

    ${HitTitle} {
      display: none;
    }
  }
`;

const HitContents = styled.div`
  & > * + * {
    margin-top: var(--spacing-small);
  }
`;

const HitAuthor = styled.p`
  color: var(--gray-light);
`;

const clampLines = css`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`;

const Ingress = styled.p`
  font-style: italic;
  font-size: 1.2em;
  line-height: 1.2;
  color: var(--gray-dark);
  ${clampLines};
  -webkit-line-clamp: 2;
`;

const Body = styled.p`
  color: var(--gray-dark);
  ${clampLines};
  -webkit-line-clamp: 5;
`;
