import { PillButton } from 'components/PillButton';
import { useRouter } from 'next/router';
import styled from 'styled-components';

export const NoResults: React.FC = () => {
  const router = useRouter();

  const onClear = () => {
    router.replace({ query: { slug: router.query.slug } }, undefined);
  };

  return (
    <>
      <Message>Ei tuloksia hakuehdoillasi. Aloitetaanko alusta?</Message>
      <ButtonWrapper>
        <PillButton variant="neutral" onClick={onClear}>
          Nollaa hakuehdot
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
