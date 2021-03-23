import { createContext, useContext } from 'react';
import { CommonData, CommonPageData, LanguageCode } from 'types';

interface GlobalContext extends CommonPageData {
  commonData: CommonData;
  language: LanguageCode;
}

const GlobalContext = createContext({} as GlobalContext);

const useGlobalContext = () => useContext(GlobalContext);

export { GlobalContext, useGlobalContext };
