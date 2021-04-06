import { createContext, useContext } from 'react';
import { Article } from 'types';

interface ArticlesContext {
  articles: Article[];
}

const ArticlesContext = createContext({} as ArticlesContext);

const useArticlesContext = () => useContext(ArticlesContext);

export { ArticlesContext, useArticlesContext };
