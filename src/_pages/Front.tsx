import { getFrontPageData } from 'api';
import { useGlobalContext } from 'api/globalContext';
import { Banner } from 'components/Banner';
import { Card, CardList, CardWrapper } from 'components/Card';
import { Line } from 'components/Line';
import { Main } from 'components/Main';
import { TextLink } from 'components/TextLink';
import { NextPage } from 'next';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import styled from 'styled-components';
import useSWR from 'swr';
import { ARTICLE_TYPES, FrontPageData } from 'types';
import { slugify } from 'utils/slugify';

export const Front: NextPage<FrontPageData> = (props) => {
  const { data } = useSWR('frontPageData', getFrontPageData, { initialData: props });
  const { language, routes } = useGlobalContext();
  const {
    background_banner,
    background_banner_narrow,
    background_animation,
    main_logo,
    highlighted_articles,
    translations,
  } = data!;

  const { logo_alternative_text, see_more_link } = translations[language];

  const archiveRoute = routes[language].find((route) => route.template === 'archive')!;

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
          <CardSectionTitle>
            <Link
              href={{
                pathname: slugify(archiveRoute.slug),
                query: { filter: ARTICLE_TYPES.filter((t) => t !== type) },
              }}
              passHref
            >
              <TitleLink>
                {translations[language][`${type}s_title` as const]} <FiArrowRight />
              </TitleLink>
            </Link>
          </CardSectionTitle>
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

      {archiveRoute && (
        <MoreLinkWrapper>
          <Link href={slugify(archiveRoute.slug)} passHref>
            <MoreLink>
              {see_more_link} <FiArrowRight />
            </MoreLink>
          </Link>
        </MoreLinkWrapper>
      )}
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

const TitleLink = styled.a`
  display: inline-flex;
  position: relative;
  text-decoration: none;
  color: unset;

  & > svg {
    position: absolute;
    right: -1.2em;
    stroke-width: 0.5;
    transition-property: opacity transform;
    transition-duration: 0.7s;
    transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);

    opacity: 0;
    transform: translateX(-1em);
  }

  &:focus > svg,
  &:hover > svg {
    opacity: 1;
    transform: translateX(0);
  }
`;

const MoreLinkWrapper = styled.div`
  margin-top: calc(var(--spacing-xlarge) * 1.5);
  margin-left: auto;
  margin-right: auto;
`;

const MoreLink = styled(TextLink)`
  display: inline-flex;
  align-items: center;
  font-size: var(--text-navigation);

  & > svg {
    margin-left: 0.5em;
  }
`;
