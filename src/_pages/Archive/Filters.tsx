import { useArticlesContext } from '_pages/Archive/useArticlesContext';
import { useBasicFiltering } from '_pages/Archive/useBasicFiltering';
import { useGlobalContext } from 'api/globalContext';
import { FiChevronDown as DownIcon, FiChevronUp as UpIcon } from 'react-icons/fi';
import styled from 'styled-components';
import { ArchivePageData, ARTICLE_TYPES } from 'types';

type FiltersProps = {
  translations: ArchivePageData['translations'];
};

export const Filters: React.FC<FiltersProps> = ({ translations }) => {
  const { articles } = useArticlesContext();
  const { language, commonData } = useGlobalContext();
  const { filter_label, sort_order_label, newest_first, oldest_first } = translations[language];
  const { order, sortOnClick, getPillOnClick, filteredTypes } = useBasicFiltering(articles);

  return (
    <FilterWrapper>
      <SortWrapper>
        <SortLabel>{sort_order_label}</SortLabel>
        <SortButton onClick={sortOnClick} aria-pressed={order !== 'newest'}>
          <ButtonContents>
            {newest_first} <DownIcon />
          </ButtonContents>
          <ButtonContents>
            {oldest_first} <UpIcon />
          </ButtonContents>
        </SortButton>
      </SortWrapper>

      <PillGroup>
        <PillGroupLabel>{filter_label}</PillGroupLabel>
        <PillWrapper>
          {ARTICLE_TYPES.map((type) => (
            <Pill
              onClick={getPillOnClick(type)}
              aria-pressed={!filteredTypes.includes(type)}
              key={type}
            >
              {commonData.translations[language][`${type}_icon_alternative_text` as const]}
            </Pill>
          ))}
        </PillWrapper>
      </PillGroup>
    </FilterWrapper>
  );
};

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  font-size: var(--text-filter);

  // We can't use flexbox gap yet (thanks safari), but this works similarly
  --gap: var(--spacing-regular);
  margin: calc(var(--gap) / -2);
  & > * {
    padding: calc(var(--gap) / 2);
  }
`;

const SortWrapper = styled.div``;

const SortLabel = styled.label`
  margin-right: 1em;
  font-weight: 700;
  &:after {
    content: ':';
  }
`;

const SortButton = styled.button`
  border: none;
  background-color: unset;

  font-weight: 300;

  &[aria-pressed='false'] {
    span:last-child {
      display: none;
    }
  }
  &[aria-pressed='true'] {
    span:first-child {
      display: none;
    }
  }
`;

const ButtonContents = styled.span`
  display: flex;
  align-items: center;
  & > svg {
    margin-left: 0.25em;
    font-size: 1.25em;
    stroke-width: 1;
  }
`;

const Pill = styled.button`
  border: none;
  border-radius: 999px;
  padding: 0.2em 0.8em;

  transition: color 150ms ease, background-color 150ms ease, transform 150ms ease;

  background-color: var(--gray-lighter);
  color: var(--gray-light);

  font-weight: 300;

  &:active {
    transform: scale(0.95);
  }

  &[aria-pressed='true'] {
    background-color: var(--highlight);
    color: var(--confirm);
  }
`;

const PillGroup = styled.fieldset`
  display: flex;
  align-items: center;
`;

const PillGroupLabel = styled.legend`
  padding: 0;
  // There isn't a proper way to align legends inside fieldset so this will
  // have to do
  float: left;
  height: min-content;
  margin-right: 1em;
  font-weight: 700;
  &:after {
    content: ':';
  }
`;

const PillWrapper = styled.div`
  // We can't use flexbox gap yet (thanks safari), but this works similarly
  --gap: var(--spacing-small);
  margin: calc(var(--gap) / -2);
  & > * {
    margin: calc(var(--gap) / 2);
  }
`;
