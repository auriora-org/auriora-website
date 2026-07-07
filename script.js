"use strict";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Paging (one-band-per-gesture snap) only engages on the desktop layout AND a
// precise pointer. These two live queries drive the reveal-arming below, the
// header backdrop logic, and the paging block further down, so they're declared
// once up here.
const wideViewport = window.matchMedia("(min-width: 921px)");
const finePointer = window.matchMedia("(pointer: fine)");
const pagingActive = () => wideViewport.matches && finePointer.matches;

// Manage scroll restoration ourselves. The browser's default "auto" restores
// the old scrollY before the .reveal sections have un-hidden, so the 28px
// reveal offset throws each F5 off by ~28px (it drifts). With "manual" we
// restore the saved position ourselves AFTER layout has settled, so a refresh
// keeps the user where they were without the drift. An incoming #hash (shared
// deep link) wins over the saved position.
const SCROLL_KEY = "auriora:scrollY";
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";

  let saveQueued = false;
  window.addEventListener(
    "scroll",
    () => {
      if (saveQueued) return;
      saveQueued = true;
      requestAnimationFrame(() => {
        saveQueued = false;
        try {
          sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY)));
        } catch (e) {
          /* storage may be unavailable (private mode); position memory is optional */
        }
      });
    },
    { passive: true }
  );

  // restore synchronously: this script runs at the end of <body>, so the full
  // layout already exists and the .reveal transforms don't change document
  // height — restoring now (rather than on "load") avoids a flash of the top
  // before the jump.
  // getElementById instead of querySelector: an arbitrary incoming hash
  // (e.g. "#_=_" from a Facebook redirect) is not a valid CSS selector and
  // would make querySelector throw, killing the rest of this script
  const hash = window.location.hash;
  let target = null;
  if (hash.length > 1) {
    try {
      target = document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch (e) {
      target = null;
    }
  }
  if (target) {
    target.scrollIntoView({ behavior: "auto", block: "start" });
  } else {
    let saved = 0;
    try {
      saved = parseInt(sessionStorage.getItem(SCROLL_KEY) || "0", 10);
    } catch (e) {
      saved = 0;
    }
    if (saved > 0) window.scrollTo(0, saved);
  }
}

/* ---------- dynamic year ---------- */

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

/* ---------- smooth in-page scroll ---------- */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
      block: "start",
    });
  });
});

/* ---------- reveal-on-scroll ---------- */

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion.matches && !pagingActive()) {
  // Skip the reveal entirely when paging is active. The .reveal hidden state
  // adds a translateY(28px) offset, and paging snaps to a band with
  // scrollIntoView. If the first Home→Vision gesture lands while Vision (the
  // first .reveal band) is still mid-reveal, the snap targets its offset
  // position; as the transform settles back to 0 the scroll position stays put,
  // so the band ends up 28px high and the next band's top peeks above the fold.
  // Snapping always rests exactly on a band top, so the entrance animation buys
  // nothing here anyway — free scroll (desktop without paging) and mobile still
  // get it via the branch below. Re-snapping to another band and back "fixed" it
  // only because by then the transform had finished; arming it never closes that
  // window cleanly, so we don't arm it at all.
  // arm the hidden state only now that we can guarantee revealing it
  document.documentElement.classList.add("js-reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealItems.forEach((el) => io.observe(el));
  // safety net: if anything is left hidden after load, reveal it
  window.addEventListener("load", () => {
    setTimeout(() => revealItems.forEach((el) => el.classList.add("is-visible")), 1200);
  });
} else {
  revealItems.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- image assets: if a band defines --asset, fade its canvas ---------- */

document.querySelectorAll(".band").forEach((band) => {
  const asset = getComputedStyle(band).getPropertyValue("--asset").trim();
  if (asset && asset !== "none") band.classList.add("has-asset");
});

/* ---------- header + nav current-section: adapt to the band on screen ---------- */

const header = document.querySelector(".site-header");
const bands = Array.from(document.querySelectorAll(".band"));
// nav links mark the current section; map each to its target band
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const navTargets = navLinks.map((a) => document.querySelector(a.getAttribute("href")));

// wideViewport / finePointer / pagingActive are declared at the top of the file
// (the reveal-arming uses them too); the header backdrop logic below shares them.

let ticking = false;

const bandUnder = (probeY) => {
  for (const band of bands) {
    const rect = band.getBoundingClientRect();
    if (rect.top <= probeY && rect.bottom > probeY) return band;
  }
  return null;
};

const update = () => {
  ticking = false;
  const mid = window.innerHeight / 2;

  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
    const headerH = header.offsetHeight;
    const hb = bandUnder(headerH + 1);
    header.classList.toggle("on-light", hb ? hb.classList.contains("band-light") : true);
    // Show the scrim/blur only while a band boundary is actively crossing the
    // header — i.e. a band's top edge sits within (just above → just below) the
    // header's own height, so part of the header overlaps the old band and part
    // the new and the text would otherwise be unreadable across the seam. The
    // margin lets it fade in slightly before/after the crossing. When settled
    // at a band top the boundary rests at ~0 (≤ margin), so the blur turns off.
    const margin = 56;
    let crossing = false;
    for (const band of bands) {
      const top = band.getBoundingClientRect().top; // boundary vs viewport top
      if (top > margin && top < headerH + margin) {
        crossing = true;
        break;
      }
    }
    header.classList.toggle("in-transition", crossing);

    // On the desktop layout WITHOUT paging (free scroll — e.g. trackpad/touch
    // not detected as a fine pointer, or paging otherwise off), content can come
    // to rest at any offset, so a band's text can sit directly behind the header
    // and read as an unreadable overlap. Paging never rests mid-band, so it needs
    // no resting backdrop. Mobile (≤920px) already has its own ::before blur.
    // Mark this state so a permanent, gentle header backdrop fades in.
    header.classList.toggle("free-scroll", wideViewport.matches && !pagingActive());
  }

  // mark the nav link of the band crossing the viewport middle as current
  if (navLinks.length) {
    const current = bandUnder(mid);
    const activeIndex = navTargets.findIndex((t) => t === current);
    navLinks.forEach((a, i) => a.classList.toggle("is-current", i === activeIndex));
  }
};

const onScroll = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
};

