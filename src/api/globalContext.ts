import { createContext, useContext } from 'react';
import { CommonData, CommonPageData, LanguageCode, PageRoutes } from 'types';

interface GlobalContext extends CommonPageData {
  commonData: CommonData;
  language: LanguageCode;
  routes: PageRoutes;
}

const GlobalContext = createContext({} as GlobalContext);

const useGlobalContext = () => useContext(GlobalContext);

export { GlobalContext, useGlobalContext };
