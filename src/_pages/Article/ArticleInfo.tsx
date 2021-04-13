import { useGlobalContext } from 'api/globalContext';
import { ArticleStats } from 'components/ArticleStats';
import { SrOnly } from 'components/SrOnly';
import { Tooltip } from 'components/Tooltip';
import { FiGlobe as BilingualIcon } from 'react-icons/fi';
import styled from 'styled-components';
import { Article } from 'types';

export const ArticleInfo: React.FC<{ article: Article }> = ({ article }) => {
  const { language, commonData } = useGlobalContext();
  const { bilingual_icon_alternative_text } = commonData.translations[language];

  return (
    <ArticleInfoWrapper>
      <ArticleInfoContents>
        <time dateTime={article.publish_date}>
          {new Date(article.publish_date).toLocaleDateString('fi-FI')}
        </time>
        {article.author?.name}
      </ArticleInfoContents>

      <IconsWrapper>
        {article.bilingual && (
          <>
            <Tooltip content={bilingual_icon_alternative_text}>
              <BilingualIcon />
              <SrOnly>{bilingual_icon_alternative_text}</SrOnly>
            </Tooltip>
            <span>|</span>
          </>
        )}
        <ArticleStats article={article} />
      </IconsWrapper>
    </ArticleInfoWrapper>
  );
};

const ArticleInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--gray-light);
  & > * {
    margin-top: 0;
  }
`;

const ArticleInfoContents = styled.div`
  display: flex;
  flex-wrap: wrap;

  time {
    margin-right: 1em;
  }
`;

const IconsWrapper = styled.div`
  display: flex;
  & > * + * {
    margin-left: 1em;
  }
`;
