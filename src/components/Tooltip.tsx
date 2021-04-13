import TooltipLite, { TooltipProps } from 'react-tooltip-lite';
import styled from 'styled-components';

export const Tooltip: React.FC<TooltipProps> = (props) => (
  <StyledTooltip padding="0.25em 0.7em" distance={16} {...props} />
);

const StyledTooltip = styled(TooltipLite)`
  .react-tooltip-lite {
    background: var(--black);
    color: var(--white);
    border-radius: 0.25rem;
    width: auto !important;
  }

  .react-tooltip-lite-arrow {
    border-color: var(--black);
    border-radius: 0px;
  }

  display: flex;
  align-items: center;
  justify-content: center;
`;
