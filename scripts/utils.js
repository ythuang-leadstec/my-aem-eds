import { moveInstrumentation } from './scripts.js';

/**
 * Assign instrumentation to targets based on data-inst attributes in the container.
 * Automatically maps 'sources' keys to '[data-inst="key"]' elements.
 * @param {object} sources Source elements map { key: element }
 * @param {HTMLElement} container Container to search for data-inst targets
 */
export function assignInstrumentation(sources, container) {
  if (!sources || !container) return;
  console.log("sources:", sources);
  
  Object.entries(sources).forEach(([key, source]) => {
    if (!source) return;
    const target = container.querySelector(`[data-inst="${key}"]`);
    if (target) {
      let actualSource = source;
      
      // Common text elements or buttons wrapped in p
      if (source.children.length === 1 && 
         ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'LI'].includes(source.firstElementChild.tagName)) {
         actualSource = source.firstElementChild;
      }
      moveInstrumentation(actualSource, target);
    }
  });
}

