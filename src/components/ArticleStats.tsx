import styled from 'styled-components';
import { FiMessageCircle as CommentIcon } from 'react-icons/fi';

import { useGlobalContext } from 'api/globalContext';
import { SrOnly } from 'components/SrOnly';
import { RainbowIconGrayscale } from 'components/RainbowIcon';
import { Article } from 'types';

type ArticleStatsProps = {
  article: Article;
};

export const ArticleStats: React.FC<ArticleStatsProps> = ({ article, ...rest }) => {
  const { language, commonData } = useGlobalContext();

  const { comment_icon_alternative_text, rainbow_icon_alternative_text } = commonData.translations[
    language
  ];

  return (
    <IconGroup {...rest}>
      <IconWrapper>
        <CommentIcon />
        <SrOnly>{comment_icon_alternative_text}</SrOnly>
        {article.comments.length}
      </IconWrapper>
      <IconWrapper>
        <RainbowIconGrayscale />
        <SrOnly>{rainbow_icon_alternative_text}</SrOnly>
        {article.liked_by.length}
      </IconWrapper>
    </IconGroup>
  );
};

const IconGroup = styled.div`
  display: flex;
  align-items: center;

  & > * + * {
    margin-left: 1em;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  line-height: 1;

  & > *:first-child {
    margin-right: 0.25em;
  }
`;
