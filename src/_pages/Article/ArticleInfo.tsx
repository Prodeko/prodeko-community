import styled from 'styled-components';

import { Article } from 'types';
import { ArticleStats } from 'components/ArticleStats';

export const ArticleInfo: React.FC<{ article: Article }> = ({ article }) => (
  <ArticleInfoWrapper>
    <ArticleInfoContents>
      <time dateTime={article.publish_date}>
        {new Date(article.publish_date).toLocaleDateString('fi-FI')}
      </time>
      {article.author?.name}
    </ArticleInfoContents>

    <ArticleStats article={article} />
  </ArticleInfoWrapper>
);

const ArticleInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--gray-light);
`;

const ArticleInfoContents = styled.div`
  time {
    margin-right: 1em;
  }
`;
