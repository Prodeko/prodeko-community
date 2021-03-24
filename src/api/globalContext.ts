import { createContext, useContext } from 'react';
import { CommonData, LanguageCode, PageRoutes } from 'types';

interface GlobalContext {
  commonData: CommonData;
  language: LanguageCode;
  alternativeSlugs: Record<LanguageCode, string[]>;
  routes: PageRoutes;
}

const GlobalContext = createContext({} as GlobalContext);

const useGlobalContext = () => useContext(GlobalContext);

export { GlobalContext, useGlobalContext };