update();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
// re-evaluate the header backdrop when paging eligibility changes (pointer type
// switches, or the width crosses the 921px breakpoint) without a scroll/resize
wideViewport.addEventListener("change", onScroll);
finePointer.addEventListener("change", onScroll);

/* ---------- full-page scroll (one band per scroll gesture) ----------
   A scroll gesture pages to the next/previous band so you always land exactly
   on a band top — no mid-scroll in-between state. Bands taller than the
   viewport (e.g. Principles/Fields on short windows) scroll freely inside until
   their far edge is reached, only then paging on. Honours reduced-motion. */
{
  const EDGE = 24; // px tolerance: treat near-viewport bands as a single page,
  //                  and count "reached the far edge" a touch early
  let locked = false; // ignore input while a page animation is in flight
  let touchStartY = null;

  // wideViewport / finePointer / pagingActive are declared at module scope (the
  // header backdrop logic shares them). Paging only suits the desktop layout
  // (full-height bands) with a precise pointer, keeping snapping off on phones,
  // small windows, and large touch tablets — where auto-height bands run taller
  // than the viewport and snapping would clip them.

  // the footer is a page too, so the last band can scroll down into it
  const footer = document.querySelector(".site-footer");
  const pages = footer ? [...bands, footer] : bands.slice();

  const currentIndex = () => {
    // at the very bottom the last page (often a short footer) can't reach the
    // viewport top, so anchoring purely by nearest-top would pick the band
    // above it — treat "scrolled to max" as being on the last page
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= maxY - EDGE) return pages.length - 1;

    // a tall page can still own the viewport while the NEXT page's top has
    // already crept above the fold — prefer the page that currently fills the
    // viewport (top at/above the fold, bottom at/below it) so we don't switch
    // to the next page a gesture early and waste a scroll
    const vh = window.innerHeight;
    for (let i = 0; i < pages.length; i++) {
      const r = pages[i].getBoundingClientRect();
      if (r.top <= EDGE && r.bottom >= vh - EDGE) return i;
    }

    // otherwise: the page whose top is nearest the viewport top
    let idx = 0;
    let best = Infinity;
    pages.forEach((p, i) => {
      const d = Math.abs(p.getBoundingClientRect().top);
      if (d < best) {
        best = d;
        idx = i;
      }
    });
    return idx;
  };

  const pageTo = (index) => {
    const target = pages[index];
    if (!target) return;
    locked = true;
    target.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
      block: "start",
    });
    // release after the smooth scroll settles (or immediately if no motion)
    window.setTimeout(
      () => {
        locked = false;
      },
      reduceMotion.matches ? 60 : 700
    );
  };

  // smooth-scroll by a delta within the current page (used to settle on the foot
  // or head of a band that's only modestly taller than the viewport), reusing
  // the same lock window as pageTo so a follow-up gesture isn't read mid-scroll
  const scrollBy = (dy) => {
    locked = true;
    window.scrollBy({
      top: dy,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
    window.setTimeout(
      () => {
        locked = false;
      },
      reduceMotion.matches ? 60 : 700
    );
  };

  // returns true if the gesture was consumed (paged); false to allow native
  // scrolling inside a page that's taller than the viewport
  const handle = (dir) => {
    // not consumed → the gesture falls through to native scrolling
    if (!pagingActive()) return false;
    if (locked) return true;
    const i = currentIndex();
    const page = pages[i];
    const rect = page.getBoundingClientRect();
    const vh = window.innerHeight;
    const tallerThanView = rect.height > vh + EDGE;

    if (dir > 0) {
      // Page taller than the viewport with content still below the fold: reveal
      // it before paging on. If a full viewport-worth still remains, hand the
      // gesture to native scrolling for the middle content; if only a sliver is
      // left, snap straight to the band's foot so its last rows (e.g. the
      // Direction pillar grid) are never skipped past unread. Only once the foot
      // is reached do we page to the next band.
      if (tallerThanView && rect.bottom > vh + EDGE) {
        if (rect.bottom > vh * 2) return false; // long band: native scroll
        scrollBy(rect.bottom - vh); // short overflow: settle on the foot
        return true;
      }
      if (i < pages.length - 1) {
        pageTo(i + 1);
        return true;
      }
      return true; // last page: nothing below, suppress overshoot
    } else {
      // mirror image upward: reveal content above the fold before paging back
      if (tallerThanView && rect.top < -EDGE) {
        if (rect.top < -vh) return false; // long band: native scroll
        scrollBy(rect.top); // short overflow: settle on the head
        return true;
      }
      if (i > 0) {
        pageTo(i - 1);
        return true;
      }
      return true;
    }
  };

  window.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey) return; // pinch/ctrl+wheel is browser zoom, never paging
      if (Math.abs(e.deltaY) < 2) return;
      const consumed = handle(e.deltaY > 0 ? 1 : -1);
      if (consumed) e.preventDefault();
    },
    { passive: false }
  );

  window.addEventListener("keydown", (e) => {
    if (!pagingActive()) return; // free scroll: let the browser handle keys
    let dir = 0;
    if (e.key === "PageDown" || e.key === "ArrowDown" || (e.key === " " && !e.shiftKey)) dir = 1;
    else if (e.key === "PageUp" || e.key === "ArrowUp" || (e.key === " " && e.shiftKey)) dir = -1;
    else if (e.key === "Home") {
      e.preventDefault();
      pageTo(0);
      return;
    } else if (e.key === "End") {
      e.preventDefault();
      pageTo(pages.length - 1);
      return;
    }
    if (dir !== 0 && handle(dir)) e.preventDefault();
  });

  window.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      if (touchStartY === null || locked) return;
      const dy = touchStartY - e.touches[0].clientY;
      if (Math.abs(dy) < 40) return; // ignore small drags
      const consumed = handle(dy > 0 ? 1 : -1);
      if (consumed) {
        e.preventDefault();
        touchStartY = null;
      }
    },
    { passive: false }
  );
}

