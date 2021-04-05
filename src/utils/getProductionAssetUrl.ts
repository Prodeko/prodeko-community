import { PROD_API_URL } from 'api/config';

/* As we create proper urls for dynamic images when parsing them, we need to
 * re-parse the image into something that can be used by search engines in
 * meta tags
 */
export function getProductionAssetUrl(url: string) {
  const urlBase = PROD_API_URL;
  const urlParts = url.split('/');
  const assetsIndex = urlParts.indexOf('assets');
  const assetParts = urlParts.slice(assetsIndex);
  const assetUrl = assetParts.join('/');
  return `${urlBase}/${assetUrl}`;
}
