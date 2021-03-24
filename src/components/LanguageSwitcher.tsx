import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';

import { LANGUAGES } from 'types';
import { useGlobalContext } from 'api/globalContext';
import { TextLink } from 'components/TextLink';
import { slugify } from 'utils/slugify';

export const LanguageSwitcher: React.FC = () => {
  const { language, alternativeSlugs } = useGlobalContext();
  const { query } = useRouter();
  // We want to preserve query params other than the current route on language
  // switch so that switching works as expected with archive filters
  const { slug, ...sluglessQuery } = query;

  return (
    <LanguagesList>
      {LANGUAGES.map((lang) => (
        <LanguagesListItem key={lang}>
          <Link href={{ pathname: slugify(alternativeSlugs[lang]), query: sluglessQuery }} passHref>
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
