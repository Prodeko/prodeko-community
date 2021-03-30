import { NextPage } from 'next';
import styled from 'styled-components';
import { FiExternalLink } from 'react-icons/fi';
import { AnimatePresence, m } from 'framer-motion';

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
import { RainbowButton } from '_pages/Article/RainbowButton';
import { itemTransitionDown } from 'components/transitionConfigs';

type ArticleProps = {
  article: ArticleType;
};

export const Article: NextPage<ArticleProps> = ({ article }) => {
  const { language, commonData } = useGlobalContext();
  const { user, loginUrl } = useAuth();
  const { title, body, ingress } = article.translations[language];

  const {
    like_count_text,
    comment_section_title,
    log_in_to_comment_prompt,
  } = commonData.translations[language];

  const header = (() => {
    switch (article.type) {
      case 'blog_post':
        return (
          <BlogBanner title={title} photo={article.photo || commonData.article_default_picture} />
        );

      case 'podcast':
        return <PodcastBanner title={title} podcastEmbed={article.spotify_embed} />;

      case 'video':
        return <VideoBanner title={title} videoEmbed={article.youtube_embed} />;
    }
  })();

  return (
    <Main>
      <ContentsWrapper>
        <ArticleWrapper>
          <ArticleBody>
            {header}

            <ArticleInfo article={article} />

            {ingress && <Ingress>{ingress}</Ingress>}

            <Contents dangerouslySetInnerHTML={{ __html: body }} />

            <RainbowButton articleId={article.id} likedBy={article.liked_by}>
              {article.liked_by.length} {like_count_text}
            </RainbowButton>
          </ArticleBody>

          {article.author && <Author author={article.author} />}
        </ArticleWrapper>

        <Comments layout>
          <CommentsTitle>{comment_section_title}</CommentsTitle>

          {!user && (
            <LoginLink href={loginUrl}>
              {log_in_to_comment_prompt}
              <ExternalLinkIcon />
            </LoginLink>
          )}
          <CommentsList>
            <AnimatePresence>
              {article.comments
                ?.filter((comment) => comment.parent_comment === null)
                .map((comment) => (
                  <m.li key={comment.id} variants={itemTransitionDown} layout="position">
                    <Comment comment={comment} key={comment.id} />
                  </m.li>
                ))}
            </AnimatePresence>
          </CommentsList>

          <CommentForm articleId={article.id} />
        </Comments>
      </ContentsWrapper>
    </Main>
  );
};

const Main = styled(MainBase)`
  justify-items: center;

  // This needs to be synced with main element minimum paddings
  --pad: var(--spacing-regular);
`;

const ArticleWrapper = styled.div`
  display: flex;

  aside {
    margin-left: calc(var(--pad) + var(--spacing-xlarge));
    border-left: 1px solid var(--black);
    padding-left: var(--article-spacing);
    margin-top: calc(var(--navbar-height) + var(--article-top-padding));
    height: min-content;
    max-width: var(--author-max-width);
  }

  @media (max-width: 55em) {
    flex-direction: column;

    aside {
      height: auto;
      border: 1px solid var(--black);
      border-left: none;
      border-right: none;
      max-width: unset;

      margin: 0;
      margin-top: var(--spacing-large);
      padding: var(--spacing-large) 0;

      // Next.js image component doesn't have proper aspect ratios yet so
      // gotta hack around it
      div:first-child {
        padding: 0;
        height: var(--author-max-width);
        margin: auto;
      }
    }
  }
`;

const ContentsWrapper = styled.div``;

const Contents = styled.div`
  * + * {
    margin-top: var(--spacing-regular);
  }
  h2 {
    margin-top: var(--spacing-large);
  }
`;

const Ingress = styled.p`
  font-size: var(--text-ingress);
  line-height: 1.2;
  font-style: italic;
  margin-bottom: 1em;
`;

const Comments = styled(m.section)`
  max-width: var(--text-width);
  width: 100%;

  & > * + * {
    margin-top: var(--spacing-regular);
  }
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
