"use client";

/**
 * CanvasText
 * ──────────
 * Headline rendered as a cloud of canvas particles. Glyphs are rasterized
 * offscreen, sampled into points, then animated through a loading-circle
 * hold that slowly morphs into the letterforms — with soft idle drift and
 * optional pointer magnetism after settle. Zero deps beyond React.
 *
 * Motion contract:
 * - Intro timeline is driven by `loadDuration` (ring spin) then
 *   `morphDuration` (ring → text).
 * - rAF loop only while animating / drifting / pointer-active; stops when
 *   the lattice is locked (drift=0, no pointer) to save CPU.
 * - Load spin writes positions directly; morph freezes ring origins once
 *   (no per-frame trig). Glyph sampling reads only the text bounding box.
 * - `prefers-reduced-motion` paints a static sampled glyph (no drift).
 * - Particles reassemble on text / size / density / scatter / replay changes.
 */

import * as React from "react";

export interface CanvasTextProps {
  /** The string to rasterize into particles. */
  text: string;
  /** Fill color for particles. Defaults to currentColor. */
  color?: string;
  /** Particle diameter in CSS pixels. Default: 1.6. */
  particleSize?: number;
  /**
   * Sampling stride in source pixels (1 = densest). Higher = fewer particles.
   * Default: 2.
   */
  density?: number;
  /** Soft idle drift after settle, in CSS pixels. 0 = locked grid (default). */
  drift?: number;
  /** How far the loading ring sits from center, in CSS pixels. Default: 48. */
  scatter?: number;
  /** Seconds spent spinning on the loading ring before morph starts. Default: 1.0. */
  loadDuration?: number;
  /** Seconds for the ring → text morph. Default: 1.4. */
  morphDuration?: number;
  /** Pointer attraction strength (0 = off). Default: 0.35. */
  magnetic?: number;
  /** Radius of pointer influence in CSS pixels. Default: 100. */
  magneticRadius?: number;
  /** Force the loop paused. When omitted, auto-pauses off-screen / hidden. */
  paused?: boolean;
  /**
   * Bump to re-run the scatter → assemble intro without changing other props.
   * Useful for playground Replay controls.
   */
  replayKey?: string | number;
  /** Optional Tailwind class for sizing the host box. */
  className?: string;
  /** Font size in CSS pixels. Default: 64. */
  fontSize?: number;
  /** Font weight. Default: 600. */
  fontWeight?: number | string;
  /** Font family. Default: system UI sans. */
  fontFamily?: string;
}

type Particle = {
  homeX: number;
  homeY: number;
  /** Ring → text lerp start, captured once when morph begins. */
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  seed: number;
  orbitAngle: number;
  orbitRadius: number;
};

type Engine = {
  particles: Particle[];
  width: number;
  height: number;
  cx: number;
  cy: number;
  dpr: number;
  /** Last dpr applied via setTransform — skip redundant transforms. */
  paintedDpr: number;
  color: string;
  particleSize: number;
  drift: number;
  magnetic: number;
  magneticRadius: number;
  /** Intro time that has actually been animated, excluding paused time. */
  introElapsed: number;
  /** Last rAF timestamp used to advance the intro timeline. */
  lastFrameTime: number;
  /** Ms spent on the spinning ring. */
  loadMs: number;
  /** Ms spent morphing ring → text. */
  morphMs: number;
  /** True after morph origins were frozen from the live ring. */
  morphOriginsReady: boolean;
  pointer: { x: number; y: number; active: boolean };
  reducedMotion: boolean;
  /** True once intro finished and lattice is static (no drift / pointer). */
  idleLocked: boolean;
  ctx: CanvasRenderingContext2D;
};

const DEFAULT_FONT_FAMILY =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

const SPIN_RATE = 0.0024;
/** Soft cap — denser samples are stride-skipped so mobile stays smooth. */
const MAX_PARTICLES = 2800;
const RESIZE_DEBOUNCE_MS = 80;
const TWO_PI = Math.PI * 2;

/**
 * Canvas-backed particle headline. Samples rasterized glyphs into points that
 * load as a spinning circle, then slowly resolve into letterforms.
 */
