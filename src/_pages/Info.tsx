import { NextPage } from 'next';
import styled from 'styled-components';

import { InfoPageData } from 'types';
import { useGlobalContext } from 'api/globalContext';
import { Main } from 'components/Main';
import { Banner } from 'components/Banner';
import { Line } from 'components/Line';

export const Info: NextPage<InfoPageData> = ({ background_banner, main_logo, translations }) => {
  const { language } = useGlobalContext();
  const { page_title, body } = translations[language];

  return (
    <Main>
      <Banner bannerUrl={background_banner} logoUrl={main_logo} decorative />

      <Article>
        <h1>{page_title}</h1>
        <Line variant="long" />
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </Article>
    </Main>
  );
};

const Article = styled.article`
  background-color: var(--white);
  border-radius: var(--border-radius-small);
  margin-top: -8rem;
  padding: var(--spacing-medium) var(--spacing-large);

  * + * {
    margin-top: var(--spacing-regular);
  }

  p {
    color: var(--gray-dark);
  }
`;

const CardSectionTitle = styled.h2`
  line-height: 0.7;
  font-size: 3rem;
  font-weight: 700;
`;
