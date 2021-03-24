import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';

import { LANGUAGES } from 'types';
import { useGlobalContext } from 'api/globalContext';
import { TextLink } from 'components/TextLink';

export const LanguageSwitcher: React.FC = () => {
  const { language, alternativeSlugs } = useGlobalContext();
  const { query } = useRouter();
  // We want to preserve query params other than the current route on language
  // switch so that switching works as expected with archive filters

  return (
    <LanguagesList>
      {LANGUAGES.map((lang) => (
        <LanguagesListItem key={lang}>
          <Link href={{ query: { ...query, slug: alternativeSlugs[lang] } }} passHref>
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
