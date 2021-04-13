import ModalBase from 'react-modal';
import styled from 'styled-components';

ModalBase.setAppElement('#__next');
type ModalBaseProps = ModalBase['props'];

type ModalAdapterProps = ModalBaseProps & {
  modalClassName: string;
};

export type ModalProps = Omit<ModalBaseProps, 'modalClassName' | 'overlayClassName'>;

/**
 * `react-modal` has some funky styling defaults so we use this adapter
 * component to ensure we can style it with `styled-components`
 */
const ModalAdapter: React.FC<ModalAdapterProps> = ({ className, modalClassName, ...props }) => (
  <ModalBase
    className={modalClassName}
    portalClassName={className as string}
    bodyOpenClassName="portalOpen"
    {...props}
  />
);

export const Modal = styled(ModalAdapter).attrs({
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
    width: var(--card-min-width);

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
