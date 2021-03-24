import styled from 'styled-components';

export const ArticleBody = styled.article`
  background-color: var(--white);

  & > * + * {
    margin-top: var(--spacing-regular);
  }

  p {
    color: var(--gray-dark);
  }
`;
