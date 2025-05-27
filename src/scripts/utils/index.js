export function showFormattedDate(date, locale = "en-US", options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function supportsViewTransitions() {
  return Boolean(document.startViewTransition);
}

/**
 * Creates animations only if user hasn't requested reduced motion
 * @param {HTMLElement} element - Element to animate
 * @param {KeyframeEffect} keyframes - Animation keyframes
 * @param {Object} options - Animation options
 * @returns {Animation|null} - The animation object or null if reduced motion is preferred
 */
export function safeAnimate(element, keyframes, options) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Apply the final state without animation for users who prefer reduced motion
    const finalState = keyframes[keyframes.length - 1];
    Object.keys(finalState).forEach((prop) => {
      if (prop !== "offset" && prop !== "easing" && prop !== "composite") {
        element.style[prop] = finalState[prop];
      }
    });
    return null;
  }

  return element.animate(keyframes, options);
}
