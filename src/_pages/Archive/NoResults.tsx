import styled from 'styled-components';

export const NoResults: React.FC = () => {
  return <Message>Ei tuloksia hakuehdoillasi.</Message>;
};

const Message = styled.p`
  color: var(--gray-dark);
  font-size: var(--text-filter);
`;