/* ============================================================
   Signal field — lightweight canvas placeholder per band.
   Each variant evokes the concept of its section. These render
   cleanly on their own and act as a backdrop the future image
   assets can replace or sit on top of.
   ============================================================ */

// per-variant tuning: colour, density, motion, link distance
const VARIANTS = {
  // home — ethereal horizontal wave of fine particles (light band)
  wave: { palette: ["#7d93b8", "#9fb2cf", "#c2cede"], density: 0.05, link: 0, sweep: 1, glow: 0.5, max: 150 },
  // vision — particles orbiting a luminous ring (dark band)
  ring: { palette: ["#57c8d6", "#7a8cff", "#c9a4ff"], density: 0.035, link: 0, ring: 1, glow: 0.9, max: 130 },
  // question — a network ABOUT connection: visible links, nodes clustered to
  // the right like the concept image, calm drift
  network: { palette: ["#11161a", "#2f6f63", "#5a6b8c"], density: 0.05, link: 175, linkOpacity: 0.55, glow: 0.6, cluster: 1, calm: 0.6, max: 90 },
  // living web — dense bioluminescent connected web (dark band)
  web: { palette: ["#7fe6c4", "#e0be82", "#69d0a0"], density: 0.07, link: 120, glow: 0.85, max: 200 },
  // connections — swirling cosmic particle field (dark band)
  field: { palette: ["#7a8cff", "#ff9d6c", "#57c8d6", "#c9a4ff"], density: 0.075, link: 0, swirl: 1, glow: 0.9, max: 220 },
};

