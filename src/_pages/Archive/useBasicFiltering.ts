import { useRouter } from 'next/router';
import { Article, ArticleType } from 'types';
import { groupBy } from 'utils/groupBy';

/**
 * Currently supported sort orders, adding more requires a refactor to sort
 * selection buttons.
 */
export type Order = 'newest' | 'oldest';

/**
 * Callback to give to `Array.sort()` to compare `a` and `b` by the field
 * given by `getValue()`.
 */
function sortBy<T>(a: T, b: T, getValue: (x: T) => number, order: Order) {
  return order === 'oldest' ? getValue(a) - getValue(b) : getValue(b) - getValue(a);
}

export const useBasicFiltering = (articles: Article[]) => {
  const router = useRouter();
  const { query } = router;
  const order = (query.order ?? 'newest') as Order;

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
   * Parse filtered article types from query
   */
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

  return { visibleArticles, order, sortOnClick, filteredTypes, getPillOnClick };
};
