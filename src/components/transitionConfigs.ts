const baseEase = [0.48, 0.15, 0.25, 0.96];

const baseExit = {
  opacity: 0,
  transition: { duration: 0.2, ease: baseEase },
};

const baseEnter = {
  opacity: 1,
  y: 0,
  x: 0,
  transition: { duration: 1, ease: baseEase, staggerChildren: 0.2 },
};

/**
 * Framer Motion transition config defining how the Main element should animate
 */
export const mainTransitions = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: 0.5, ease: baseEase },
  },
  exit: baseExit,
};

/**
 * Transition for a generic container whose children should animate too
 */
export const containerTransitions = {
  initial: { opacity: 0 },
  enter: baseEnter,
  exit: baseExit,
};

/**
 * Transition for a generic item animating into view upwards
 */
export const itemTransitionUp = {
  initial: { y: 30, opacity: 0 },
  enter: baseEnter,
  exit: baseExit,
};

/**
 * Transition for a generic item animating into view downwards
 */
export const itemTransitionDown = {
  initial: { y: -15, opacity: 0 },
  enter: baseEnter,
  exit: baseExit,
};

/**
 * Transition for a generic item animating into view fron right
 */
export const itemTransitionLeft = {
  initial: { x: 20, opacity: 0 },
  enter: baseEnter,
  exit: baseExit,
};
