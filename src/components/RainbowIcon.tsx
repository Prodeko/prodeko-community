export const RainbowIconGrayscale = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
    <path d="M12 21.5C12 14 14 12 21.5 12" stroke="#474747" strokeWidth="2.5" />
    <path d="M10 21.5C10 12 13 10 21.5 10" stroke="#5C5C5C" strokeWidth="2.5" />
    <path d="M8 21.5C8 11.5 11.5 8 21.5 8" stroke="#A5A5A5" strokeWidth="2.5" />
    <path d="M6 21.5C6 9.5 9.5 6 21.5 6" stroke="#838383" strokeWidth="2.5" />
    <path d="M4 21.5C3.5 8 8 3.5 21.5 4" stroke="#595959" strokeWidth="2.5" />
    <path
      d="M13 22C13.55 22 14 21.55 14 21C14 18 14.5 16.4 15.46 15.46C16.41 14.5 18 14 21 14C21.27 14 21.5 13.9 21.7 13.7C21.9 13.5 22 13.26 22 13L22 3C22 2.5 21.6 2 21 2C14.2 1.75 9.22 2.86 6 6C2.86 9.22 1.75 14.2 2 21C2 21.57 2.46 22 3 22H13Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const RainbowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
    <path d="M12 21.5C12 14 14 12 21.5 12" stroke="#002E7D" strokeWidth="2.5" />
    <path d="M10 21.5C10 12 13 10 21.5 10" stroke="#007336" strokeWidth="2.5" />
    <path d="M8 21.5C8 11.5 11.5 8 21.5 8" stroke="#FFD500" strokeWidth="2.5" />
    <path d="M6 21.5C6 9.5 9.5 6 21.5 6" stroke="#FF5800" strokeWidth="2.5" />
    <path d="M4 21.5C3.5 8 8 3.5 21.5 4" stroke="#D42E12" strokeWidth="2.5" />
    <path
      d="M13 22C13.55 22 14 21.55 14 21C14 18 14.5 16.4 15.46 15.46C16.41 14.5 18 14 21 14C21.27 14 21.5 13.9 21.7 13.7C21.9 13.5 22 13.26 22 13L22 3C22 2.5 21.6 2 21 2C14.2 1.75 9.22 2.86 6 6C2.86 9.22 1.75 14.2 2 21C2 21.57 2.46 22 3 22H13Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * SVG for a coloured rainbow with extra shapes for animating it in with an
 * extremely satisfying "pop"
 */
export const AnimateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 58 57">
    <g id="Group" fill="none" fill-rule="evenodd">
      <g id="rainbow">
        <g transform="scale(1.5) translate(7 7)">
          <path d="M12 21.5C12 14 14 12 21.5 12" stroke="#002E7D" strokeWidth="2.5" />
          <path d="M10 21.5C10 12 13 10 21.5 10" stroke="#007336" strokeWidth="2.5" />
          <path d="M8 21.5C8 11.5 11.5 8 21.5 8" stroke="#FFD500" strokeWidth="2.5" />
          <path d="M6 21.5C6 9.5 9.5 6 21.5 6" stroke="#FF5800" strokeWidth="2.5" />
          <path d="M4 21.5C3.5 8 8 3.5 21.5 4" stroke="#D42E12" strokeWidth="2.5" />
          <path
            d="M13 22C13.55 22 14 21.55 14 21C14 18 14.5 16.4 15.46 15.46C16.41 14.5 18 14 21 14C21.27 14 21.5 13.9 21.7 13.7C21.9 13.5 22 13.26 22 13L22 3C22 2.5 21.6 2 21 2C14.2 1.75 9.22 2.86 6 6C2.86 9.22 1.75 14.2 2 21C2 21.57 2.46 22 3 22H13Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
      </g>

      <circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5" />

      <g id="grp7" opacity="0" transform="translate(7 6)">
        <circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2" />
        <circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2" />
      </g>

      <g id="grp6" opacity="0" transform="translate(0 28)">
        <circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2" />
        <circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2" />
      </g>

      <g id="grp3" opacity="0" transform="translate(52 28)">
        <circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2" />
        <circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2" />
      </g>

      <g id="grp2" opacity="0" transform="translate(44 6)">
        <circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2" />
        <circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2" />
      </g>

      <g id="grp5" opacity="0" transform="translate(14 50)">
        <circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2" />
        <circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2" />
      </g>

      <g id="grp4" opacity="0" transform="translate(35 50)">
        <circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2" />
        <circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2" />
      </g>

      <g id="grp1" opacity="0" transform="translate(24)">
        <circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2" />
        <circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2" />
      </g>
    </g>
  </svg>
);
