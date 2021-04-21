import { FiArrowUp } from 'react-icons/fi';
import { useWindowScroll } from 'react-use';
import styled from 'styled-components';

/**
 * Small "helper" which appears when user has scrolled far down enough
 */
export const ScrollToTop: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const { y } = useWindowScroll();

  return y > 300 ? (
    <Wrapper aria-hidden onClick={scrollToTop}>
      <FiArrowUp />
    </Wrapper>
  ) : null;
};

const Wrapper = styled.button`
  --size: 3rem;
  position: fixed;
  bottom: var(--scroll-top-position);
  right: var(--scroll-top-position);
  width: var(--scroll-top-size);
  height: var(--scroll-top-size);

  border-radius: 999px;
  border: none;
  padding: 0px;
  background-color: var(--white);

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: var(--card-shadow);
  z-index: 999;

  font-size: var(--text-ingress);
  color: var(--gray-light);

  transition: transform cubic-bezier(0.165, 0.84, 0.44, 1) 0.5s;

  & > svg {
    stroke-width: 1.5;
  }

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
    transition: transform cubic-bezier(0.165, 0.84, 0.44, 1) 0.2s;
  }

  animation: 0.7s ease slideIn;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
