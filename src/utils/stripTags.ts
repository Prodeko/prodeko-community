import he from 'he';

/**
 * Removes all HTML tags and entities from input string
 */
export function stripTags(string: string) {
  return he.decode(string.replace(/(<([^>]+)>)/gi, ''));
}
