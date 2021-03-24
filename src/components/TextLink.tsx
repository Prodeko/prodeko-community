import styled from 'styled-components';

export const TextLink = styled.a`
  padding: var(--spacing-small);
  text-decoration: none;
  color: currentColor;

  &[aria-current='true'] {
    font-weight: 700;
    text-decoration: underline;
  }
`;
