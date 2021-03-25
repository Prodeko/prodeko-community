import { NextPage } from 'next';
import styled from 'styled-components';
import { FiExternalLink } from 'react-icons/fi';

import { Article as ArticleType } from 'types';
import { useGlobalContext } from 'api/globalContext';
import { useAuth } from 'api/useAuth';

import { Main as MainBase } from 'components/Main';
import { TextLink } from 'components/TextLink';
import { ArticleBody } from 'components/ArticleBody';
import { BlogBanner } from '_pages/Article/BlogBanner';
import { ArticleInfo } from '_pages/Article/ArticleInfo';
import { Author } from '_pages/Article/Author';
import { PodcastBanner } from '_pages/Article/PodcastBanner';
import { VideoBanner } from '_pages/Article/VideoBanner';
import { CommentForm } from '_pages/Article/CommentForm';
import { Comment } from '_pages/Article/Comment';

type ArticleProps = {
  article: ArticleType;
};

export const Article: NextPage<ArticleProps> = ({ article }) => {
  const { language } = useGlobalContext();
  const { user, loginUrl } = useAuth();
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

          <CommentsTitle>Kommentit</CommentsTitle>

          {!user && (
            <LoginLink href={loginUrl}>
              Kirjaudu sisään osallistuaksesi keskusteluun
              <ExternalLinkIcon />
            </LoginLink>
          )}
          <CommentsList>
            {article.comments
              ?.filter((comment) => comment.parent_comment === null)
              .map((comment) => (
                <Comment comment={comment} key={comment.id} />
              ))}
          </CommentsList>

          <CommentForm articleId={article.id} />
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

const CommentsTitle = styled.h2`
  margin-top: var(--spacing-xlarge);
`;

const CommentsList = styled.ol`
  margin-top: var(--spacing-xlarge);
  margin-bottom: var(--spacing-xlarge);
  & > * + * {
    margin-top: var(--spacing-xlarge);
  }
`;

const LoginLink = styled(TextLink)`
  --padding: 0px;
`;

const ExternalLinkIcon = styled(FiExternalLink)`
  margin-left: 0.5em;
  margin-bottom: -0.1em;
`;
