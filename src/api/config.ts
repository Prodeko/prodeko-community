/**
 * We need different urls for server side rendering and browser data updating,
 * so we check the existence of `window` to properly set the url
 */

export const API_URL =
  typeof window === 'undefined' ? process.env.SERVER_API_URL : process.env.NEXT_PUBLIC_API_URL;
export const ASSET_URL =
  typeof window === 'undefined' ? process.env.SERVER_ASSET_URL : process.env.NEXT_PUBLIC_ASSET_URL;
