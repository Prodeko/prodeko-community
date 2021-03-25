/**
 * Directus SDK needs an asynchronous store with the following call signatures
 * for storing and refreshing authentication so we can wrap localstorage with
 * async methods to fulfill that need
 */
export const asyncLocalStorage = {
  setItem: async function (key: string, value: any) {
    return localStorage.setItem(key, value);
  },
  getItem: async function (key: string) {
    return localStorage.getItem(key);
  },
  removeItem: async function (key: string) {
    return localStorage.removeItem(key);
  },
};
