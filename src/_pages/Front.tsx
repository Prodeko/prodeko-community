import { getFrontPageData } from 'api';
import { useGlobalContext } from 'api/globalContext';
import { Banner } from 'components/Banner';
import { Card, CardList, CardWrapper } from 'components/Card';
import { Line } from 'components/Line';
import { Main } from 'components/Main';
import { NextPage } from 'next';
import styled from 'styled-components';
import useSWR from 'swr';
import { ARTICLE_TYPES, FrontPageData } from 'types';

export const Front: NextPage<FrontPageData> = (props) => {
  const { data } = useSWR('frontPageData', getFrontPageData, { initialData: props });
  const { language } = useGlobalContext();
  const {
    background_banner,
    background_banner_narrow,
    background_animation,
    main_logo,
    highlighted_articles,
    translations,
  } = data!;

  const { logo_alternative_text } = translations[language];

  return (
    <Main>
      <Banner
        bannerUrl={background_banner}
        bannerNarrowUrl={background_banner_narrow}
        animationUrl={background_animation}
        logoUrl={main_logo}
        logoText={logo_alternative_text}
      />

      {ARTICLE_TYPES.map((type) => (
        <CardSectionWrapper key={type}>
          <CardSectionTitle>{translations[language][`${type}s_title` as const]}</CardSectionTitle>
          <Line variant="long" />
          <CardList>
            {highlighted_articles
              .filter((a) => a.type === type)
              .map((article) => (
                <CardWrapper key={article.id}>
                  <Card article={article} />
                </CardWrapper>
              ))}
          </CardList>
        </CardSectionWrapper>
      ))}
    </Main>
  );
};

const CardSectionWrapper = styled.section`
  & + & {
    margin-top: calc(var(--spacing-xlarge) * 1.5);
  }

  & > * + * {
    margin-top: var(--spacing-medium);
  }

  &:first-of-type {
    color: var(--white);
    margin-top: var(--below-banner-offset);
  }
`;

const CardSectionTitle = styled.h2`
  font-size: var(--text-title);
`;
