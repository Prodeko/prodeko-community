import { createContext, useContext } from 'react';
import { CommonData, LanguageCode, PageRoutes } from 'types';

/**
 * Some data we want to have available everywhere, and don't mind causing
 * whole-site rerenders if any of these change (they don't).
 */
interface GlobalContext {
  commonData: CommonData;
  language: LanguageCode;
  alternativeSlugs: Record<LanguageCode, string[]>;
  routes: PageRoutes;
}

const GlobalContext = createContext({} as GlobalContext);

const useGlobalContext = () => useContext(GlobalContext);

export { GlobalContext, useGlobalContext };
