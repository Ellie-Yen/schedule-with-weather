function FadeInEffect(ref_obj){
  // ref: react useref object
  const effect_func = (elapsed) => {
    ref_obj.current.style.opacity = `${Math.floor(elapsed / 5)}%`;
  }
  makeAnimate(effect_func);
}

function FadeOutEffect(ref_obj){
  // ref: react useref object
  const effect_func = (elapsed) => {
    ref_obj.current.style.opacity = `${Math.floor(100 - elapsed / 5)}%`;
  }
  makeAnimate(effect_func);
  flipEffect(ref_obj);
}
function flipEffect(ref_obj){
  const effect_func = (elapsed) => {
    ref_obj.current.style.transform = `rotateY(${Math.floor((elapsed / 5) * 3.6)}deg)`;
  }
  makeAnimate(effect_func);
}
function showContentEffect(ref_obj){
  const effect_func = (elapsed) => {
    const delta = Math.floor(elapsed / 5);
    ref_obj.current.style.clipPath = delta === 100 ? "none" : GetClipPath(delta);
  }
  makeAnimate(effect_func);
}
function hideContentEffect(ref_obj){
  const effect_func = (elapsed) => {
    const delta = Math.floor(100 - elapsed / 5);
    ref_obj.current.style.clipPath = delta === 100 ? "none" : GetClipPath(delta);
  }
  makeAnimate(effect_func);
}
function GetClipPath(d){
  return `ellipse(${d}% ${d}% at 0% 0%)`;
}

function makeAnimate(effect_func){
  // effect_func: function that present effect

  let start;
  function makeEffect(timestamp){
    if (start === undefined){
      start = timestamp;
    }
    // avoid overflow
    const elapsed = Math.max(Math.min(timestamp - start, 500), 0);
    try{
      effect_func(elapsed);
    }
    catch(error){
      // the object is not rendered yet
      start = undefined;
      return;
    }
    if (elapsed < 500){
      window.requestAnimationFrame(makeEffect);
    }
    else {
      // end situation
      effect_func(500);
      start = undefined;
    }
  }
  window.requestAnimationFrame(makeEffect);
}

export {FadeInEffect, FadeOutEffect, showContentEffect, hideContentEffect}