import { createContext, useContext } from 'react';
import { CommonData, LanguageCode } from 'types';

type GlobalContext = {
  commonData: CommonData;
  language: LanguageCode;
};

const GlobalContext = createContext({} as GlobalContext);

const useGlobalContext = () => useContext(GlobalContext);

export { GlobalContext, useGlobalContext };
