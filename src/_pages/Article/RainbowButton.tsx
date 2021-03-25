import { likeArticle, unlikeArticle } from 'api';
import { useAuth } from 'api/useAuth';
import { RainbowIcon, RainbowIconGrayscale, AnimateIcon } from 'components/RainbowIcon';
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
        <RainbowWrapper className={isPressed || loading ? 'active' : ''}>
          <AnimateIcon />
        </RainbowWrapper>
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
  padding: 0;

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
    font-size: 2em;
    transition: transform 0.3s ease;
  }
`;

const rainbowAnimation = css`
  svg {
    cursor: pointer;
    overflow: visible;
    #rainbow {
      filter: grayscale(1);
      transform-origin: center;
      animation: animateHeartOut 0.2s linear forwards;
    }
    #main-circ {
      transform-origin: 29.5px 29.5px;
    }
  }

  &.active svg {
    #rainbow {
      filter: unset;
      transform: scale(0);
      animation: animateHeart 0.3s linear forwards 0.25s;
    }
    #main-circ {
      transition: all 2s;
      animation: animateCircle 0.3s linear forwards;
      opacity: 1;
    }
    #grp1 {
      opacity: 1;
      transition: 0.1s all 0.3s;
      #oval1 {
        transform: scale(0) translate(0, -30px);
        transform-origin: 0 0 0;
        transition: 0.5s transform 0.3s;
      }
      #oval2 {
        transform: scale(0) translate(10px, -50px);
        transform-origin: 0 0 0;
        transition: 1.5s transform 0.3s;
      }
    }
    #grp2 {
      opacity: 1;
      transition: 0.1s all 0.3s;
      #oval1 {
        transform: scale(0) translate(30px, -15px);
        transform-origin: 0 0 0;
        transition: 0.5s transform 0.3s;
      }
      #oval2 {
        transform: scale(0) translate(60px, -15px);
        transform-origin: 0 0 0;
        transition: 1.5s transform 0.3s;
      }
    }
    #grp3 {
      opacity: 1;
      transition: 0.1s all 0.3s;
      #oval1 {
        transform: scale(0) translate(30px, 0px);
        transform-origin: 0 0 0;
        transition: 0.5s transform 0.3s;
      }
      #oval2 {
        transform: scale(0) translate(60px, 10px);
        transform-origin: 0 0 0;
        transition: 1.5s transform 0.3s;
      }
    }
    #grp4 {
      opacity: 1;
      transition: 0.1s all 0.3s;
      #oval1 {
        transform: scale(0) translate(30px, 15px);
        transform-origin: 0 0 0;
        transition: 0.5s transform 0.3s;
      }
      #oval2 {
        transform: scale(0) translate(40px, 50px);
        transform-origin: 0 0 0;
        transition: 1.5s transform 0.3s;
      }
    }
    #grp5 {
      opacity: 1;
      transition: 0.1s all 0.3s;
      #oval1 {
        transform: scale(0) translate(-10px, 20px);
        transform-origin: 0 0 0;
        transition: 0.5s transform 0.3s;
      }
      #oval2 {
        transform: scale(0) translate(-60px, 30px);
        transform-origin: 0 0 0;
        transition: 1.5s transform 0.3s;
      }
    }
    #grp6 {
      opacity: 1;
      transition: 0.1s all 0.3s;
      #oval1 {
        transform: scale(0) translate(-30px, 0px);
        transform-origin: 0 0 0;
        transition: 0.5s transform 0.3s;
      }
      #oval2 {
        transform: scale(0) translate(-60px, -5px);
        transform-origin: 0 0 0;
        transition: 1.5s transform 0.3s;
      }
    }
    #grp7 {
      opacity: 1;
      transition: 0.1s all 0.3s;
      #oval1 {
        transform: scale(0) translate(-30px, -15px);
        transform-origin: 0 0 0;
        transition: 0.5s transform 0.3s;
      }
      #oval2 {
        transform: scale(0) translate(-55px, -30px);
        transform-origin: 0 0 0;
        transition: 1.5s transform 0.3s;
      }
    }
    #grp2 {
      opacity: 1;
      transition: 0.1s opacity 0.3s;
    }
    #grp3 {
      opacity: 1;
      transition: 0.1s opacity 0.3s;
    }
    #grp4 {
      opacity: 1;
      transition: 0.1s opacity 0.3s;
    }
    #grp5 {
      opacity: 1;
      transition: 0.1s opacity 0.3s;
    }
    #grp6 {
      opacity: 1;
      transition: 0.1s opacity 0.3s;
    }
    #grp7 {
      opacity: 1;
      transition: 0.1s opacity 0.3s;
    }
  }

  @keyframes animateCircle {
    40% {
      transform: scale(10);
      opacity: 1;
      fill: #dd4688;
    }
    55% {
      transform: scale(11);
      opacity: 1;
      fill: #d46abf;
    }
    65% {
      transform: scale(12);
      opacity: 1;
      fill: #cc8ef5;
    }
    75% {
      transform: scale(13);
      opacity: 1;
      fill: transparent;
      stroke: #cc8ef5;
      stroke-width: 0.5;
    }
    85% {
      transform: scale(17);
      opacity: 1;
      fill: transparent;
      stroke: #cc8ef5;
      stroke-width: 0.2;
    }
    95% {
      transform: scale(18);
      opacity: 1;
      fill: transparent;
      stroke: #cc8ef5;
      stroke-width: 0.1;
    }
    100% {
      transform: scale(19);
      opacity: 1;
      fill: transparent;
      stroke: #cc8ef5;
      stroke-width: 0;
    }
  }

  @keyframes animateHeart {
    0% {
      transform: scale(0.2);
    }
    40% {
      transform: scale(1.2);
      animation-timing-function: ease;
    }
    100% {
      animation-timing-function: ease;
      transform: scale(1);
    }
  }

  @keyframes animateHeartOut {
    0% {
      transform: scale(1);
    }
    20% {
      transform: scale(0.6);
      animation-timing-function: ease-out;
    }
    100% {
      animation-timing-function: ease-in;
      transform: scale(1);
    }
  }
`;

const RainbowWrapper = styled.span`
  display: flex;
  ${rainbowAnimation}
`;
