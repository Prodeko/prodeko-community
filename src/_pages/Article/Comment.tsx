import { CommentForm } from '_pages/Article/CommentForm';
import { useGlobalContext } from 'api/globalContext';
import { useAuth } from 'api/useAuth';
import { ProfilePicture } from 'components/ProfilePicture';
import { itemTransitionDown } from 'components/transitionConfigs';
import { AnimatePresence, m } from 'framer-motion';
import styled from 'styled-components';
import { Article, Comment as CommentType, User } from 'types';

type CommentProps = {
  article: Article;
  comment: CommentType;
};

export const Comment: React.FC<CommentProps> = ({ comment, article }) => {
  const { user } = useAuth();
  const { commonData, language } = useGlobalContext();
  const { user_not_found } = commonData.translations[language];

  let commenter: User | undefined = undefined;
  if (comment.user_created) {
    if (user && comment.user_created.id === user.id) {
      commenter = user;
    } else {
      commenter = comment.user_created;
    }
  }

  return (
    <Wrapper>
      <Profile>
        <Photo>
          <ProfilePicture user={commenter} defaultPicture={commonData.user_default_picture} />
        </Photo>
        <Info>
          <Name>
            {commenter ? `${commenter.first_name} ${commenter.last_name}` : <i>{user_not_found}</i>}
          </Name>
          <Datetime dateTime={comment.date_created}>
            {new Date(comment.date_created).toLocaleString('fi-FI', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </Datetime>
        </Info>
      </Profile>

      <Contents>
        <div dangerouslySetInnerHTML={{ __html: comment.body }} />
        {comment.subcomments && !comment.parent_comment && (
          <Subcomments>
            <AnimatePresence>
              {comment.subcomments.map((comment) => (
                <m.li key={comment.id} variants={itemTransitionDown} layout="position">
                  <Comment comment={comment} article={article} key={comment.id} />
                </m.li>
              ))}
            </AnimatePresence>
          </Subcomments>
        )}
        {!comment.parent_comment && <CommentForm article={article} parentComment={comment.id} />}
      </Contents>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  --image-size: 3rem;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
`;

const Photo = styled.div`
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  width: var(--image-size);
  height: var(--image-size);

  border-radius: 999px;
`;

const Info = styled.div`
  margin-left: var(--spacing-regular);
  display: flex;
  flex-direction: column;
  line-height: 1.1;
`;

const Name = styled.span`
  font-weight: 700;
  font-size: 1.25em;
`;

const Datetime = styled.time`
  color: var(--gray-light);
`;

const Contents = styled.div`
  margin-left: calc(var(--image-size) / 2);
  border-left: 1px solid currentColor;
  padding-left: calc(var(--image-size) / 2 + var(--spacing-regular) - 1px);

  & > * + * {
    margin-top: var(--spacing-medium);
  }

  color: var(--gray-dark);
`;

const Subcomments = styled.ol`
  & > * + * {
    margin-top: var(--spacing-medium);
  }
`;
