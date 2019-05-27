/**
 * @param {Element} container
 * @param {string} name
 * @return {any}
 */
export function findElement (container, name) {
  const el = container.querySelector(`[data-js="${name}"]`);
  if (!el) {
    throw new Error(`Element named ${name} is not found`);
  }
  return el;
}

/**
 * @param {HTMLElement} el
 * @param {string} type
 * @param {(event: Event) => void} listener
 * @returns {() => void} Unsubscriber.
 */
export function addListener(el, type, listener) {
  el.addEventListener(type, listener);
  const off = () => el.removeEventListener(type, listener);
  return off;
}

/**
 * @param {number} deg
 */
export function degToRad (deg) {
  return deg / 360 * Math.PI * 2 - Math.PI / 2;
}

/**
 * @param {number} n
 */
export function deg2 (n) {
  return `0${n}`.slice(-2);
}

/**
 * @param {number} remaining
 */
export function remainTimeToString (remaining) {
  const allSec = Math.ceil(remaining / 1000);
  const min = Math.floor(allSec / 60);
  const sec = allSec % 60;
  const str = `${deg2(min)}:${deg2(sec)}`;
  return str;
}