function startSignalField(canvas) {
  const variant = canvas.dataset.variant || "network";
  const cfg = VARIANTS[variant] || VARIANTS.network;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return null;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let points = [];
  let raf = 0;
  let running = false;

  const seed = (str) => {
    // deterministic-ish per-variant variety without Math.random reliance issues
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % 99991;
    return hash / 99991;
  };
  const base = seed(variant);

  const build = () => {
    const count = Math.min(cfg.max, Math.max(28, Math.round(w * h * cfg.density * 0.0009)));
    points = [];
    for (let i = 0; i < count; i++) {
      const t = (i + 1) / count;
      // cluster mode: bias positions toward the right, gathered like the
      // concept image, so the web reads as a single connected constellation
      let ox = Math.random() * w;
      let oy = Math.random() * h;
      if (cfg.cluster) {
        const cx = w * 0.66;
        const cy = h * 0.5;
        const spread = Math.min(w, h) * 0.42;
        const ang = Math.random() * Math.PI * 2;
        const rad = Math.pow(Math.random(), 0.7) * spread; // denser toward centre
        ox = cx + Math.cos(ang) * rad * 1.15;
        oy = cy + Math.sin(ang) * rad;
      }
      points.push({
        x: ox,
        y: oy,
        ox,
        oy,
        r: Math.random() * 1.7 + 0.7,
        phase: (base + t) * Math.PI * 2 + Math.random() * 6,
        speed: 0.2 + Math.random() * 0.6,
        color: cfg.palette[i % cfg.palette.length],
      });
    }
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  };

  const place = (p, time) => {
    const t = time * 0.0001;
    if (cfg.ring) {
      // orbit around a centre-right ring
      const cx = w * 0.72;
      const cy = h * 0.46;
      const radius = Math.min(w, h) * (0.18 + 0.16 * ((p.phase % 6.28) / 6.28));
      const a = p.phase + t * p.speed;
      p.x = cx + Math.cos(a) * radius;
      p.y = cy + Math.sin(a) * radius * 0.9;
    } else if (cfg.swirl) {
      const cx = w * 0.55;
      const cy = h * 0.5;
      const radius = Math.min(w, h) * (0.08 + 0.4 * ((p.phase % 6.28) / 6.28));
      const a = p.phase + t * p.speed * 0.7;
      p.x = cx + Math.cos(a) * radius * 1.3;
      p.y = cy + Math.sin(a) * radius;
    } else if (cfg.sweep) {
      // gentle horizontal drift forming a wave band
      p.x = p.ox + Math.cos(t * p.speed + p.phase) * 30;
      p.y = p.oy + Math.sin(t * p.speed * 0.8 + p.phase) * (h * 0.04) +
        Math.sin(p.ox * 0.01 + t) * (h * 0.06);
    } else {
      const amp = cfg.calm ? 14 : 24;
      const rate = cfg.calm ? cfg.calm : 1;
      p.x = p.ox + Math.cos(t * p.speed * rate + p.phase) * amp;
      p.y = p.oy + Math.sin(t * p.speed * 0.9 * rate + p.phase) * (amp * 0.85);
    }
  };

  const render = (time) => {
    ctx.clearRect(0, 0, w, h);

    for (const p of points) place(p, time);

    // links
    if (cfg.link) {
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < cfg.link) {
            ctx.globalAlpha = (1 - dist / cfg.link) * (cfg.linkOpacity || 0.22);
            ctx.strokeStyle = a.color;
            ctx.lineWidth = cfg.linkOpacity ? 1 : 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }

    // points
    for (const p of points) {
      ctx.globalAlpha = cfg.glow;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    raf = requestAnimationFrame(render);
  };

  const start = () => {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(render);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });

  return { start, stop, canvas };
}

/* boot all fields; only animate the ones on screen to save CPU */

const fields = [];
document.querySelectorAll(".signal-canvas").forEach((canvas) => {
  const field = startSignalField(canvas);
  if (field) fields.push(field);
});

if (fields.length) {
  if (reduceMotion.matches) {
    // draw a single static frame, no loop
    fields.forEach((f) => {
      f.start();
      requestAnimationFrame(() => f.stop());
    });
  } else if ("IntersectionObserver" in window) {
    const visibility = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const field = fields.find((f) => f.canvas === entry.target);
          if (!field) return;
          if (entry.isIntersecting) field.start();
          else field.stop();
        });
      },
      { threshold: 0.01 }
    );
    fields.forEach((f) => visibility.observe(f.canvas));
  } else {
    fields.forEach((f) => f.start());
  }

  reduceMotion.addEventListener("change", (e) => {
    if (e.matches) fields.forEach((f) => f.stop());
    else fields.forEach((f) => f.start());
  });
}
