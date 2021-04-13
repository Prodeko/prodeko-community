import { useGlobalContext } from 'api/globalContext';
import { useAuth } from 'api/useAuth';
import { ProfileModal } from 'components/Navbar/ProfileModal';
import { ProfilePicture } from 'components/ProfilePicture';
import { SrOnly } from 'components/SrOnly';
import { itemTransitionDown } from 'components/transitionConfigs';
import { m } from 'framer-motion';
import React, { useState } from 'react';
import styled from 'styled-components';

export const ProfileButton: React.FC = (props) => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen((prev) => !prev);
  const closeModal = () => setModalOpen(false);

  const { language, commonData } = useGlobalContext();
  const { profile_button_alt_text } = commonData.translations[language];

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
            <ProfilePicture user={user} defaultPicture={commonData.user_default_picture} />
            <SrOnly>{profile_button_alt_text}</SrOnly>
          </>
        ) : (
          <>
            <span aria-hidden>?</span>
            <SrOnly>{profile_button_alt_text}</SrOnly>
          </>
        )}
      </ProfileButtonWrapper>

      <ProfileModal isOpen={modalOpen} onClose={closeModal} />
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

  overflow: hidden;
  border: none;
  border-radius: 999px;
  background-color: ${(p) => (p.loggedIn ? 'transparent' : 'var(--gray-dark)')};
  color: var(--gray-lighter);
`;
