import Modal from 'react-modal';
import styled from 'styled-components';

Modal.setAppElement('#__next');
type ModalProps = Modal['props'];

type ModalAdapterProps = ModalProps & {
  modalClassName: string;
};

/**
 * `react-modal` has some funky styling defaults so we use this adapter
 * component to ensure we can style it with `styled-components`
 */
const ModalAdapter: React.FC<ModalAdapterProps> = ({ className, modalClassName, ...props }) => (
  <Modal
    className={modalClassName}
    portalClassName={className as string}
    bodyOpenClassName="portalOpen"
    {...props}
  />
);

export const ProfileModal = styled(ModalAdapter).attrs({
  overlayClassName: 'Overlay',
  modalClassName: 'Modal',
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;

  & .Overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: auto;
  }

  & .Modal {
    position: absolute;
    top: calc(var(--navbar-height) + var(--spacing-regular));
    right: var(--spacing-regular);
    padding: var(--spacing-regular);
    border-radius: var(--border-radius-small);

    background-color: var(--white);
    box-shadow: var(--dark-shadow);

    &:focus:not(:focus-visible) {
      outline: none;
    }

    & > * + * {
      margin-top: var(--spacing-regular);
    }
  }
`;
