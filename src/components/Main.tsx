import { Footer } from 'components/Footer';
import { mainTransitions } from 'components/transitionConfigs';
import { m } from 'framer-motion';
import styled from 'styled-components';

/**
 * Wrapper for main content of page, utilizing CSS grid lines
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Layout_using_Named_Grid_Lines
 */
const MainWrapper = styled(m.main).attrs({
  initial: 'initial',
  animate: 'enter',
  exit: 'exit',
  variants: mainTransitions,
  id: 'main-content',
})`
  display: grid;
  grid-template-rows: min-content;
  grid-template-columns:
    [main-start] 1fr [content-start]
    min(var(--content-width), var(--min-content-width))
    [content-end] 1fr [main-end];

  & > * {
    grid-column: content;
    max-width: 100%;
  }

  & > footer {
    grid-column: main;
    width: 100%;
  }

  min-height: 100%;
`;

export const Main: React.FC<React.ComponentProps<typeof MainWrapper>> = ({
  children,
  ...props
}) => (
  <MainWrapper {...props}>
    {children}
    <Footer />
  </MainWrapper>
);
