import { NoResults } from '_pages/Archive/NoResults';
import { useArticlesContext } from '_pages/Archive/useArticlesContext';
import { useBasicFiltering } from '_pages/Archive/useBasicFiltering';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
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
import { Article } from 'types';

const SNIPPET_MAX_LENGTH = 200;

const textFieldKeys = ['title', 'ingress', 'tagline', 'body'] as const;
type TextFieldKey = typeof textFieldKeys[number];

const snippetAttributes = [...textFieldKeys, 'articles_id.author.name'] as const;
type SnippetAttribute = typeof snippetAttributes[number];

interface SearchHit extends Record<TextFieldKey, string | null> {
  id: number;
  'articles_id.id': number;
  'articles_id.author'?: null;
  'articles_id.author.name'?: string;
  _snippetResult: Record<SnippetAttribute, { value: string }>;
}

const searchClient = instantMeiliSearch(
  'http://localhost:7700',
  'dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25'
);

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
      <SearchLabel>Hae</SearchLabel>
      <InputWrapper>
        <SearchIcon />
        <SearchInput type="search" value={currentRefinement} onChange={onChange} />
        {currentRefinement && currentRefinement !== '' && (
          <ClearButton onClick={onClear}>
            <FiX />
            <SrOnly>Tyhjennä haku</SrOnly>
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
  const { articles } = useArticlesContext();
  const { filteredArticles } = useBasicFiltering(articles);
  const articleIds = filteredArticles.map((article) => article.id);
  const filteredHits = hits.filter((hit) => articleIds.includes(hit['articles_id.id']));

  if (filteredHits.length === 0) {
    return <NoResults />;
  }

  return (
    <HitsWrapper>
      {filteredHits.map((hit) => (
        <Hit
          hit={hit}
          article={articles.find((article) => article.id === hit['articles_id.id'])!}
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
      <Card article={article} />
      <HitContents>
        <HitTitle>{getSearchResultContent(hit, 'title', highlightedAttributes, true)}</HitTitle>
        {hit['articles_id.author.name'] && (
          <HitAuthor>
            {getSearchResultContent(hit, 'articles_id.author.name', highlightedAttributes, true)}
          </HitAuthor>
        )}
        {hit['ingress'] && (
          <Ingress>{getSearchResultContent(hit, 'ingress', highlightedAttributes)}</Ingress>
        )}
        <Body>{getSearchResultContent(hit, 'body', highlightedAttributes)}</Body>
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
  return attributes[key] ? (
    <Snippet attribute={[key]} hit={strip ? stripEllipses(hit, key) : hit} />
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

  & em {
    font-style: inherit;
    background-color: var(--highlight);
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
