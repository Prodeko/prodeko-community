import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import { LANGUAGES } from 'types';
import { useGlobalContext } from 'api/globalContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, translations } = useGlobalContext();

  return (
    <LanguagesList>
      {LANGUAGES.map((lang) => (
        <LanguagesListItem>
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
  color: var(--white);
`;

const LanguagesListItem = styled.li`
  & + & {
    &:before {
      content: '/';
    }
  }
`;

const LanguageLink = styled.a`
  text-transform: uppercase;
  padding: var(--spacing-small);

  ${(p) =>
    p['aria-current']
      ? `
  font-weight: 700;
  text-decoration: underline;
  `
      : ''}
`;
