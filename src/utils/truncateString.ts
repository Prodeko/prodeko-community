/**
 * Truncates a string up to `maxLength`, and adds a trailing ellipsis
 */
export const truncateString = (string: string, maxLength = 150) => {
  if (string.length <= maxLength) return string;
  const trimmedString = string.substring(0, maxLength);
  return `${trimmedString.substr(
    0,
    Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))
  )}...`;
};
