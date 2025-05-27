export function polyfillViewTransitions() {
  // Return early if the browser supports View Transitions API
  if ('startViewTransition' in document) return;
  
  // Add a basic polyfill
  document.startViewTransition = (callback) => {
    const promise = Promise.resolve(callback());
    
    return {
      ready: Promise.resolve(),
      finished: promise,
      skipTransition: () => {},
      updateCallbackDone: promise,
    };
  };
}