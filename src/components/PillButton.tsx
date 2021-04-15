import React from 'react';
import styled, { css } from 'styled-components';

type PillButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  variant: 'neutral' | 'confirm' | 'cancel';
  outlined?: boolean;
};

export const PillButton: React.FC<PillButtonProps> = ({ variant, outlined, ...rest }) => {
  if (variant === 'neutral') {
    if (outlined) {
      return <NeutralButtonOutlined {...rest} />;
    } else {
      return <NeutralButton {...rest} />;
    }
  } else if (variant === 'confirm') {
    return <ConfirmButton {...rest} />;
  } else if (variant === 'cancel') {
    return <CancelButton {...rest} />;
  }
  return <></>;
};

export const buttonBase = css`
  font-size: 1.125em;
  border-radius: 999px;
  border: none;

  display: flex;
  align-items: center;
  padding: 0.4em 0.9em;

  transition: transform cubic-bezier(0.165, 0.84, 0.44, 1) 0.5s;

  & > svg {
    margin-right: 0.5em;
    font-size: 1.2em;
  }

  &[disabled] {
    color: var(--gray-light);
    background-color: var(--gray-lighter);
    box-shadow: none;
  }

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.95);
    transition: transform cubic-bezier(0.165, 0.84, 0.44, 1) 0.2s;
  }
`;

const NeutralButton = styled.button`
  ${buttonBase}
  background-color: var(--neutral);
  color: var(--white);
`;

const NeutralButtonOutlined = styled.button`
  ${buttonBase}
  box-shadow: 0 0 0 1.5px currentColor inset;
  background-color: transparent;
  color: var(--neutral-dark);
`;

const ConfirmButton = styled.button`
  ${buttonBase}
  background-color: var(--confirm-background);
  color: var(--confirm);
`;

const CancelButton = styled.button`
  ${buttonBase}
  box-shadow: 0 0 0 1.5px currentColor inset;
  background-color: transparent;
  color: var(--danger);
`;
