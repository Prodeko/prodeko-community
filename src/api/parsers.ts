/**
 * As Directus doesn't return translated data in most usable format, we
 * parse all API calls which has the added benefit of allowing us to
 * typecast our returned data. This file contains the single point of
 * most likeyl failures in the application, as we can never be sure what
 * kind of data a HTTP call returns, so all of our parameters are typed
 * as `any`.
 */

// eslint-disable @typescript-eslint/no-explicit-any

import { ASSET_URL } from 'api/config';
import {
  ArchivePageData,
  Article,
  Author,
  CommonData,
  FrontPageData,
  InfoPageData,
  LANGUAGE_KEYS,
  User,
} from 'types';

/**
 * Parses a generic translated Directus field into an object with language
 * codes as keys for data in said language, for example:
 *
 * ```
 *  [
 *    {
 *      languages_code: 'fi-FI',
 *      finnish_data: 'moi',
 *      ...
 *    },
 *    {
 *      languages_code: 'en-US',
 *      english_data: 'hey',
 *      ...
 *    }
 *  ]
 * ```
 *
 * gets transformed into
 *
 * ```
 *  {
 *    fi: {
 *      finnish_data: 'moi',
 *      ...
 *    },
 *    en: {
 *      english_data: 'hey',
 *      ...
 *    }
 *  }
 * ```
 */
const parseTranslationData = (data: any[]) =>
  data.reduce((acc, curr) => {
    const lang = curr.languages_code as keyof typeof LANGUAGE_KEYS;
    const data = { [LANGUAGE_KEYS[lang]]: curr };
    return { ...acc, ...data };
  }, {});

/**
 * Directus has a specialized assets endpoint, so we need to create custom urls
 * to utilize it
 */
export const parseImageUrl = (imageId: string) => `${ASSET_URL}/${imageId}`;

export const parseUser = (data: any): User => ({
  ...data,
  avatar: data.avatar ? parseImageUrl(data.avatar) : null,
  language: LANGUAGE_KEYS[data.language as keyof typeof LANGUAGE_KEYS],
});

export const parseCommonData = (data: any): CommonData => ({
  ...data,
  logo: parseImageUrl(data.logo),
  prodeko_logo: parseImageUrl(data.prodeko_logo),
  translations: parseTranslationData(data?.translations),
});

const parseAuthor = (data: any): Author => ({
  ...data,
  photo: parseImageUrl(data.photo),
  translations: parseTranslationData(data.translations),
});

const parseArticle = (data: any): Article => ({
  ...data,
  author: data.author ? parseAuthor(data.author) : null,
  photo: parseImageUrl(data.photo),
  translations: parseTranslationData(data.translations),
});

export const parseArticles = (data: any): Article[] => data.map(parseArticle);

export const parseFrontPageData = (data: any): FrontPageData => ({
  ...data,
  background_banner: parseImageUrl(data.background_banner),
  main_logo: parseImageUrl(data.main_logo),
  translations: parseTranslationData(data.translations),
  highlighted_articles: data.highlighted_articles.map(parseArticle),
});

export const parseInfoPageData = (data: any): InfoPageData => ({
  ...data,
  background_banner: parseImageUrl(data.background_banner),
  main_logo: parseImageUrl(data.main_logo),
  translations: parseTranslationData(data.translations),
});

export const parseArchivePageData = (data: any): ArchivePageData => ({
  ...data,
  translations: parseTranslationData(data.translations),
});
