import React, { useState } from 'react';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

import { PillButton } from '_pages/Article/PillButton';
import { FiEdit, FiSend, FiX } from 'react-icons/fi';
import { createComment } from 'api';
import { useAuth } from 'api/useAuth';

type CommentFormProps = {
  articleId: number;
  parentComment?: number;
};

export const CommentForm: React.FC<CommentFormProps> = ({ articleId, parentComment }) => {
  const [formOpen, setFormOpen] = useState(false);
  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);
  const [value, setValue] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data } = await createComment({
      article: articleId,
      parent_comment: parentComment,
      body: value,
    });
    if (data) {
      console.log(data);
      closeForm();
    }
  };

  if (user) {
    if (formOpen) {
      return (
        <CommentFormWrapper onSubmit={handleSubmit}>
          <NewCommentTitle id="formTitle">Uusi kommentti</NewCommentTitle>

          <Quill theme="bubble" value={value} onChange={setValue} />

          <FormActions>
            <PillButton variant="confirm">
              <FiSend />
              Lähetä
            </PillButton>
            <PillButton variant="cancel" onClick={closeForm}>
              <FiX />
              Peruuta
            </PillButton>
          </FormActions>
        </CommentFormWrapper>
      );
    } else {
      return (
        <PillButton variant="neutral" outlined={!!parentComment} onClick={openForm}>
          <FiEdit />
          {!!parentComment ? 'Vastaa' : 'Uusi kommentti'}
        </PillButton>
      );
    }
  } else {
    return null;
  }
};

const CommentFormWrapper = styled.form`
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
