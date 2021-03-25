import { createGlobalState } from 'react-use';

import { directus, getAccessToken, getMe } from 'api';
import { User } from 'types';

const useGlobalValue = createGlobalState<User | null>(null);

export function useAuth() {
  const [user, setUser] = useGlobalValue();

  /**
   * Called when returning from custom authentication endpoint with a refresh
   * token which we can use to gain a proper access token for the current user
   */
  async function authenticate(refreshToken: string) {
    const { access_token, expires, refresh_token } = await getAccessToken(refreshToken);

    directus.auth.token = access_token;
    localStorage.setItem('directus_access_token_expires', expires.toString());
    localStorage.setItem('directus_refresh_token', refresh_token);

    // Manually call refresh to set proper auto-refresh-token-fetcher timeouts
    await directus.auth.refresh(false);

    const currentUser = await getMe();
    setUser(currentUser);
  }

  /** Re-set user to global state on application reload for example */
  async function refreshUser() {
    const currentUser = await getMe();
    setUser(currentUser);
  }

  /** Wrapper for directus logout just in case the API ever changes */
  async function logout() {
    setUser(null);
    return directus.auth.logout();
  }

  return { user, refreshUser, authenticate, logout };
}
