import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* Box sizing rules */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  
  /* Remove default padding */
  ul,
  ol {
    padding: 0;
  }
  
  /* Remove default margin */
  body,
  h1,
  h2,
  h3,
  h4,
  p,
  ul,
  ol,
  li,
  figure,
  figcaption,
  blockquote,
  dl,
  dd {
    margin: 0;
  }
  
  /* Set core body defaults */
  body {
    min-height: 100vh;
    height: 100%;
    scroll-behavior: smooth;
    text-rendering: optimizeSpeed;
    font-smooth: always;

    line-height: 1.5;
    font-size: 100%;
  }
  html {
    height: 100%;
  }
  
  /* Remove list styles on ul, ol elements with a class attribute */
  ul,
  ol {
    list-style: none;
  }
  
  /* A elements that don't have a class get default styles */
  a:not([class]) {
    text-decoration-skip-ink: auto;
  }
  
  /* Make images easier to work with */
  img {
    max-width: 100%;
    display: block;
  }
  
  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  a {
    cursor: pointer;
  }
  
  /* Remove all animations and transitions for people that prefer not to see them */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Fullscreen defaults for Next.js */
  div#__next {
    height: 100%;
  }

  :root {
    /* Colors */
    --white: #FFFFFF;
    --black: #000000;
    --background: #001302;
    --gray-dark: #333333;
    --gray-light: #666666;
    --highlight: #41DFAB;
    --danger: #C45046;
    --confirm: #005338;

    --prodeko-blue: #002E7D;
    --prodeko-red: #D42E12;
    --prodeko-orange: #FF5800;
    --prodeko-green: #007336;
    --prodeko-yellow: #FFD500;

    --photo-overlay: linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(0, 0, 0, 0.7) 80%);
    --card-shadow: 0 0.5rem 1.25rem #64646F40;


    /* Text sizes */
    --text-body: 1.125rem;
    --text-ingress: 2rem;
    --text-title: 4rem;
    --text-subtitle: 3rem;
    --text-navigation: 1.5rem;


    /* Dimensions */
    --border-radius-small: 0.5rem;
    --border-radius-large: 1rem;

    --text-width: 65ch;
    --content-width: 50rem;
    --min-content-width: calc(100% - 2 * var(--spacing-regular));

    --spacing-small: 0.5rem;
    --spacing-regular: 1rem;
    --spacing-medium: 1.5rem;
    --spacing-large: 2rem;
    --spacing-xlarge: 3rem;

    --card-height: 18rem;


    /* General */
    font-family: 'Raleway';
    font-weight: 500;
    color: var(--black);
  }
`;
