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
    overflow-y: scroll;
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

  a,
  button {
    cursor: pointer;
  }

  button:focus:not(:focus-visible) {
    outline: none;
  }

  fieldset {
    border: none;
    padding: 0;
    margin: 0;
  }


  /* General default styles */
  h1, h2, h3 {
    font-weight: 700;
    line-height: 0.9;
    overflow-wrap: break-word;
  }

  h1 {
    font-size: var(--text-title);
  }

  h2 {
    font-size: var(--text-subtitle);
  }

  h3 {
    font-size: var(--text-ingress);
  }

  p {
    font-size: var(--text-body);
    overflow-wrap: break-word;
  }

  blockquote {
    position: relative;
    background-color: var(--gray-lighter);
    border-left: 0.2em solid var(--gray-light);
    padding: 0.25em 0.5em;
    font-style: italic;
  }

  mark {
    background-color: var(--highlight);
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
    display: flex;
    flex-direction: column;
  }

  :root {
    /* Colors */
    --white: #FFFFFF;
    --black: #000000;
    --gray-dark: #333333;
    --gray-light: #666666;
    --gray-lighter: #F0F0F0;
    --highlight: #00D3FF;
    --danger: #C45046;
    --confirm: #005338;
    --confirm-background: #41DFAB;
    --neutral: #2F80ED;
    --neutral-dark: #285FA9;

    --prodeko-blue: #002E7D;
    --prodeko-red: #D42E12;
    --prodeko-orange: #FF5800;
    --prodeko-green: #007336;
    --prodeko-yellow: #FFD500;

    --photo-overlay: linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(0, 0, 0, 0.7) 80%);
    --photo-overlay-short: linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(0, 0, 0, 0.7) 100%);
    --card-shadow: 0 0.5rem 1.25rem #64646F40;
    --dark-shadow: 0 0.25rem 1.5rem #00000040;


    /* Text sizes */
    --text-title: 3rem;
    --text-subtitle: 2.5rem;
    --text-ingress: 1.6rem;
    --text-card-title: 1.75rem;
    --text-navigation: 1.5rem;
    --text-filter: 1.25rem;
    --text-author-bio: 1.125rem;
    --text-body: 1.125rem;


    /* Dimensions */
    --border-radius-small: 0.5rem;
    --border-radius-large: 1rem;

    --navbar-height: 4rem;
    --navbar-logo-width: 12rem;

    --banner-height: min(80vh, 50rem);
    --banner-logo-offset: -5rem;
    --below-banner-offset: calc(var(--banner-height) / -4.5);
    --scroll-top-position: 2rem;
    --scroll-top-size: 3rem;

    --text-width: 75ch;
    --content-width: 65rem;
    --main-padding: var(--spacing-large);
    --min-content-width: calc(100% - 2 * var(--main-padding));

    --article-padding: var(--spacing-medium) var(--spacing-large);
    --article-spacing: var(--spacing-large);
    --article-banner-height: 60%;
    --article-top-padding: var(--spacing-xlarge);

    --spacing-small: 0.5rem;
    --spacing-regular: 1rem;
    --spacing-medium: 1.5rem;
    --spacing-large: 2rem;
    --spacing-xlarge: 3rem;

    --card-height: 24rem;
    --card-min-width: 16rem;
    --author-max-width: 18rem;

    /* General */
    font-family: 'Raleway';
    font-weight: 500;
    color: var(--black);



    /* Media queries */

    // x-large; 1200px
    @media (max-width: 75em) {
      --text-card-title: 1.5rem;
      --text-navigation: 1.25rem;
      --text-author-bio: 1rem;

    }

    // large; 880px
    @media (max-width: 55em) {
      --text-ingress: 1.5rem;
      --text-filter: 1.125rem;
    }

    // medium; 640px 
    @media (max-width: 40em) {
      --card-height: 20rem;
      --card-min-width: 14rem;
      --main-padding: var(--spacing-regular);
      --article-padding: var(--spacing-medium) var(--spacing-regular);
      --text-filter: 1rem;
      --scroll-top-position: 1.5rem;

      --author-max-width: 12rem;
      --article-banner-height: 80%;
      --article-top-padding: 0px;
    }

    // small; 480px
    @media (max-width: 30em) {
      --main-padding: var(--spacing-small);

      --navbar-logo-width: 10rem;
      --scroll-top-position: 1rem;
      --scroll-top-size: 2.5rem;

      --article-padding: var(--spacing-regular) var(--spacing-small);
      --article-banner-height: 100%;

      --text-title: 2.5rem;
      --text-subtitle: 2rem;
      --text-body: 1rem;
    }
  }

`;
