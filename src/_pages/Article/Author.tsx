import styled from 'styled-components';
import Image from 'next/image';

import { Author as AuthorType } from 'types';
import { useGlobalContext } from 'api/globalContext';

type AuthorProps = {
  author: AuthorType;
};

export const Author: React.FC<AuthorProps> = ({ author }) => {
  const { language } = useGlobalContext();

  return (
    <AuthorWrapper>
      <AuthorPhotoWrapper>
        <Image src={author.photo} alt="" layout="fill" objectFit="cover" />
      </AuthorPhotoWrapper>

      <h2>{author.name}</h2>
      <AuthorBio dangerouslySetInnerHTML={{ __html: author.translations[language].biography }} />
    </AuthorWrapper>
  );
};

const AuthorWrapper = styled.aside`
  * + * {
    margin-top: var(--spacing-regular);
  }
`;

const AuthorPhotoWrapper = styled.div`
  max-width: var(--author-max-width);
  position: relative;
  padding-top: 100%;
  border-radius: 999px;
  overflow: hidden;
`;

const AuthorBio = styled.p`
  color: var(--gray-dark);
  line-height: 1.2;
  font-size: var(--text-author-bio);
`;
