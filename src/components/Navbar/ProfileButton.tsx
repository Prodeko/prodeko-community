import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { useGlobalContext } from 'api/globalContext';
import { ProfileModal } from 'components/Navbar/ProfileModal';
import { TextLink } from 'components/TextLink';
import { FiUser } from 'react-icons/fi';
import { API_URL } from 'api/config';
import { useAuth } from 'api/useAuth';

interface ProfileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ProfileButton: React.FC<ProfileButtonProps> = ({ children, ...rest }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const { asPath } = useRouter();
  const { language, commonData } = useGlobalContext();
  const {} = commonData.translations[language];
  const { user, logout } = useAuth();

  // We want to keep the log-in redirection in sync with the current page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectUrl(`${window.location.href}`);
    }
  }, [asPath]);

  return (
    <>
      <ButtonWrapper {...rest} onClick={() => setModalOpen((prev) => !prev)}>
        {user ? <FiUser /> : '?'}
      </ButtonWrapper>

      <ProfileModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
        <ModalTitle>sup</ModalTitle>

        {user && <button onClick={logout}>logout</button>}

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
