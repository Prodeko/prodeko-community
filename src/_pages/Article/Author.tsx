import { useGlobalContext } from 'api/globalContext';
import { AnimatedImage } from 'components/AnimatedImage';
import { containerTransitions, itemTransitionLeft } from 'components/transitionConfigs';
import { m } from 'framer-motion';
import styled from 'styled-components';
import { Author as AuthorType } from 'types';

type AuthorProps = {
  author: AuthorType;
};

export const Author: React.FC<AuthorProps> = ({ author }) => {
  const { language } = useGlobalContext();

  return (
    <AuthorWrapper initial="initial" animate="enter" exit="exit" variants={containerTransitions}>
      <AuthorPhotoWrapper>
        <AnimatedImage src={author.photo} alt="" layout="fill" objectFit="cover" />
      </AuthorPhotoWrapper>

      <AuthorName>{author.name}</AuthorName>
      <AuthorBio dangerouslySetInnerHTML={{ __html: author.translations[language].biography }} />
    </AuthorWrapper>
  );
};

const commonAttrs = {
  variants: itemTransitionLeft,
};

const AuthorWrapper = styled(m.aside)`
  * + * {
    margin-top: var(--spacing-regular);
  }
`;

const AuthorPhotoWrapper = styled(m.div).attrs(commonAttrs)`
  max-width: var(--author-max-width);
  position: relative;
  padding-top: 100%;
  border-radius: 999px;
  overflow: hidden;
`;

const AuthorName = styled(m.h2).attrs(commonAttrs)``;

const AuthorBio = styled(m.p).attrs(commonAttrs)`
  color: var(--gray-dark);
  line-height: 1.2;
  font-size: var(--text-author-bio);
`;
