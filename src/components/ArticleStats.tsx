import { useGlobalContext } from 'api/globalContext';
import { RainbowIconGrayscale } from 'components/RainbowIcon';
import { SrOnly } from 'components/SrOnly';
import { Tooltip } from 'components/Tooltip';
import { FiMessageCircle as CommentIcon } from 'react-icons/fi';
import styled from 'styled-components';
import { Article } from 'types';

type ArticleStatsProps = {
  article: Article;
};

/**
 * The amount of likes and comments for an article
 */
export const ArticleStats: React.FC<ArticleStatsProps> = ({ article, ...rest }) => {
  const { language, commonData } = useGlobalContext();

  const { comment_icon_alternative_text, rainbow_icon_alternative_text } = commonData.translations[
    language
  ];

  return (
    <IconGroup {...rest}>
      <IconWrapper>
        <Tooltip content={comment_icon_alternative_text}>
          <CommentIcon />
        </Tooltip>
        <SrOnly>{comment_icon_alternative_text}</SrOnly>
        {article.comments.length}
      </IconWrapper>
      <IconWrapper>
        <Tooltip content={rainbow_icon_alternative_text}>
          <RainbowIconGrayscale />
        </Tooltip>
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