export function CanvasText({
  text,
  color,
  particleSize = 1.6,
  density = 2,
  drift = 0,
  scatter = 48,
  loadDuration = 1,
  morphDuration = 1.4,
  magnetic = 0.35,
  magneticRadius = 100,
  paused,
  replayKey,
  className,
  fontSize = 64,
  fontWeight = 600,
  fontFamily = DEFAULT_FONT_FAMILY,
}: CanvasTextProps) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const engineRef = React.useRef<Engine | null>(null);
  const offscreenRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number>(0);
  const resizeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const wrapRectRef = React.useRef<DOMRect | null>(null);
  const inViewRef = React.useRef(true);
  const pageVisibleRef = React.useRef(true);
  const pausedPropRef = React.useRef(paused);
  const colorPropRef = React.useRef(color);
  const kickLoopRef = React.useRef<((force?: boolean) => void) | null>(null);
  pausedPropRef.current = paused;
  colorPropRef.current = color;

  const safeDensity = Math.max(1, Math.round(density));
  const safeParticleSize = Math.max(0.6, particleSize);
  const safeDrift = Math.max(0, drift);
  const safeScatter = Math.max(12, scatter);
  const safeLoadDuration = Math.max(0.2, loadDuration);
  const safeMorphDuration = Math.max(0.2, morphDuration);
  const safeMagnetic = Math.max(0, magnetic);
  const safeMagneticRadius = Math.max(8, magneticRadius);

  const hostMinHeight = Math.max(
    160,
    Math.ceil(safeScatter * 2.35 + safeParticleSize * 4 + 32),
  );

  const liveRef = React.useRef({
    particleSize: safeParticleSize,
    drift: safeDrift,
    magnetic: safeMagnetic,
    magneticRadius: safeMagneticRadius,
  });
  liveRef.current = {
    particleSize: safeParticleSize,
    drift: safeDrift,
    magnetic: safeMagnetic,
    magneticRadius: safeMagneticRadius,
  };

  const rebuild = React.useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const cssW = Math.max(1, wrap.clientWidth);
    const cssH = Math.max(1, wrap.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cx = cssW / 2;
    const cy = cssH / 2;
    const pixelW = Math.max(1, Math.round(cssW * dpr));
    const pixelH = Math.max(1, Math.round(cssH * dpr));

    // Avoid resetting the bitmap (and flashing) when size is unchanged.
    if (canvas.width !== pixelW) canvas.width = pixelW;
    if (canvas.height !== pixelH) canvas.height = pixelH;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    // Reuse the existing 2d context when the canvas bitmaps were not reset.
    const prev = engineRef.current;
    const ctx =
      prev && prev.width === cssW && prev.height === cssH && prev.dpr === dpr
        ? prev.ctx
        : canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resolvedColor = resolveFillColor(wrap, colorPropRef.current);

    let off = offscreenRef.current;
    if (!off) {
      off = document.createElement("canvas");
      offscreenRef.current = off;
    }
    if (off.width !== pixelW) off.width = pixelW;
    if (off.height !== pixelH) off.height = pixelH;

    const octx = off.getContext("2d", { willReadFrequently: true });
    if (!octx) return;

    const safeFontSize = Math.max(12, fontSize);
    octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    octx.clearRect(0, 0, cssW, cssH);
    octx.fillStyle = "#ffffff";
    octx.font = `${fontWeight} ${safeFontSize}px ${fontFamily}`;
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText(text || " ", cx, cy);

    // Read only the glyph bounding box — full-canvas getImageData is expensive.
    const metrics = octx.measureText(text || " ");
    const textW = Math.max(
      safeFontSize,
      (metrics.actualBoundingBoxLeft ?? 0) +
        (metrics.actualBoundingBoxRight ?? metrics.width / 2),
    );
    const textH = Math.max(
      safeFontSize,
      (metrics.actualBoundingBoxAscent ?? safeFontSize * 0.8) +
        (metrics.actualBoundingBoxDescent ?? safeFontSize * 0.25),
    );
    const pad = Math.ceil(safeFontSize * 0.35);
    const boxCssX = Math.max(0, Math.floor(cx - textW / 2 - pad));
    const boxCssY = Math.max(0, Math.floor(cy - textH / 2 - pad));
    const boxCssW = Math.min(cssW - boxCssX, Math.ceil(textW + pad * 2));
    const boxCssH = Math.min(cssH - boxCssY, Math.ceil(textH + pad * 2));
    const boxX = Math.floor(boxCssX * dpr);
    const boxY = Math.floor(boxCssY * dpr);
    const boxW = Math.max(1, Math.ceil(boxCssW * dpr));
    const boxH = Math.max(1, Math.ceil(boxCssH * dpr));

    const {
      data,
      width: dataW,
      height: dataH,
    } = octx.getImageData(boxX, boxY, boxW, boxH);
    let step = Math.max(1, Math.round(safeDensity * dpr));

    // Estimate sample count; widen stride if we'd blow the particle budget.
    const approx = Math.ceil(dataW / step) * Math.ceil(dataH / step) * 0.35; // denser inside glyph bbox
    if (approx > MAX_PARTICLES) {
      step = Math.max(
        step,
        Math.ceil(Math.sqrt((dataW * dataH * 0.35) / MAX_PARTICLES)),
      );
    }

    const particles: Particle[] = [];
    const invDpr = 1 / dpr;
    const originOffsetX = boxX * invDpr;
    const originOffsetY = boxY * invDpr;

    for (let y = 0; y < dataH; y += step) {
      const row = y * dataW;
      for (let x = 0; x < dataW; x += step) {
        if (data[(row + x) * 4 + 3] < 128) continue;
        const homeX = Math.round(originOffsetX + x * invDpr);
        const homeY = Math.round(originOffsetY + y * invDpr);
        particles.push({
          homeX,
          homeY,
          originX: homeX,
          originY: homeY,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          seed: 0,
          orbitAngle: 0,
          orbitRadius: 0,
        });
        if (particles.length >= MAX_PARTICLES) break;
      }
      if (particles.length >= MAX_PARTICLES) break;
    }

    const orbitJitter = 1.12;
    const edgePad = safeParticleSize * 2 + 10;
    const maxFitRadius =
      Math.max(8, Math.min(cssW, cssH) / 2 - edgePad) / orbitJitter;
    const ringRadius = Math.min(safeScatter, maxFitRadius);
    const count = Math.max(particles.length, 1);
    const twoPiOverCount = TWO_PI / count;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]!;
      const seed = Math.random();
      p.orbitAngle = i * twoPiOverCount + seed * 0.08;
      p.orbitRadius = ringRadius * (0.88 + seed * 0.24);
      p.x = cx + Math.cos(p.orbitAngle) * p.orbitRadius;
      p.y = cy + Math.sin(p.orbitAngle) * p.orbitRadius;
      p.originX = p.x;
      p.originY = p.y;
      p.seed = seed * 1000;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        p.x = p.homeX;
        p.y = p.homeY;
        p.originX = p.homeX;
        p.originY = p.homeY;
      }
    }

    const prevPointer = prev?.pointer ?? {
      x: cx,
      y: cy,
      active: false,
    };

    const live = liveRef.current;
    const now = performance.now();
    engineRef.current = {
      particles,
      width: cssW,
      height: cssH,
      cx,
      cy,
      dpr,
      paintedDpr: -1,
      color: resolvedColor,
      particleSize: live.particleSize,
      drift: live.drift,
      magnetic: live.magnetic,
      magneticRadius: live.magneticRadius,
      introElapsed: 0,
      lastFrameTime: now,
      loadMs: safeLoadDuration * 1000,
      morphMs: safeMorphDuration * 1000,
      morphOriginsReady: false,
      pointer: prevPointer,
      reducedMotion,
      idleLocked: reducedMotion,
      ctx,
    };

    wrapRectRef.current = wrap.getBoundingClientRect();
    paintFrame(engineRef.current);
    // Force the loop awake for the new intro (even if a prior run had idle-locked).
    kickLoopRef.current?.(true);
  }, [
    text,
    fontSize,
    fontWeight,
    fontFamily,
    safeDensity,
    safeScatter,
    safeLoadDuration,
    safeMorphDuration,
    replayKey,
  ]);

  const syncFillColor = React.useCallback(() => {
    const wrap = wrapRef.current;
    const engine = engineRef.current;
    if (!wrap || !engine) return;
    const next = resolveFillColor(wrap, colorPropRef.current);
    if (next === engine.color) return;
    engine.color = next;
    paintFrame(engine);
  }, []);

  React.useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.particleSize = safeParticleSize;
    engine.drift = safeDrift;
    engine.magnetic = safeMagnetic;
    engine.magneticRadius = safeMagneticRadius;
    if (safeMagnetic <= 0) {
      engine.pointer.active = false;
    }
    // Drift coming online must wake a stopped idle loop.
    if (engine.idleLocked && safeDrift > 0) {
      kickLoopRef.current?.(true);
    }
    paintFrame(engine);
  }, [safeParticleSize, safeDrift, safeMagnetic, safeMagneticRadius]);

  React.useEffect(() => {
    rebuild();

    const wrap = wrapRef.current;
    if (!wrap) return;

    const scheduleRebuild = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        resizeTimerRef.current = null;
        wrapRectRef.current = wrap.getBoundingClientRect();
        rebuild();
      }, RESIZE_DEBOUNCE_MS);
    };

    const ro = new ResizeObserver(scheduleRebuild);
    ro.observe(wrap);

    const mo = new MutationObserver(() => syncFillColor());
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => {
      ro.disconnect();
      mo.disconnect();
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
  }, [rebuild, syncFillColor]);

  React.useEffect(() => {
    syncFillColor();
  }, [color, syncFillColor]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let running = false;

    const shouldRun = () => {
      const engine = engineRef.current;
      if (!engine || engine.reducedMotion) return false;
      if (pausedPropRef.current === true) return false;
      if (engine.idleLocked) return false;
      if (pausedPropRef.current === false) return true;
      return inViewRef.current && pageVisibleRef.current;
    };

    const tick = (now: number) => {
      const engine = engineRef.current;
      if (!engine || !shouldRun()) {
        running = false;
        if (engine) paintFrame(engine);
        return;
      }

      const stillAnimating = stepParticles(engine, now);
      paintFrame(engine);

      if (!stillAnimating && engine.drift <= 0 && !engine.pointer.active) {
        engine.idleLocked = true;
        running = false;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const ensureLoop = (force = false) => {
      const engine = engineRef.current;
      if (!engine || engine.reducedMotion) return;
      if (pausedPropRef.current === true) return;

      if (force) engine.idleLocked = false;

      // Locked lattice with no drift / pointer — stay asleep.
      if (engine.idleLocked && engine.drift <= 0 && !engine.pointer.active) {
        return;
      }

      if (
        pausedPropRef.current !== false &&
        !(inViewRef.current && pageVisibleRef.current)
      ) {
        return;
      }

      if (running) return;
      engine.idleLocked = false;
      engine.lastFrameTime = performance.now();
      running = true;
      rafRef.current = requestAnimationFrame(tick);
    };
    kickLoopRef.current = ensureLoop;

    const io = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries.some((e) => e.isIntersecting);
        if (inViewRef.current) ensureLoop();
      },
      { threshold: 0.01 },
    );
    io.observe(wrap);

    const onVisibility = () => {
      pageVisibleRef.current = document.visibilityState !== "hidden";
      if (pageVisibleRef.current) ensureLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    pageVisibleRef.current = document.visibilityState !== "hidden";

    ensureLoop();

    return () => {
      running = false;
      kickLoopRef.current = null;
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [paused]);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || safeMagnetic <= 0) return;

    const onMove = (event: PointerEvent) => {
      const engine = engineRef.current;
      if (!engine || engine.magnetic <= 0) return;
      const rect = wrap.getBoundingClientRect();
      wrapRectRef.current = rect;
      engine.pointer.x = event.clientX - rect.left;
      engine.pointer.y = event.clientY - rect.top;
      engine.pointer.active = true;
      if (engine.idleLocked) {
        kickLoopRef.current?.(true);
      }
    };

    const onLeave = () => {
      const engine = engineRef.current;
      if (!engine) return;
      engine.pointer.active = false;
      // Snap back to the locked lattice when magnetism releases.
      if (engine.drift <= 0) {
        const ps = engine.particles;
        for (let i = 0; i < ps.length; i++) {
          const p = ps[i]!;
          p.x = p.homeX;
          p.y = p.homeY;
          p.vx = 0;
          p.vy = 0;
        }
        engine.idleLocked = true;
        paintFrame(engine);
      }
    };

    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointercancel", onLeave);

    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointercancel", onLeave);
    };
  }, [safeMagnetic]);

  return (
    <div
      ref={wrapRef}
      className={[
        "relative w-full max-w-3xl",
        "[--wensity-canvas-text:#09090b] dark:[--wensity-canvas-text:#ffffff]",
        "text-[color:var(--wensity-canvas-text)]",
        className,
      ].filter(Boolean).join(" ")}
      style={{ minHeight: hostMinHeight }}
      aria-label={text}
      role="img"
    >
      <span className="sr-only">{text}</span>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full [transform:translateZ(0)]"
        aria-hidden
      />
    </div>
  );
}

