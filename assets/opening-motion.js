// Advance by painted frames, rather than jumping after a slow frame or hidden tab.
export function playOpening(render, {duration = 2400, schedule = requestAnimationFrame,
 visible = () => !document.hidden} = {}) {
 return new Promise(resolve => {
  let previous = null, elapsed = 0;
  render(0);
  function frame(now) {
   if (!visible()) { previous = null; schedule(frame); return; }
   if (previous !== null) elapsed += Math.min(50, Math.max(0, now - previous));
   previous = now;
   const progress = Math.min(1, elapsed / duration);
   render(progress);
   if (progress < 1) schedule(frame); else resolve();
  }
  schedule(frame);
 });
}
