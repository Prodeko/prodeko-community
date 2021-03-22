import DirectusSDK from '@directus/sdk-js';
import { API_URL } from 'api/config';
import { parseCommonData, parseFrontPageData } from 'api/parsers';

const directus = new DirectusSDK(API_URL as string);

/**
 * Directus SDK can accept objects instead of query params.
 *
 * `fields` specifies an array of fields to be fetched from the API,
 */
type Query = {
  fields: string[];
  single?: boolean;
};

function createDataFetcher<T>(collection: string, query: Query, parse: (data: any) => T) {
  return async () => {
    const { data } = await directus.items(collection).read(query);
    const parsedData = parse(data);
    return parsedData;
  };
}

const commonDataQuery = {
  fields: ['*', 'translations.*'], // Fetch all fields and all relational translation data
  single: true, // Data modeled as a 'singleton' in Directus
};

export const getCommonData = createDataFetcher('common_data', commonDataQuery, parseCommonData);

const frontPageQuery = {
  ...commonDataQuery,
  fields: [
    ...commonDataQuery.fields,
    'highlighted_articles.*',
    'highlighted_articles.translations.*',
    'highlighted_articles.author.*',
    'highlighted_articles.author.translations.*',
  ],
};

export const getFrontPageData = createDataFetcher('front_page', frontPageQuery, parseFrontPageData);
