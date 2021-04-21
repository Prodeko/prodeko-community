import { createContext, useContext } from 'react';
import { ArchivePageData, Article, LanguageCode } from 'types';

/** Data which we need to access in random archive page components */
interface ArchiveContext {
  articles: Article[];
  translations: ArchivePageData['translations'][LanguageCode];
}

const ArchiveContext = createContext({} as ArchiveContext);

const useArchiveContext = () => useContext(ArchiveContext);

export { ArchiveContext, useArchiveContext };
