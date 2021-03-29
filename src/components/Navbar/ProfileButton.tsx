import React, { useState } from 'react';
import styled from 'styled-components';
import { m } from 'framer-motion';

import { useGlobalContext } from 'api/globalContext';
import { useAuth } from 'api/useAuth';
import { ProfileModal } from 'components/Navbar/ProfileModal';
import { TextLink } from 'components/TextLink';
import { FiUser } from 'react-icons/fi';
import { itemTransitionDown } from 'components/transitionConfigs';

export const ProfileButton: React.FC = ({ children, ...rest }) => {
  const { user, loginUrl, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen((prev) => !prev);
  const closeModal = () => setModalOpen(false);

  const { language, commonData } = useGlobalContext();
  const { log_out_link_text } = commonData.translations[language];

  const onLogout = () => {
    logout();
    closeModal();
  };

  return (
    <>
      <ProfileButtonWrapper
        {...rest}
        variants={itemTransitionDown}
        onClick={toggleModal}
        key="profileButton"
      >
        {user ? <FiUser /> : '?'}
      </ProfileButtonWrapper>

      <ProfileModal isOpen={modalOpen} onRequestClose={closeModal}>
        <ModalTitle>{user ? `${user.first_name} ${user.last_name}` : 'Not logged in'}</ModalTitle>

        {user && <LogoutButton onClick={onLogout}>{log_out_link_text}</LogoutButton>}

        {!user && <ModalLink href={loginUrl}>Log in</ModalLink>}
      </ProfileModal>
    </>
  );
};

const ProfileButtonWrapper = styled(m.button)`
  --size: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size);
  height: var(--size);

  border: none;
  border-radius: 999px;
  background-color: var(--gray-dark);
  color: var(--gray-lighter);
`;

const ModalTitle = styled.h2`
  font-size: var(--text-card-title);
`;

const ModalLink = styled(TextLink)`
  --padding: 0px;
`;

const LogoutButton = styled(TextLink).attrs({ as: 'button' })`
  background-color: unset;
  border: none;
  --padding: 0px;
`;
