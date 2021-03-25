import styled from 'styled-components';

export const TextLink = styled.a`
  --padding: var(--spacing-small);

  position: relative;
  display: inline-block;
  padding: var(--padding);
  text-decoration: none;
  color: currentColor;

  &[aria-current='true'] {
    font-weight: 700;
  }

  &:before {
    content: '';
    position: absolute;
    width: calc(100% - var(--padding) * 2);
    height: 1px;
    bottom: var(--padding);
    left: var(--padding);
    background-color: currentColor;
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;
  }

  &[aria-current='true']:before,
  &:hover:before {
    visibility: visible;
    transform: scaleX(1);
  }

  &[aria-current='true']:before {
    height: 2px;
  }
`;
