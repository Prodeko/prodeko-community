import 'react-quill/dist/quill.bubble.css';

import { PillButton } from '_pages/Article/PillButton';
import { createComment } from 'api';
import { useGlobalContext } from 'api/globalContext';
import { useAuth } from 'api/useAuth';
import { itemTransitionDown } from 'components/transitionConfigs';
import { AnimatePresence, m } from 'framer-motion';
import React, { useState } from 'react';
import { FiEdit, FiSend, FiX } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { mutate } from 'swr';
import { Article } from 'types';

type CommentFormProps = {
  article: Article;
  parentComment?: number;
};

// We need to define these statically to prevent unnecessary errors
// https://github.com/quilljs/quill/issues/1940#issuecomment-379536850
const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
};

export const CommentForm: React.FC<CommentFormProps> = ({ article, parentComment }) => {
  const { language, commonData } = useGlobalContext();
  const [formOpen, setFormOpen] = useState(false);
  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);
  const [value, setValue] = useState('');
  const { user } = useAuth();

  const {
    send_button_text,
    cancel_button_text,
    new_comment_title,
    reply_button_text,
    new_comment_button_text,
  } = commonData.translations[language];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newComment = {
      article: article.id,
      parent_comment: parentComment,
      body: value,
    };

    let updatedArticleData;
    if (parentComment) {
      // Append comment as a subcomment and display data to user immediately
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const parent = article.comments.find((comment) => comment.id === parentComment)!;
      const rest = article.comments.filter((comment) => comment.id !== parentComment);
      updatedArticleData = {
        ...article,
        comments: [...rest, { ...parent, subcomments: [...parent.subcomments] }].sort(
          (a, b) => new Date(a.date_created).getTime() - new Date(b.date_created).getTime()
        ),
      };
    } else {
      updatedArticleData = {
        ...article,
        comments: [
          ...article.comments,
          { ...newComment, user_created: user, date_created: new Date().toUTCString() },
        ],
      };
    }

    // Update local data with the new comment first, then actually call the API
    // to create the new comment, and lastly revalidate the data by fetching it
    // from the API
    mutate(`articles/${article.id}`, updatedArticleData, false);
    await createComment(newComment);
    mutate(`articles/${article.id}`);

    onClose();
  };

  const onClose = () => {
    setValue('');
    closeForm();
  };

  let component = null;

  if (user) {
    if (formOpen) {
      component = (
        <CommentFormWrapper onSubmit={handleSubmit} variants={itemTransitionDown} layout>
          <NewCommentTitle id="formTitle">{new_comment_title}</NewCommentTitle>

          <Quill theme="bubble" value={value} modules={quillModules} onChange={setValue} />

          <FormActions>
            <PillButton variant="confirm">
              <FiSend />
              {send_button_text}
            </PillButton>
            <PillButton variant="cancel" onClick={onClose}>
              <FiX />
              {cancel_button_text}
            </PillButton>
          </FormActions>
        </CommentFormWrapper>
      );
    } else {
      component = (
        <m.div layout>
          <PillButton variant="neutral" outlined={!!parentComment} onClick={openForm}>
            <FiEdit />
            {parentComment ? reply_button_text : new_comment_button_text}
          </PillButton>
        </m.div>
      );
    }
  }

  return <AnimatePresence>{component}</AnimatePresence>;
};

const CommentFormWrapper = styled(m.form)`
  & > * + * {
    margin-top: var(--spacing-regular);
  }
`;

const NewCommentTitle = styled.h3``;

const FormActions = styled.div`
  display: flex;
  & > * + * {
    margin-left: var(--spacing-regular);
  }
`;

const Quill = styled(ReactQuill)`
  border-radius: var(--border-radius-small);
  border: 2px solid var(--gray-light);

  .ql-container {
    font-family: unset;
    font-size: unset;
  }

  .ql-editor {
    padding: var(--spacing-small);
    min-height: 10rem;
  }
`;
