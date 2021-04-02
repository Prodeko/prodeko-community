import styled from 'styled-components';
import { m } from 'framer-motion';

import { mainTransitions } from 'components/transitionConfigs';
import { Footer } from 'components/Footer';

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
})`
  display: grid;
  grid-template-rows: min-content;
  grid-template-columns:
    [main-start] 1fr [content-start]
    min(var(--content-width), var(--min-content-width))
    [content-end] 1fr [main-end];

  & > * {
    grid-column: content;
  }

  & > footer {
    grid-column: main;
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
