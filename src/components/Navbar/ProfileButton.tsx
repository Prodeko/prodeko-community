import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import styled from 'styled-components';

import { authenticate, directus } from 'api';
import { useGlobalContext } from 'api/globalContext';
import { ProfileModal } from 'components/Navbar/ProfileModal';
import { TextLink } from 'components/TextLink';
import { FiUser } from 'react-icons/fi';
import { API_URL } from 'api/config';

interface ProfileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ProfileButton: React.FC<ProfileButtonProps> = ({ children, ...rest }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const { asPath } = useRouter();
  const { language, commonData } = useGlobalContext();
  const {} = commonData.translations[language];

  // If we ever end up with a `directus_refresh_token` cookie (as we do when
  // using the authentication link) we immediately consume it and try to gain
  // a proper access token for our Directus SDK instance and thus know that
  // we have been authenticated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectUrl(`${window.location.href}`);
      const token = Cookies.get('directus_refresh_token');
      if (token) {
        Cookies.remove('directus_refresh_token');
        authenticate(token);
      }
    }
  }, [asPath]);

  useEffect(() => {
    (async () => {
      if (directus.auth.token) {
        const { data } = await directus.users.me.read({ fields: ['*', '*.*'], single: true });
        console.log(data);
      }
    })();
  }, [directus.auth.token]);

  return (
    <>
      <ButtonWrapper {...rest} onClick={() => setModalOpen((prev) => !prev)}>
        ?
      </ButtonWrapper>

      <ProfileModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
        <ModalTitle>sup</ModalTitle>

        <TextLink
          href={`${API_URL}/custom/prodeko-auth${
            redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''
          }`}
        >
          Log in
        </TextLink>
      </ProfileModal>
    </>
  );
};

const ButtonWrapper = styled.button`
  --size: 2rem;

  border: none;
  border-radius: 999px;

  width: var(--size);
  height: var(--size);

  background-color: var(--gray-dark);
  color: var(--gray-lighter);
`;

const ModalTitle = styled.h2`
  font-size: var(--text-card-title);
`;
