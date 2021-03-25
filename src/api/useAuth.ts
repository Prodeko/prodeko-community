import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createGlobalState, useCookie } from 'react-use';

import { directus, getAccessToken, getMe } from 'api';
import { User } from 'types';
import { API_URL } from 'api/config';

const useGlobalValue = createGlobalState<User | null>(null);

/**
 * Catch-all hook for handling auth in app. If `user` is not null on return,
 * it represents the user currently authenticated.
 *
 * We use Prodeko OAuth to log users in, handled by a custom Directus endpoint
 * (`/directus/endpoints/prodeko-auth/index.js`). To utilize built-in
 * permission management of Directus, we create a new Directus user for each
 * unique successful OAuth login, effectively mirroring the base user data in
 * this application.
 *
 * Auth state is preserved in localstorage so that valid sessions don't
 * disappear if user closes and re-opens the site. In case the session has
 * expired, it is cleaned out automatically.
 */
export function useAuth() {
  const [user, setUser] = useGlobalValue();
  const [oldRefreshToken, _, deleteOldRefreshToken] = useCookie('directus_refresh_token');

  const { asPath } = useRouter();
  /** For user to begin Prodeko OAuth flow, navigate them to loginUrl */
  const [loginUrl, setLoginUrl] = useState('');

  // When using the Prodeko OAuth to login, the user is directed to a separate
  // login page that exists outside this application. We would like them to
  // return to where they left off, so we append the current page url to the
  // login request for it to redirect the user back to the right place.
  useEffect(() => {
    const loginUrlBase = `${API_URL}/custom/prodeko-auth`;
    const currentPage = window.location.href;
    const redirect = currentPage ? `?redirect=${encodeURIComponent(currentPage)}` : '';
    setLoginUrl(`${loginUrlBase}${redirect}`);
  }, [asPath]);

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
    await directus.auth.refresh(true);

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

  // On initial mount
  useEffect(() => {
    // If we ever end up with a `directus_refresh_token` cookie (as we do when
    // using the authentication link) we immediately consume it and try to gain
    // a proper access token for our Directus SDK instance.
    if (oldRefreshToken) {
      deleteOldRefreshToken();
      authenticate(oldRefreshToken);
    }

    // When in browser, if Directus SDK doesn't have an auth token set but one
    // exists in localstorage, it should mean that user was previously
    // authenticated and is now returning to the site. We try to do a refresh
    // on their session using the data still lying around in localstorage
    if (directus.auth.token === null) {
      const oldToken = localStorage.getItem('directus_access_token');
      if (oldToken) {
        // If the refresh call succeeds, set the currently authenticated user
        // correctly, else clear previous tokens
        directus.auth
          .refresh(true)
          .then(refreshUser)
          .catch((e) => {
            if (e.response.status === 401) {
              // Refresh token expired while app was offline so there was no
              // chance to automatically refresh, gotta reset the auth state
              localStorage.removeItem('directus_access_token');
              localStorage.removeItem('directus_access_token_expires');
              localStorage.removeItem('directus_refresh_token');
            }
          });
      }
    } else {
      // SDK already initialized and authenticated, gotta fetch user to state
      refreshUser();
    }
  }, []);

  return { user, loginUrl, logout };
}
