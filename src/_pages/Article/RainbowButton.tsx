import { likeArticle, unlikeArticle } from 'api';
import { useAuth } from 'api/useAuth';
import { RainbowIcon, RainbowIconGrayscale } from 'components/RainbowIcon';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Like } from 'types';

type RainbowButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  articleId: number;
  likedBy: Like[];
};

export const RainbowButton: React.FC<RainbowButtonProps> = ({
  likedBy,
  articleId,
  children,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Stop disabling the like button only after server has processed the change
  // and sent it to client
  useEffect(() => setLoading(false), [likedBy.length]);

  if (user) {
    const userLike = likedBy.find((like) => like.directus_users_id === user.id);

    const isPressed = !!userLike;

    let onClick: () => Promise<void>;

    if (!userLike) {
      onClick = async () => {
        setLoading(true);
        const { data } = await likeArticle({
          articles_id: articleId,
          directus_users_id: user!.id,
        });
        if (data) {
          // Refreshes static props of the page, thanks Josh!
          // https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
          router.replace(router.asPath, undefined, { scroll: false });
        }
      };
    } else {
      onClick = async () => {
        setLoading(true);
        await unlikeArticle(userLike.id);
        router.replace(router.asPath, undefined, { scroll: false });
      };
    }

    return (
      <RainbowButtonWrapper
        {...props}
        aria-pressed={isPressed}
        disabled={loading}
        onClick={onClick}
      >
        <IconWrapper>
          {isPressed || loading ? <RainbowIcon /> : <RainbowIconGrayscale />}
        </IconWrapper>
        {children}
      </RainbowButtonWrapper>
    );
  } else {
    return (
      <RainbowButtonWrapper {...props} disabled>
        <RainbowIcon />
        {children}
      </RainbowButtonWrapper>
    );
  }
};

const RainbowButtonWrapper = styled.button<{ loading?: boolean }>`
  border: none;
  display: flex;
  align-items: center;

  font-size: 1.25em;
  font-weight: 600;
  color: var(--gray-dark);
  background-color: unset;
  outline: none;

  &[aria-pressed='true'] {
    color: var(--black);
  }

  &[disabled] {
    cursor: unset;
  }

  & > span {
    margin-right: 0.5em;
    font-size: 1.5em;
    transition: transform 0.3s ease;
  }

  /* Fancy animation stuff */
  &[aria-pressed='true'] > span {
    transition-delay: 2s;
  }
  &[aria-pressed='true']:not(:hover) > span {
    transition-delay: 0s;
  }

  &:hover > span {
    transform: rotate(-5deg) scale(1.1);
  }

  &:active > span {
    transition: transform 0.15s ease;
    transform: rotate(5deg) scale(0.95);
  }

  &[aria-pressed='true']:hover > span {
    transform: rotate(5deg) scale(1.05);
  }

  &[aria-pressed='true']:active > span {
    transition: transform 0.15s ease;
    transform: rotate(-5deg) scale(0.9);
  }

  &&[disabled] > span {
    transform: unset;
    transition-delay: 0s;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  will-change: transform;
`;
