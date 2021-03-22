import styled from 'styled-components';

/** Decorative line component */
export const Line = styled.div<{ variant?: 'long' }>`
  height: 1px;
  background-color: currentColor;
  width: ${(p) => (p.variant === 'long' ? 4 : 2)}rem;
`;
