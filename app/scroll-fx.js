"use client";
// The scroll-driven opening and the section reveals (GSAP + ScrollTrigger), with Lenis smooth
// scrolling on desktop. Three modes:
// - desktop, motion OK: the hero pins, and scrolling scrubs it open: the intro gives way to the
//   headline, the timeline card, 1514 ms counting up, the bars drawing in, then the buttons;
// - narrow screens, motion OK: no pin, no Lenis; each hero piece and section reveals as it enters;
// - reduced motion: nothing moves, everything is shown as the server rendered it.
// Without JS the page is the server's HTML, fully shown.
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { setLenis } from "./smooth.js";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
const NARROW = "(max-width: 899.98px) and (prefers-reduced-motion: no-preference)";

function countTo(el, to) {
  const o = { v: 0 };
  return { o, update: () => (el.textContent = `${Math.round(o.v)} ms`), to };
}

export default function ScrollFX() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    const q = (s) => gsap.utils.toArray(s);

    mm.add(DESKTOP, () => {
      const lenis = new Lenis({ autoRaf: false, lerp: 0.12 });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const hero = document.querySelector(".hero");
      hero.classList.add("pinned");
      const total = hero.querySelector(".tl-total");
      const c = countTo(total, 1514);

      gsap.set(".h-rv, .h-btns", { autoAlpha: 0, y: 28 });
      gsap.set(".tl", { autoAlpha: 0, y: 36 });
      gsap.set(".hero .seg", { clipPath: "inset(0 100% 0 0)" });
      c.update();

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: hero, start: "top top", end: "+=160%", pin: true, scrub: true, anticipatePin: 1 },
      });
      tl.to(".intro", { autoAlpha: 0, y: -48, scale: 0.97, duration: 1 })
        .to(".h-rv", { autoAlpha: 1, y: 0, stagger: 0.25, duration: 0.9 }, 0.7)
        .to(".tl", { autoAlpha: 1, y: 0, duration: 0.8 }, 1.6)
        .to(c.o, { v: 1514, duration: 1.1, ease: "none", onUpdate: c.update }, 1.9)
        .to(".hero .seg", { clipPath: "inset(0 0% 0 0)", stagger: 0.35, duration: 0.6, ease: "none" }, 2.0)
        .to(".h-btns", { autoAlpha: 1, y: 0, duration: 0.6 }, 3.1)
        .to({}, { duration: 0.4 });

      reveals();
      return () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        setLenis(null);
        hero.classList.remove("pinned");
        total.textContent = "1514 ms";
      };
    });

    mm.add(NARROW, () => {
      const total = document.querySelector(".tl-total");
      const c = countTo(total, 1514);
      gsap.set(".h-rv, .h-btns, .tl", { autoAlpha: 0, y: 24 });
      gsap.set(".hero .seg", { clipPath: "inset(0 100% 0 0)" });
      ScrollTrigger.batch(".h-rv, .h-btns", {
        start: "top 90%",
        once: true,
        onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }),
      });
      ScrollTrigger.create({
        trigger: ".tl",
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(".tl", { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" });
          c.update();
          gsap.to(c.o, { v: 1514, duration: 0.4, delay: 0.1, ease: "power1.out", onUpdate: c.update });
          gsap.to(".hero .seg", { clipPath: "inset(0 0% 0 0)", duration: 0.35, stagger: 0.12, delay: 0.15, ease: "power2.out" });
        },
      });
      reveals();
      return () => {
        total.textContent = "1514 ms";
      };
    });

    function reveals() {
      const els = q("[data-rv]");
      gsap.set(els, { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch(els, {
        start: "top 88%",
        once: true,
        onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.07, ease: "power2.out", overwrite: true }),
      });
    }

    return () => mm.revert();
  }, []);

  return null;
}
