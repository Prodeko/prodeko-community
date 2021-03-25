import React, { useEffect } from 'react';
import { useCookie } from 'react-use';

import { directus } from 'api';
import { useAuth } from 'api/useAuth';

export const AuthWrapper: React.FC = ({ children }) => {
  const { authenticate, refreshUser } = useAuth();

  const [oldRefreshToken, _, deleteOldRefreshToken] = useCookie('directus_refresh_token');
  // If we ever end up with a `directus_refresh_token` cookie (as we do when
  // using the authentication link) we immediately consume it and try to gain
  // a proper access token for our Directus SDK instance.
  if (oldRefreshToken) {
    deleteOldRefreshToken();
    authenticate(oldRefreshToken);
  }

  useEffect(() => {
    // When in browser, if Directus SDK doesn't have an auth token set but one
    // exists in localstorage, it should mean that user was previously
    // authenticated and is now returning to the site. We try to do a refresh
    // on their session using the data still lying around in localstorage
    if (typeof window !== 'undefined' && directus.auth.token === null) {
      const oldToken = localStorage.getItem('directus_access_token');
      if (oldToken) {
        // If the refresh call succeeds, set the currently authenticated user
        // correctly, else clear previous tokens
        directus.auth
          .refresh(false)
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
    }
  }, []);

  return <>{children}</>;
};
