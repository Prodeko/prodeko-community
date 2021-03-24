import styled from 'styled-components';

/**
 * Displays a frame of what would be in this element's place,
 * animated with a swiping gradient
 */
export const LoadingSkeleton = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;

  background-color: var(--gray-lighter);

  @keyframes load {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  &:before {
    content: '';
    display: block;
    position: absolute;
    transform: translateX(-100%);
    top: 0;
    height: 100%;
    width: 100%;
    background: linear-gradient(to right, transparent 0%, #d0d0d0 50%, transparent 100%);
    animation: load 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  iframe {
    position: absolute; // Fixes animation overlaying on iframe
  }
`;
