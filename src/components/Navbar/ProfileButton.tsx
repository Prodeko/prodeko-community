import { useGlobalContext } from 'api/globalContext';
import { useAuth } from 'api/useAuth';
import { ProfileModal } from 'components/Navbar/ProfileModal';
import { SrOnly } from 'components/SrOnly';
import { TextLink } from 'components/TextLink';
import { itemTransitionDown } from 'components/transitionConfigs';
import { m } from 'framer-motion';
import React, { useState } from 'react';
import styled from 'styled-components';
import { getProductionAssetUrl } from 'utils/getProductionAssetUrl';

export const ProfileButton: React.FC = (props) => {
  const { user, loginUrl, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen((prev) => !prev);
  const closeModal = () => setModalOpen(false);

  const { language, commonData } = useGlobalContext();
  const { log_out_link_text, profile_button_alt_text } = commonData.translations[language];

  const onLogout = () => {
    logout();
    closeModal();
  };

  return (
    <>
      <ProfileButtonWrapper
        {...props}
        variants={itemTransitionDown}
        onClick={toggleModal}
        loggedIn={!!user}
        key="profileButton"
      >
        {user ? (
          <>
            <ProfileImage src={getProductionAssetUrl(commonData.user_default_picture)} alt="" />
            <SrOnly>{profile_button_alt_text}</SrOnly>
          </>
        ) : (
          <>
            <span aria-hidden>?</span>
            <SrOnly>{profile_button_alt_text}</SrOnly>
          </>
        )}
      </ProfileButtonWrapper>

      <ProfileModal isOpen={modalOpen} onRequestClose={closeModal}>
        <ModalTitle>{user ? `${user.first_name} ${user.last_name}` : 'Not logged in'}</ModalTitle>

        {user && <LogoutButton onClick={onLogout}>{log_out_link_text}</LogoutButton>}

        {!user && <ModalLink href={loginUrl}>Log in</ModalLink>}
      </ProfileModal>
    </>
  );
};

const ProfileButtonWrapper = styled(m.button)<{ loggedIn?: boolean }>`
  --size: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size);
  height: var(--size);
  padding: 0;

  border: none;
  border-radius: 999px;
  background-color: ${(p) => (p.loggedIn ? 'var(--gray-lighter)' : 'var(--gray-dark)')};
  color: var(--gray-lighter);
`;

const ProfileImage = styled.img`
  padding: var(--spacing-small);
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
