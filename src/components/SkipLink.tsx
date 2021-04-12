import { SrOnly } from 'components/SrOnly';
import styled from 'styled-components';

export const SkipLink = styled(SrOnly).attrs({ as: 'a', href: '#main-content' })`
  &:focus {
    background: var(--white);
    clip: unset !important;
    -webkit-clip-path: unset !important;
    clip-path: unset !important;
    height: unset !important;
    width: unset !important;
    padding: var(--spacing-regular) !important;
    position: fixed !important;
    top: var(--spacing-regular);
    left: var(--spacing-regular);
    z-index: 9999;
  }
`;
