import styled from 'styled-components';

export const TextLink = styled.a`
  padding: var(--spacing-small);

  ${(p) =>
    p['aria-current']
      ? `
  font-weight: 700;
  text-decoration: underline;
  `
      : ''}
`;
