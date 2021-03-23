import { NextPage } from 'next';
import styled from 'styled-components';

import { InfoPageData } from 'types';
import { Main } from 'components/Main';
import { Banner } from 'components/Banner';
import { Line } from 'components/Line';
import React from 'react';
import { useGlobalContext } from 'api/globalContext';

export const Info: NextPage<InfoPageData> = ({ background_banner, main_logo, translations }) => {
  const { language } = useGlobalContext();
  const { page_title, body } = translations[language];

  return (
    <Main>
      <Banner bannerUrl={background_banner} logoUrl={main_logo} decorative />

      <Article>
        <Title>{page_title}</Title>
        <Line variant="long" />
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </Article>
    </Main>
  );
};

const Title = styled.h1``;

const Article = styled.article`
  background-color: var(--white);
  border-radius: var(--border-radius-small);
  margin-top: -8rem;
  padding: var(--spacing-medium) var(--spacing-large);

  * + * {
    margin-top: var(--spacing-regular);
  }
`;

const CardSectionTitle = styled.h2`
  line-height: 0.7;
  font-size: 3rem;
  font-weight: 700;
`;
