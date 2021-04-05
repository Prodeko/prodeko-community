import { Card, CardList } from 'components/Card';
import { itemTransitionUp } from 'components/transitionConfigs';
import { AnimatePresence, m } from 'framer-motion';
import styled from 'styled-components';
import { Article } from 'types';

type ArticleBlockProps = {
  articles: Article[];
  year: number | string;
};

/**
 * Group of articles for a specific year
 */
export const ArticleBlock: React.FC<ArticleBlockProps> = ({ articles, year }) => (
  <>
    <BlockTitle>{year}</BlockTitle>
    <CardList layout="position">
      <AnimatePresence>
        {articles.map((article) => (
          <m.li key={article.id} variants={itemTransitionUp} layout="position">
            <Card article={article} />
          </m.li>
        ))}
      </AnimatePresence>
    </CardList>
  </>
);

const BlockTitle = styled.h2`
  margin-right: var(--spacing-large);
  line-height: 0.5; // To vertically align with top of the cards
  width: 3em;
`;
