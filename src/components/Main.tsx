import styled from 'styled-components';

/**
 * Wrapper for main content of page, utilizing CSS grid lines
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Layout_using_Named_Grid_Lines
 */
export const Main = styled.main`
  display: grid;
  grid-template-columns: [main-start] 1fr [content-start] min(var(--content-width), 100%) [content-end] 1fr [main-end];
  grid-template-rows: min-content;

  height: 100%;
  overflow: auto;

  & > * {
    grid-column: content;
  }
`;
