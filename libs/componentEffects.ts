import { RefObject } from 'react';

/**
 * @param ref_obj: RefObject<HTMLDivElement>
 * make an flip and fade in effect
 */
function fadeInEffect(ref_obj: RefObject<HTMLDivElement>){
  const effect_func = (elapsed: number) => {
    if (! ref_obj.current){
      return;
    }
    ref_obj.current.style.opacity = `${elapsed}%`;
    ref_obj.current.style.transform = `rotateY(${elapsed * 3.6}deg)`;
  }
  makeAnimate(effect_func);
}
/**
 * @param ref_obj: RefObject<HTMLDivElement>
 */
function showContentEffect(ref_obj: RefObject<HTMLDivElement>){
  const effect_func = (elapsed: number) => {
    if (! ref_obj.current){
      return;
    }
    ref_obj.current.style.clipPath = GetClipPath(elapsed);
  }
  makeAnimate(effect_func);
}
/**
 * @param ref_obj: RefObject<HTMLDivElement>
 */
function hideContentEffect(ref_obj: RefObject<HTMLDivElement>){
  const effect_func = (elapsed: number) => {
    if (! ref_obj.current){
      return;
    }
    const delta = 100 - elapsed;
    ref_obj.current.style.clipPath = GetClipPath(delta);
  }
  makeAnimate(effect_func);
}

/**
 * use window.requestAnimationFrame to make effect
 * @param effect_func (t: number)=> void,
 * a function that accepts timestamp as args to make effect on react refobject.
 */
function makeAnimate(effect_func: (t: number)=> void){
  let elapsed: number = 0;
  function makeEffect(timestamp: number){
    effect_func(elapsed);
    if (elapsed < 95){
      elapsed += 5;
      window.requestAnimationFrame(makeEffect);
    }
    else {
      // end situation
      effect_func(100);
      elapsed = 0;
    }
  }
  window.requestAnimationFrame(makeEffect);
}

/**
 * @param d time delta
 * @return a string of css clip path
 */
 function GetClipPath(d: number){
  return d === 100 ? 'none': `ellipse(${d}% ${d}% at 50% 0%)`;
}

export {fadeInEffect, showContentEffect, hideContentEffect}