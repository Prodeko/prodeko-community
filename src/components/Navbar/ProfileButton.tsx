import React, { useState } from 'react';
import styled from 'styled-components';

import { useGlobalContext } from 'api/globalContext';
import { ProfileModal } from 'components/Navbar/ProfileModal';
import { TextLink } from 'components/TextLink';
import { FiUser } from 'react-icons/fi';
import { useAuth } from 'api/useAuth';

interface ProfileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ProfileButton: React.FC<ProfileButtonProps> = ({ children, ...rest }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { language, commonData } = useGlobalContext();
  const {} = commonData.translations[language];
  const { user, loginUrl, logout } = useAuth();

  return (
    <>
      <ButtonWrapper {...rest} onClick={() => setModalOpen((prev) => !prev)}>
        {user ? <FiUser /> : '?'}
      </ButtonWrapper>

      <ProfileModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
        <ModalTitle>sup</ModalTitle>

        {user && <button onClick={logout}>logout</button>}

        <TextLink href={loginUrl}>Log in</TextLink>
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
