import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import { LANGUAGES } from 'types';
import { useGlobalContext } from 'api/globalContext';
import { TextLink } from 'components/TextLink';

export const LanguageSwitcher: React.FC = () => {
  const { language, translations } = useGlobalContext();

  return (
    <LanguagesList>
      {LANGUAGES.map((lang) => (
        <LanguagesListItem key={lang}>
          <Link href={translations[lang].slug || ''}>
            <LanguageLink aria-current={lang === language}>{lang}</LanguageLink>
          </Link>
        </LanguagesListItem>
      ))}
    </LanguagesList>
  );
};

const LanguagesList = styled.ul`
  display: flex;
  justify-content: flex-end;
  width: var(--logo-width);
  color: var(--white);
`;

const LanguagesListItem = styled.li`
  & + & {
    &:before {
      content: '/';
    }
  }
`;

const LanguageLink = styled(TextLink)`
  text-transform: uppercase;
`;
