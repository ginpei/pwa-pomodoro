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

/**
 * @param {MouseEvent} event
 * @returns {Pos}
 */
export function eventToPosition (event) {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

/**
 * @param {Pos} pos
 */
export function posString (pos) {
  return `${pos.x}x${pos.y}`;
}

/**
 * @param {Pos} p1
 * @param {Pos} p2
 * @returns {Pos}
 */
export function getPosDiff (p1, p2) {
  /** @type {Pos} */
  const diff = {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
  };
  return diff;
}

/**
 * @param {Pos} p1
 * @param {Pos} p2
 */
export function measureDistance (p1, p2) {
  const d = getPosDiff(p1, p2);
  const distance = Math.sqrt(d.x ** 2 + d.y ** 2);
  return distance;
}

/**
 * @param {Pos} p
 */
export function measureDegree (p) {
  const a0 = Math.atan2(p.y, p.x) * 360 / (Math.PI * 2);
  return (a0 + 360 + 90) % 360;
}
