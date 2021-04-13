import { useGlobalContext } from 'api/globalContext';
import { useAuth } from 'api/useAuth';
import { Line } from 'components/Line';
import { Modal, ModalProps } from 'components/Modal';
import { ProfilePicture } from 'components/ProfilePicture';
import { SrOnly } from 'components/SrOnly';
import { TextLink } from 'components/TextLink';
import { useEffect, useRef, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import styled from 'styled-components';

type ProfileModalProps = ModalProps & {
  onClose: () => void;
};

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, ...props }) => {
  const { user, loginUrl, logout, setUserAvatar } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const onLogout = () => {
    logout();
    onClose();
  };

  const { language, commonData } = useGlobalContext();
  const { log_out_link_text } = commonData.translations[language];

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0] || null);

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setFile(null);
  };

  // If the user selects a file for the upload input, we go ahead and initialize
  // the flow of changing profile pictures right away.
  useEffect(() => {
    if (file) {
      setUserAvatar(file, clearInput);
    }
  }, [file]);

  return (
    <Modal {...props} onRequestClose={onClose}>
      {user && (
        <UploadInputWrapper>
          <ProfilePicture user={user} defaultPicture={commonData.user_default_picture} />
          <UploadInputLabel>
            <FiUploadCloud />
            <SrOnly>
              <input
                onChange={onFileInputChange}
                type="file"
                ref={inputRef}
                accept="image/png, image/jpeg"
              />
            </SrOnly>
          </UploadInputLabel>
        </UploadInputWrapper>
      )}

      <ModalTitle>{user ? `${user.first_name} ${user.last_name}` : 'Not logged in'}</ModalTitle>

      <Line />

      {user && <LogoutButton onClick={onLogout}>{log_out_link_text}</LogoutButton>}

      {!user && <ModalLink href={loginUrl}>Log in</ModalLink>}
    </Modal>
  );
};

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

const UploadInputWrapper = styled.div`
  position: relative;
`;

const UploadInputLabel = styled.label`
  --size: 3rem;
  background-color: var(--highlight);
  height: var(--size);
  width: var(--size);
  position: absolute;
  right: 0;
  bottom: 0;
  border-radius: 999px;
  box-shadow: var(--card-shadow);

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;

  & > svg {
    stroke-width: 1.5;
  }

  transition: transform ease 0.3s;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;
