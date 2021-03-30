import Image, { ImageProps } from 'next/image';
import { SyntheticEvent, useState } from 'react';
import styled from 'styled-components';

type AnimatedImageProps = ImageProps & {
  transitionUpwards?: boolean;
};

/**
 * Next.js doesn't have placeholders for image loading, so instead we wait for
 * them to load lazily and afterwards fade in opacity
 */
export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  transitionUpwards = false,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  // Hack for next/image onload issue
  // https://github.com/vercel/next.js/issues/20368#issuecomment-757446007
  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src.indexOf('data:image/gif;base64') < 0 && setVisible(true);
  };

  return (
    <TransitionWrapper visible={visible} transitionUpwards={transitionUpwards}>
      <Image {...props} onLoad={onImageLoad} />
    </TransitionWrapper>
  );
};

const TransitionWrapper = styled.div<{
  visible: boolean;
  transitionUpwards?: boolean;
}>`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition-property: transform, opacity;
  transition-duration: 1s, 0.7s;
  transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1), ease-in-out;

  --shift-amount: 0;
  ${(p) => (p.transitionUpwards ? '--shift-amount: 2rem;' : '')}
  --opacity: 0;

  transform: translateY(var(--shift-amount));
  opacity: var(--opacity);

  ${(p) =>
    p.visible
      ? `
  --shift-amount: 0;
  --opacity: 1;
  `
      : ''}
`;
