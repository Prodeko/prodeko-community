import { useGlobalContext } from 'api/globalContext';
import { TextLink } from 'components/TextLink';
import { itemTransitionDown } from 'components/transitionConfigs';
import { m } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { LANGUAGES } from 'types';
import { slugify } from 'utils/slugify';

export const LanguageSwitcher: React.FC<{ focusable: boolean }> = ({ focusable }) => {
  const { language, alternativeSlugs } = useGlobalContext();
  const { query } = useRouter();
  // We want to preserve query params other than the current route on language
  // switch so that switching works as expected with archive filters
  const { slug: _, ...sluglessQuery } = query;

  return (
    <LanguagesList variants={itemTransitionDown} key="languages">
      {LANGUAGES.map((lang) => (
        <LanguagesListItem key={lang}>
          <Link
            href={{ pathname: slugify(alternativeSlugs[lang]), query: sluglessQuery }}
            passHref
            scroll={false}
          >
            <LanguageLink aria-current={lang === language} tabIndex={focusable ? 0 : -1}>
              {lang}
            </LanguageLink>
          </Link>
        </LanguagesListItem>
      ))}
    </LanguagesList>
  );
};

const LanguagesList = styled(m.ul)`
  display: flex;
  justify-content: flex-end;

  font-size: 0.85em;
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
