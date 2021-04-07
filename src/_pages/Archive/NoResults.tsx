import { useArchiveContext } from '_pages/Archive/useArchiveContext';
import { PillButton } from 'components/PillButton';
import { useRouter } from 'next/router';
import styled from 'styled-components';

export const NoResults: React.FC = () => {
  const { translations } = useArchiveContext();
  const router = useRouter();

  const onClear = () => {
    router.replace({ query: { slug: router.query.slug } }, undefined);
  };

  return (
    <>
      <Message>{translations.no_results_prompt}</Message>
      <ButtonWrapper>
        <PillButton variant="neutral" onClick={onClear}>
          {translations.reset_filters_button}
        </PillButton>
      </ButtonWrapper>
    </>
  );
};

const Message = styled.p`
  color: var(--gray-dark);
  font-size: var(--text-filter);
`;

// CSS grid would stretch the button to ugly widths without this
const ButtonWrapper = styled.div``;