function resolveFillColor(wrap: HTMLElement, color?: string): string {
  if (color && color.trim()) return color.trim();

  const token = getComputedStyle(wrap)
    .getPropertyValue("--wensity-canvas-text")
    .trim();
  if (token) return token;

  const inherited = getComputedStyle(wrap).color;
  if (inherited && inherited !== "rgba(0, 0, 0, 0)") return inherited;

  return document.documentElement.classList.contains("dark")
    ? "#ffffff"
    : "#09090b";
}

/** Fast departure from the ring, soft landing on the letterforms. */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/**
 * Advance particle simulation. Returns `true` while the intro is still
 * running (caller should keep rAF alive).
 */
function stepParticles(engine: Engine, now: number): boolean {
  const {
    particles,
    drift,
    magnetic,
    magneticRadius,
    pointer,
    loadMs,
    morphMs,
    cx,
    cy,
  } = engine;

  const elapsed = Math.max(
    0,
    engine.introElapsed + Math.max(0, now - engine.lastFrameTime),
  );
  engine.introElapsed = elapsed;
  engine.lastFrameTime = now;
  const pointerLive = pointer.active && magnetic > 0;
  const len = particles.length;

  // Phase 1 — loading ring (direct positions; spring was wasted work here).
  if (elapsed < loadMs) {
    const spin = elapsed * SPIN_RATE;
    for (let i = 0; i < len; i++) {
      const p = particles[i]!;
      const angle = p.orbitAngle + spin;
      p.x = cx + Math.cos(angle) * p.orbitRadius;
      p.y = cy + Math.sin(angle) * p.orbitRadius;
      p.vx = 0;
      p.vy = 0;
    }
    return true;
  }

  // Phase 2 — morph ring → text (starts immediately when load ends).
  const morphElapsed = elapsed - loadMs;
  if (morphElapsed < morphMs) {
    if (!engine.morphOriginsReady) {
      // Freeze live ring positions once — no per-frame trig during morph.
      for (let i = 0; i < len; i++) {
        const p = particles[i]!;
        p.originX = p.x;
        p.originY = p.y;
      }
      engine.morphOriginsReady = true;
    }

    const raw = Math.min(1, morphElapsed / Math.max(1, morphMs));

    for (let i = 0; i < len; i++) {
      const p = particles[i]!;
      // Light stagger only — keeps a cascade without delaying leave-circle.
      const stagger = (p.seed % 180) / 1000;
      const delayed = Math.min(
        1,
        Math.max(0, (raw - stagger * 0.12) / (1 - stagger * 0.12)),
      );
      const u = easeOutCubic(delayed);

      if (u >= 0.995) {
        p.x = p.homeX;
        p.y = p.homeY;
        p.vx = 0;
        p.vy = 0;
        continue;
      }

      p.x = p.originX + (p.homeX - p.originX) * u;
      p.y = p.originY + (p.homeY - p.originY) * u;
      p.vx = 0;
      p.vy = 0;
    }
    return true;
  }

  // Phase 3 — settled lattice.
  if (!pointerLive && drift <= 0) {
    for (let i = 0; i < len; i++) {
      const p = particles[i]!;
      p.x = p.homeX;
      p.y = p.homeY;
      p.vx = 0;
      p.vy = 0;
    }
    return false;
  }

  const radiusSq = magneticRadius * magneticRadius;

  for (let i = 0; i < len; i++) {
    const p = particles[i]!;
    let targetX = p.homeX;
    let targetY = p.homeY;

    if (drift > 0) {
      targetX += Math.sin(now * 0.0012 + p.seed) * drift;
      targetY += Math.cos(now * 0.0015 + p.seed * 1.3) * drift;
    }

    if (pointerLive) {
      const dx = p.homeX - pointer.x;
      const dy = p.homeY - pointer.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < radiusSq && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const falloff = 1 - dist / magneticRadius;
        const push = magnetic * falloff * falloff * 28;
        targetX += (dx / dist) * push;
        targetY += (dy / dist) * push;
      }
    }

    p.vx = (p.vx + (targetX - p.x) * 0.22) * 0.76;
    p.vy = (p.vy + (targetY - p.y) * 0.22) * 0.76;
    p.x += p.vx;
    p.y += p.vy;
  }

  return true;
}

/** Paint particles as axis-aligned squares — indistinguishable from discs at ~1–3px, far cheaper than arc(). */
function paintFrame(engine: Engine) {
  const { ctx, dpr, particles, color, particleSize, width, height } = engine;
  if (engine.paintedDpr !== dpr) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    engine.paintedDpr = dpr;
  }
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = color;

  const size = particleSize;
  const half = size * 0.5;
  const len = particles.length;
  // Single path + one fill beats N beginPath/fill pairs.
  ctx.beginPath();
  for (let i = 0; i < len; i++) {
    const p = particles[i]!;
    ctx.rect(p.x - half, p.y - half, size, size);
  }
  ctx.fill();
}

export default CanvasText;
