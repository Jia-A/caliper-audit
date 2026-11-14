// The one Lenis instance (desktop only), so the card panel can stop page scrolling while it's open.
let lenis = null;
export const setLenis = (l) => (lenis = l);
export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();
