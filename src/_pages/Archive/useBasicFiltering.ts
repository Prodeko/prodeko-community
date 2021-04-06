import { useArticlesContext } from '_pages/Archive/useArticlesContext';
import { useRouter } from 'next/router';
import { Article, ArticleType } from 'types';
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

export const useBasicFiltering = (baseArticles?: Article[]) => {
  const { articles: contextArticles } = useArticlesContext();
  const articles = baseArticles ?? contextArticles;
  const router = useRouter();
  const { query } = router;
  const order = (query.order ?? 'newest') as Order;

  const updateRouterQuery = (key: string, newValue?: string | string[]) =>
    router.replace({ query: { ...query, [key]: newValue } }, undefined, { shallow: true });

  const clearRouterQuery = (key: string) => {
    const { [key]: _, ...restQuery } = query;
    router.replace({ query: restQuery }, undefined, { shallow: true });
  };

  /**
   * Set query parameter for sort appropriately.
   * Doesn't refetch data from server or change browser history
   */
  const sortOnClick = () => {
    if (order === 'newest') {
      updateRouterQuery('order', 'oldest');
    } else {
      updateRouterQuery('order', 'newest');
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
      updateRouterQuery(
        'filter',
        filteredTypes.filter((x) => x !== type)
      );
      router.replace(
        {
          query: { ...query, filter: filteredTypes.filter((x) => x !== type) },
        },
        undefined,
        { shallow: true }
      );
    } else {
      updateRouterQuery('filter', [...getFilteredTypes(query.filter), type]);
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

  return {
    visibleArticles,
    filteredArticles,
    order,
    sortOnClick,
    filteredTypes,
    getPillOnClick,
    updateRouterQuery,
    clearRouterQuery,
  };
};
