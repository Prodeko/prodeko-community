import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FiChevronDown as DownIcon, FiChevronUp as UpIcon } from 'react-icons/fi';

import { ArchivePageData, Article, ArticleType, ARTICLE_TYPES } from 'types';
import { useGlobalContext } from 'api/globalContext';
import { Main as MainBase } from 'components/Main';
import { Line } from 'components/Line';
import { Card, CardList } from 'components/Card';
import { groupBy } from 'utils/groupBy';

/**
 * Currently supported sort orders, adding more requires a refactor to sort
 * selection buttons.
 */
type Order = 'newest' | 'oldest';

/**
 * Callback to give to `Array.sort()` to compare `a` and `b` by the field
 * given by `getValue()`.
 */
function sortBy<T>(a: T, b: T, getValue: (x: T) => number, order: Order) {
  return order === 'oldest' ? getValue(a) - getValue(b) : getValue(b) - getValue(a);
}

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
  const { language, commonData } = useGlobalContext();
  const router = useRouter();
  const { query } = router;

  const order = (query.order ?? 'newest') as Order;
  const getFilteredTypes = (filter: string | string[] | undefined) => {
    if (filter && Array.isArray(filter)) {
      return filter;
    } else if (filter) {
      return [filter];
    } else {
      return [];
    }
  };
  const filteredTypes = getFilteredTypes(query.filter);

  const { page_title, filter_label, sort_order_label, newest_first, oldest_first } = translations[
    language
  ];
  const {
    blog_post_icon_alternative_text,
    podcast_icon_alternative_text,
    video_icon_alternative_text,
  } = commonData.translations[language];

  const filteredArticles = articles.filter((a) => !filteredTypes.includes(a.type));
  const articlesByYear = groupBy(filteredArticles, (article) =>
    new Date(article.publish_date).getFullYear()
  );
  // Sort article blocks and articles contained within them
  const visibleArticles = Object.entries(articlesByYear)
    .sort((a, b) => sortBy(a, b, (x) => Number(x[0]), order))
    .map(
      ([year, articles]) =>
        [
          year,
          articles.sort((a, b) => sortBy(a, b, (x) => new Date(x.publish_date).getTime(), order)),
        ] as const
    );

  /**
   * Set query parameter for sort appropriately.
   * Doesn't refetch data from server or change browser history
   */
  const sortOnClick = () => {
    if (order === 'newest') {
      router.replace({ query: { ...query, order: 'oldest' } }, undefined, { shallow: true });
    } else {
      router.replace({ query: { ...query, order: 'newest' } }, undefined, { shallow: true });
    }
  };

  /**
   * Add or remove query parameters depending on clicked button's type.
   * Doesn't refetch data from server or change browser history
   */
  const getPillOnClick = (type: ArticleType) => () => {
    if (filteredTypes.includes(type)) {
      router.replace(
        {
          query: { ...query, filter: filteredTypes.filter((x) => x !== type) },
        },
        undefined,
        { shallow: true }
      );
    } else {
      router.replace(
        {
          query: { ...query, filter: [...getFilteredTypes(query.filter), type] },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  return (
    <Main>
      <Header>
        <h1>{page_title}</h1>
        <Line variant="long" />
      </Header>

      <FilterWrapper>
        <SortWrapper>
          <SortLabel>{sort_order_label}</SortLabel>
          <SortButton onClick={sortOnClick} aria-pressed={order !== 'newest'}>
            <ButtonContents>
              {newest_first} <DownIcon />
            </ButtonContents>
            <ButtonContents>
              {oldest_first} <UpIcon />
            </ButtonContents>
          </SortButton>
        </SortWrapper>

        <PillGroup>
          <PillGroupLabel>{filter_label}</PillGroupLabel>
          <PillWrapper>
            {ARTICLE_TYPES.map((type) => (
              <Pill
                onClick={getPillOnClick(type)}
                aria-pressed={!filteredTypes.includes(type)}
                key={type}
              >
                {commonData.translations[language][`${type}_icon_alternative_text` as const]}
              </Pill>
            ))}
          </PillWrapper>
        </PillGroup>
      </FilterWrapper>

      <ol>
        {visibleArticles.map(([year, articles]) => (
          <ArticleBlock articles={articles} year={year} key={year} />
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
    <CardList>
      {articles.map((article) => (
        <Card article={article} key={article.id} />
      ))}
    </CardList>
  </ArticleBlockWrapper>
);

const Header = styled.header`
  * + * {
    margin-top: var(--spacing-regular);
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  font-size: var(--text-filter);

  // We can't use flexbox gap yet (thanks safari), but this works similarly
  --gap: var(--spacing-regular);
  margin: calc(var(--gap) / -2);
  & > * {
    padding: calc(var(--gap) / 2);
  }
`;

const SortWrapper = styled.div``;

const SortLabel = styled.label`
  margin-right: 1em;
  font-weight: 700;
  &:after {
    content: ':';
  }
`;

const SortButton = styled.button`
  border: none;
  background-color: unset;

  font-weight: 300;

  &[aria-pressed='false'] {
    span:last-child {
      display: none;
    }
  }
  &[aria-pressed='true'] {
    span:first-child {
      display: none;
    }
  }
`;

const ButtonContents = styled.span`
  display: flex;
  align-items: center;
  & > svg {
    margin-left: 0.25em;
    font-size: 1.25em;
    stroke-width: 1;
  }
`;

const Pill = styled.button`
  border: none;
  border-radius: 999px;
  padding: 0.2em 0.8em;

  background-color: var(--gray-lighter);
  color: var(--gray-light);

  font-weight: 300;

  &[aria-pressed='true'] {
    background-color: var(--highlight);
    color: var(--confirm);
  }
`;

const PillGroup = styled.fieldset`
  display: flex;
  align-items: center;
`;

const PillGroupLabel = styled.legend`
  padding: 0;
  // There isn't a proper way to align legends inside fieldset so this will
  // have to do
  float: left;
  height: min-content;
  margin-right: 1em;
  font-weight: 700;
  &:after {
    content: ':';
  }
`;

const PillWrapper = styled.div`
  // We can't use flexbox gap yet (thanks safari), but this works similarly
  --gap: var(--spacing-small);
  margin: calc(var(--gap) / -2);
  & > * {
    margin: calc(var(--gap) / 2);
  }
`;

const Main = styled(MainBase)`
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

  @media (max-width: 26em) {
    flex-direction: column;
    & > h2 {
      margin-bottom: var(--spacing-large);
    }
  }
`;

const BlockTitle = styled.h2`
  margin-right: var(--spacing-large);
  line-height: 0.5; // To vertically align with top of the cards
  width: 3em;
`;
