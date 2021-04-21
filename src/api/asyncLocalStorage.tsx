/**
 * Directus SDK needs an asynchronous store with the following call signatures
 * for storing and refreshing authentication so we can wrap localstorage with
 * async methods to fulfill that need.
 *
 * TODO: not relevant in the latest versions of `@directus/sdk`, should be removed
 */
export const asyncLocalStorage = {
  setItem: async function (key: string, value: string) {
    return localStorage.setItem(key, value);
  },
  getItem: async function (key: string) {
    return localStorage.getItem(key);
  },
  removeItem: async function (key: string) {
    return localStorage.removeItem(key);
  },
};
