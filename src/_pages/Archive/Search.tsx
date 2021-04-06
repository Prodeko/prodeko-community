import { useArticlesContext } from '_pages/Archive/useArticlesContext';
import { useBasicFiltering } from '_pages/Archive/useBasicFiltering';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { useGlobalContext } from 'api/globalContext';
import { Card } from 'components/Card';
import React from 'react';
import { Hit as HitType, StateResultsProvided } from 'react-instantsearch-core';
import {
  Configure,
  connectHits,
  connectStateResults,
  InstantSearch,
  SearchBox,
  Snippet,
} from 'react-instantsearch-dom';
import styled from 'styled-components';
import { Article } from 'types';

const textFieldKeys = ['title', 'ingress', 'tagline', 'body'] as const;
type TextFieldKey = typeof textFieldKeys[number];

interface SearchHit extends Record<TextFieldKey, string | null> {
  id: number;
  'articles_id.id': number;
  'articles_id.author'?: null;
  'articles_id.author.name'?: string;
  _snippetResult: Record<TextFieldKey | 'articles_id.author.name', { value: string }>;
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

  return (
    <InstantSearch indexName={`articles_${language}`} searchClient={searchClient}>
      <Configure
        attributesToSnippet={[...textFieldKeys, 'articles_id.author.name'].map(
          (key) => `${key}:200`
        )}
        snippetEllipsisText={'...'}
      />
      <SearchBox />
      <Results defaultView={defaultView}>
        <Hits />
      </Results>
    </InstantSearch>
  );
};

interface ResultsProps extends StateResultsProvided<SearchHit> {
  defaultView: React.ReactNode;
}

const Results = connectStateResults<ResultsProps>(
  ({ searchState, searchResults, defaultView, children }) => {
    if (searchState && (searchState.query === undefined || searchState.query === '')) {
      // No search, display the basic year blocks
      return <>{defaultView}</>;
    }

    return searchResults && searchResults.nbHits !== 0 ? (
      <>{children}</>
    ) : (
      <div>No results have been found for {searchState.query}.</div>
    );
  }
);

const Hits = connectHits<SearchHit>(({ hits }) => {
  const { articles } = useArticlesContext();
  const { filteredArticles } = useBasicFiltering(articles);
  const articleIds = filteredArticles.map((article) => article.id);
  const filteredHits = hits.filter((hit) => articleIds.includes(hit['articles_id.id']));

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

  & > li + li {
    margin-top: var(--spacing-xlarge);
  }
`;

type HitProps = {
  hit: HitType<SearchHit>;
  article: Article;
};

const Hit: React.FC<HitProps> = ({ hit, article }) => {
  const filteredHitFields = Object.entries(hit._snippetResult)
    .filter(([_, value]) => value.value.includes('<ais-highlight')) // eslint-disable-line @typescript-eslint/no-unused-vars
    .map((pair) => pair[0]);

  const highlightedTitle = !!filteredHitFields.find((key) => key === 'title');

  console.log(hit._snippetResult);

  return (
    <HitWrapper>
      <Card article={article} />
      <HitContents>
        <h3>{highlightedTitle ? <Snippet attribute={['title']} hit={hit} /> : hit.title}</h3>
        {filteredHitFields.map((key) => (
          <p key={key}>
            <span>{key}</span>
            <Snippet attribute={[key]} hit={hit} />
          </p>
        ))}
      </HitContents>
    </HitWrapper>
  );
};

const HitWrapper = styled.li`
  display: grid;
  grid-template-columns: var(--card-min-width) 1fr;
  grid-gap: var(--spacing-large);

  & em {
    font-style: normal;
    background-color: var(--highlight);
  }
`;

const HitContents = styled.div``;
