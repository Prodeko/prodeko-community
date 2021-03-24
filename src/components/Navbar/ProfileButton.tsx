import React from 'react';
import styled from 'styled-components';

interface ProfileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ProfileButton: React.FC<ProfileButtonProps> = ({ children, ...rest }) => {
  return <ButtonWrapper {...rest}>?</ButtonWrapper>;
};

const ButtonWrapper = styled.button`
  --size: 2rem;

  border: none;
  border-radius: 999px;

  width: var(--size);
  height: var(--size);

  background-color: var(--gray-lighter);
`;
