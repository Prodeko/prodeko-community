import { likeArticle, unlikeArticle } from 'api';
import { useAuth } from 'api/useAuth';
import { AnimateIcon, RainbowIcon } from 'components/RainbowIcon';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { mutate } from 'swr';
import { Article } from 'types';

type RainbowButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  article: Article;
};

export const RainbowButton: React.FC<RainbowButtonProps> = ({ article, children, ...props }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  if (user) {
    const userLike = article.liked_by.find((like) => like.directus_users_id === user.id);

    const isPressed = !!userLike;

    let onClick: () => Promise<void>;

    if (!userLike) {
      onClick = async () => {
        setLoading(true);
        const newLike = {
          articles_id: article.id,
          directus_users_id: user.id,
        };

        const updatedArticleData = { ...article, liked_by: [...article.liked_by, newLike] };

        // Update local data with the new comment first, then actually call the
        // API to create the new comment, and lastly revalidate the data by
        // fetching it from the API
        mutate(`articles/${article.id}`, updatedArticleData, false);
        await likeArticle(newLike);
        mutate(`articles/${article.id}`).then(() => setLoading(false));
      };
    } else {
      onClick = async () => {
        setLoading(true);

        const updatedArticleData = {
          ...article,
          liked_by: article.liked_by.filter((like) => like.id !== userLike.id),
        };

        mutate(`articles/${article.id}`, updatedArticleData, false);
        await unlikeArticle(userLike.id);
        mutate(`articles/${article.id}`).then(() => setLoading(false));
      };
    }

    return (
      <RainbowButtonWrapper
        {...props}
        aria-pressed={isPressed}
        disabled={loading}
        onClick={onClick}
      >
        <RainbowWrapper className={`${isPressed || loading ? 'active' : ''}`}>
          <AnimateIcon />
        </RainbowWrapper>
        {children}
      </RainbowButtonWrapper>
    );
  } else {
    return (
      <RainbowButtonWrapper {...props} disabled>
        <DisabledRainbowWrapper>
          <RainbowIcon />
        </DisabledRainbowWrapper>
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

  font-size: var(--text-filter);
  font-weight: 600;
  color: var(--gray-dark);
  background-color: unset;
  transition: color 0.5s ease;

  &[aria-pressed='true'] {
    color: var(--black);

    &:after {
      content: '!';
    }
  }

  &[disabled] {
    cursor: unset;
  }

  & > span {
    margin-right: 0.25em;
    font-size: 2em;
    transition: transform 0.3s ease;
  }

  &:hover span:not(.active) #rainbow {
    filter: grayscale(0.7);
  }

  &[disabled][aria-pressed='true'] .active #rainbow {
    filter: grayscale(1);
  }
`;

const DisabledRainbowWrapper = styled.span`
  padding: 0.25em;
  display: flex;
`;

/**
 * This styling is pretty convoluted and not the cleanest implementation, but
 * alas it works so no point in trying to unnecessarily optimize in.
 * Heavily based on Twitter's like-animation and a CodePen by Robeen
 * https://codepen.io/robeen/pen/PbvJjy
 */
const rainbowAnimation = css`
  svg {
    cursor: pointer;
    overflow: visible;
    #rainbow {
      transition: filter 0.5s ease;
      filter: grayscale(1);
      transform-origin: center;
    }
    #main-circ {
      transform-origin: 29.5px 29.5px;
    }
  }

  &.active svg {
    #rainbow {
      filter: unset;
      transform: scale(0);
      animation: animateRainbow 0.3s linear forwards 0.25s;
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

  @keyframes animateRainbow {
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
`;

const RainbowWrapper = styled.span`
  display: flex;
  ${rainbowAnimation}
`;
