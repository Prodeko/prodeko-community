import { NextPage } from 'next';
import styled from 'styled-components';

import { Article as ArticleProps } from 'types';
import { useGlobalContext } from 'api/globalContext';
import { Main as MainBase } from 'components/Main';
import { ArticleBody } from 'components/ArticleBody';
import { BlogBanner } from '_pages/Article/BlogBanner';
import { ArticleInfo } from '_pages/Article/ArticleInfo';
import { Author } from '_pages/Article/Author';
import { PodcastBanner } from '_pages/Article/PodcastBanner';
import { VideoBanner } from '_pages/Article/VideoBanner';

export const Article: NextPage<ArticleProps> = (article) => {
  const { language } = useGlobalContext();
  const { title, body, ingress } = article.translations[language];

  const header = (() => {
    switch (article.type) {
      case 'blog_post':
        return <BlogBanner title={title} photo={article.photo} />;

      case 'podcast':
        return <PodcastBanner title={title} podcastEmbed={article.spotify_embed} />;

      case 'video':
        return <VideoBanner title={title} videoEmbed={article.youtube_embed} />;
    }
  })();

  return (
    <Main>
      <ArticleWrapper>
        <ArticleBody>
          {header}

          <ArticleInfo article={article} />

          {ingress && <Ingress>{ingress}</Ingress>}

          <Contents dangerouslySetInnerHTML={{ __html: body }} />
        </ArticleBody>

        {article.author && <Author author={article.author} />}
      </ArticleWrapper>
    </Main>
  );
};

const Main = styled(MainBase)`
  --content-width: 70rem;
  padding-top: calc(var(--navbar-height) + var(--spacing-xlarge));

  // This needs to be synced with main element minimum paddings
  --pad: var(--spacing-regular);
`;

const ArticleWrapper = styled.div`
  /*
  display: grid;
  grid-template-columns:
    [article-start]
    min(var(--text-width), 100%)
    [article-end aside-start]
    1fr
    [aside-end];
  grid-gap: calc(var(--pad) + var(--spacing-xlarge));
  */
  display: flex;

  aside {
    margin-left: calc(var(--pad) + var(--spacing-xlarge));
  }
`;

const Contents = styled.div`
  * + * {
    margin-top: var(--spacing-regular);
  }
  h2 {
    margin-top: var(--spacing-large);
  }
`;

const Ingress = styled.p`
  font-size: 1.5rem;
  line-height: 1.2;
  font-style: italic;
  margin-bottom: 1em;
`;
