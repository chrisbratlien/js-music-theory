
export function clamp01(t) {
  t = Math.max(0, t);
  t = Math.min(t, 1);
  return t;
}

export function lerp ( a, b, t, clamp) {
  if (clamp) {
    t = clamp01(t);
  }
  let result = (1-t) * a + t * b;
  return result;
}

export function invlerp ( a, b, v, clamp) {
  let t = (v - a) / (b - a);
  if (!clamp) { return t; }
  t = clamp01(t);
  return t;
}

export function remap (iMin, iMax, oMin, oMax, v, clamp) {
  let t = invlerp(iMin, iMax, v, clamp);
  let result = lerp(oMin, oMax, t);//don't reclamp here.
  return result;
}

export default {
  clamp01,
  lerp,
  invlerp,
  remap
}