import { NextPage } from 'next';
import styled from 'styled-components';

import { InfoPageData } from 'types';
import { useGlobalContext } from 'api/globalContext';
import { Main } from 'components/Main';
import { ArticleBody } from 'components/ArticleBody';
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
        <Contents dangerouslySetInnerHTML={{ __html: body }} />
      </Article>
    </Main>
  );
};

const Article = styled(ArticleBody)`
  border-radius: var(--border-radius-small);
  margin-top: -8rem;
  padding: var(--spacing-medium) var(--spacing-large);
`;

const Contents = styled.div`
  * + * {
    margin-top: var(--spacing-regular);
  }
  h2 {
    margin-top: var(--spacing-large);
  }
`;
