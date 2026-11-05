/* Generated from picture/film/ by npm run compose: edit the modules, not this file. */
"use strict";

// picture/film/canvas.js
var canvas = document.getElementById("picture");
var ctx = canvas.getContext("2d", { alpha: false });
var resolution = Number(document.getElementById("film").dataset.width) / 1920;
var layout = { texts: [], scene: null };
var sceneFade = 1;
var wordFade = 1;
var measuring = false;
function setDrawing(next) {
  if ("ctx" in next) ctx = next.ctx;
  if ("layout" in next) layout = next.layout;
  if ("sceneFade" in next) sceneFade = next.sceneFade;
  if ("wordFade" in next) wordFade = next.wordFade;
  if ("measuring" in next) measuring = next.measuring;
}

// picture/film/palette.js
var P = {
  ground: "#0F1519",
  row: "#1E2932",
  line: "#63758B",
  ink: "#ECE8DF",
  muted: "#C4CCD1",
  accent: "#C9785C",
  evidence: "#7DB7D8",
  authority: "#E0BF78",
  unknown: "#C9785C"
};
var LABEL = 26;
var TYPE = 1.12;

// picture/film/timing/easing.js
var clamp = (q) => Math.max(0, Math.min(1, q));
var mix = (a, b, q) => a + (b - a) * q;
var ease = (q) => {
  q = clamp(q);
  return q * q * (3 - 2 * q);
};
var ramp = (t, start, duration = 0.7) => ease((t - start) / duration);
var bezier = (x1, y1, x2, y2) => (q) => {
  q = clamp(q);
  let u = q;
  for (let i = 0; i < 8; i++) {
    const x = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u ** 2 * x2 + u ** 3 - q;
    const dx = 3 * (1 - u) ** 2 * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u ** 2 * (1 - x2);
    if (Math.abs(x) < 1e-5 || Math.abs(dx) < 1e-6) break;
    u = clamp(u - x / dx);
  }
  return 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u ** 2 * y2 + u ** 3;
};
var standard = bezier(0.4, 0, 0.2, 1);
var soon = (t, start, duration = 0.55) => standard((t - start) / duration);
var pass = (q, edge = 0.12) => clamp(q / edge) * clamp((1 - q) / edge);

// picture/film/drawing/colour.js
var groundLuminance = /* @__PURE__ */ (() => {
  const lin = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
})();
var rgbOf = (v) => /^#[0-9a-f]{6}$/i.test(v ?? "") ? [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16)) : null;
var GROUND = rgbOf(P.ground);
function contrastOf(color, alpha) {
  const rgb = rgbOf(color);
  if (!rgb) return 1;
  const mixed = rgb.map((v, i) => alpha * v + (1 - alpha) * GROUND[i]);
  return (groundLuminance(mixed) + 0.05) / (groundLuminance(GROUND) + 0.05);
}
function blend(a, b, q) {
  const rgb = (v) => [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16));
  const [x, y] = [rgb(a), rgb(b)];
  return "#" + x.map(
    (c, i) => Math.round(mix(c, y[i], clamp(q))).toString(16).padStart(2, "0")
  ).join("");
}

// picture/film/scenes/registry.js
var scenes = {};

// picture/film/timeline.js
var film = window.FILM;
var en = film.edition === "en";
var L = (zh, english) => en ? english : zh;

// picture/film/timing/cues.js
var units = (v) => v.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
var phraseEnd = /* @__PURE__ */ new Map();
var cueCache = /* @__PURE__ */ new Map();
var clauseCache = /* @__PURE__ */ new Map();
function clauseEnds(s) {
  if (!clauseCache.has(s.id)) {
    const ends = [];
    let n = 0;
    for (const ch of s.text) {
      if (/[\p{L}\p{N}]/u.test(ch)) n += units(ch).length;
      else if (/[，。；：！？,.;:!?—]/u.test(ch)) ends.push(n);
    }
    clauseCache.set(s.id, ends);
  }
  return clauseCache.get(s.id);
}
function cue(s, zh, english, { last = false, end = false } = {}) {
  const key = `${s.id}:${zh}:${english}:${last}:${end}`;
  if (cueCache.has(key)) return cueCache.get(key);
  const target = units(L(zh, english));
  const spoken = s.words.map((w) => units(w.text)).join("");
  const index = last ? spoken.lastIndexOf(target) : spoken.indexOf(target);
  if (index < 0 || !target) throw Error(`Missing spoken cue ${key}`);
  const clause = clauseEnds(s).find((n) => n >= index + target.length) ?? spoken.length;
  let cursor = 0, first = null, close = null, said = null;
  for (const w of s.words) {
    const n = units(w.text).length;
    if (first === null && cursor + n > index) first = w.start;
    if (close === null && cursor + n >= index + target.length) close = w.end;
    if (cursor + n >= clause) {
      said = w.end;
      break;
    }
    cursor += n;
  }
  if (first === null || close === null) throw Error(`Unresolved spoken cue ${key}`);
  phraseEnd.set(
    first,
    Math.max(phraseEnd.get(first) ?? 0, Math.min(said ?? close, first + 4.5), close)
  );
  const value = end ? close : first;
  cueCache.set(key, value);
  return value;
}
var cues = (s, pairs) => pairs.map((pair) => cue(s, ...pair));
function cueFrom(s, zh, english, from) {
  const target = units(L(zh, english));
  let spoken = "";
  const starts = s.words.map((w) => {
    const at2 = spoken.length;
    spoken += units(w.text);
    return at2;
  });
  const k = s.words.findIndex((w) => w.start >= from - 1e-6);
  const index = spoken.indexOf(target, k < 0 ? spoken.length : starts[k]);
  if (index < 0 || !target)
    throw Error(`Missing spoken cue ${s.id}:${zh}:${english} after ${from}`);
  let i = starts.length - 1;
  while (starts[i] > index) i--;
  return s.words[i].start;
}

// picture/film/timing/pauses.js
var RECEDE = 0.6;
var thoughtJoins = (() => {
  const joins = [];
  let previous = null;
  for (const s of film.segments) {
    let k = 0;
    for (const group of s.utterance_groups) {
      const need = units(group).length, first = k;
      let n = 0;
      while (k < s.words.length && n < need) n += units(s.words[k++].text).length;
      if (previous !== null) joins.push([previous, s.words[first].start]);
      previous = s.words[k - 1].end;
    }
  }
  return joins;
})();
var pauseHold = (at2, lasting = RECEDE) => {
  for (const [end, next] of thoughtJoins) if (at2 + lasting > end && at2 < next) return next;
  return at2;
};
var thoughtEnd = (at2) => {
  for (const [end] of thoughtJoins) if (end >= at2) return end;
  return Infinity;
};
var quietBefore = thoughtJoins.reduce(
  (sums, [end, next]) => [...sums, sums.at(-1) + Math.max(0, next - end)],
  [0]
);
var voiceTime = (t) => {
  let lo = 0, hi = thoughtJoins.length;
  while (lo < hi) {
    const mid = lo + hi >> 1;
    if (thoughtJoins[mid][0] < t) lo = mid + 1;
    else hi = mid;
  }
  if (!lo) return t;
  const [end, next] = thoughtJoins[lo - 1];
  return t - quietBefore[lo - 1] - Math.max(0, Math.min(t, next) - end);
};

// picture/film/framing/camera.js
var CAMERA = {
  push: ["01", "04", "07", "09", "13", "15", "18"],
  reveal: ["03", "06", "08", "11", "14", "16"],
  drift: ["02", "05", "10", "12", "17"]
};
function cameraOf(s, t, amount = scenes[s.id]?.push ?? 0.02) {
  const cx = film.segments.indexOf(s) % 2 ? 840 : 1080, cy = 500;
  const from = voiceTime(s.start), q = ease(clamp((voiceTime(t) - from) / Math.max(1, voiceTime(s.end) - from)));
  if (CAMERA.drift.includes(s.id))
    return { k: 1 + amount * 0.5, ox: 960 + mix(-12, 12, q), oy: cy, ax: 960, ay: cy };
  const k = CAMERA.reveal.includes(s.id) ? 1 + amount * (1 - q) : CAMERA.push.includes(s.id) ? 1 + amount * q : 1;
  return { k, ox: cx, oy: cy, ax: cx, ay: cy };
}
function push(s, t) {
  const c = cameraOf(s, t);
  ctx.translate(c.ox, c.oy);
  ctx.scale(c.k, c.k);
  ctx.translate(-c.ax, -c.ay);
}

// picture/film/drawing/strokes.js
function font(size, bold, sample) {
  const latin = !/[\u4e00-\u9fff]/u.test(sample);
  return `${bold ? "700 " : ""}${size}px ${latin ? bold ? "FilmLatinBold" : "FilmLatin" : bold ? "FilmBold" : "Film"}`;
}
var labelSize = (size) => size * TYPE;
var typeset = (v) => v.replaceAll("'", "’");
function measure(v, size = LABEL, bold = false, role = "label") {
  v = typeset(v);
  ctx.save();
  ctx.font = font(role === "label" ? labelSize(size) : size, bold, v);
  const w = ctx.measureText(v).width;
  ctx.restore();
  return w;
}
function text(v, x, y, size = LABEL, {
  color = P.ink,
  alpha = 1,
  align = "left",
  bold = false,
  baseline = "middle",
  role = "label",
  tracking = 0,
  group = null,
  whole = null,
  set = null
} = {}) {
  if (alpha < 0.015 || !v) return null;
  v = typeset(v);
  whole = whole === null ? null : typeset(whole);
  ctx.save();
  ctx.globalAlpha = clamp(alpha) * wordFade;
  ctx.font = font(role === "label" ? labelSize(size) : size, bold, v);
  ctx.letterSpacing = `${tracking}px`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillStyle = color;
  ctx.fillText(v, x, y);
  const m = ctx.measureText(v), tr = ctx.getTransform();
  const box2 = [
    x - m.actualBoundingBoxLeft,
    y - m.actualBoundingBoxAscent,
    x + m.actualBoundingBoxRight,
    y + m.actualBoundingBoxDescent
  ];
  const toScreen = (px, py) => [
    (tr.a * px + tr.c * py + tr.e) / resolution,
    (tr.b * px + tr.d * py + tr.f) / resolution
  ];
  const [x0, y0] = toScreen(box2[0], box2[1]), [x1, y1] = toScreen(box2[2], box2[3]);
  ctx.restore();
  const record = {
    text: v,
    bounds: [Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1)],
    alpha: clamp(alpha) * wordFade,
    role,
    scene: layout.scene,
    color,
    group,
    whole: whole ?? v,
    placed: whole !== null,
    size,
    set
  };
  layout.texts.push(record);
  return record;
}
var STRUCTURE = /* @__PURE__ */ new Set([P.line, P.muted]);
function stroke(build, { color = P.line, width = 2, alpha = 1, dash = null, cap = "round" } = {}) {
  if (alpha < 0.01) return;
  const structure = STRUCTURE.has(color), a = structure ? 1 - (1 - clamp(alpha)) ** 2 : clamp(alpha);
  ctx.save();
  ctx.globalAlpha = a * sceneFade;
  ctx.strokeStyle = color;
  ctx.lineWidth = structure ? Math.max(2, width) : width;
  ctx.lineCap = cap;
  ctx.lineJoin = "round";
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath();
  build();
  ctx.stroke();
  ctx.restore();
}
function fill(build, { color = P.row, alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  ctx.save();
  ctx.globalAlpha = clamp(alpha) * sceneFade;
  ctx.fillStyle = color;
  ctx.beginPath();
  build();
  ctx.fill();
  ctx.restore();
}
var line = (x1, y1, x2, y2, o = {}) => stroke(() => {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
}, o);
function box(x, y, w, h, { fill: f = null, stroke: s = null, width = 2, alpha = 1, radius = 8, dash = null } = {}) {
  if (f) fill(() => ctx.roundRect(x, y, w, h, radius), { color: f, alpha });
  if (s) stroke(() => ctx.roundRect(x, y, w, h, radius), { color: s, width, alpha, dash });
}
function dot(x, y, r, { color = P.evidence, alpha = 1, hollow = false, width = 2 } = {}) {
  if (hollow) stroke(() => ctx.arc(x, y, r, 0, Math.PI * 2), { color, alpha, width });
  else fill(() => ctx.arc(x, y, r, 0, Math.PI * 2), { color, alpha });
}
function path(points, { upto = 1, ...o } = {}) {
  if (points.length < 2 || upto <= 0) return;
  const n = Math.max(2, Math.round(points.length * clamp(upto)));
  stroke(
    () => points.slice(0, n).forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)),
    { width: 2.5, color: P.ink, ...o }
  );
}
function ring(x, y, r, { color = P.evidence, alpha = 1, width = 2, upto = 1, start = -Math.PI / 2, dash = null } = {}) {
  if (upto <= 0) return;
  stroke(() => ctx.arc(x, y, r, start, start + Math.PI * 2 * clamp(upto)), {
    color,
    alpha,
    width,
    dash
  });
}
var flowDot = (x, y, r, q, o) => dot(x, y, r * pass(q), o);

// picture/film/framing/captions.js
var CAPTION_JOIN = 0.3;
function caption(t) {
  const caps = film.captions;
  const joined = (a2, b) => a2 && b && b.start - a2.end <= CAPTION_JOIN;
  let i = caps.findIndex((v) => v.start <= t && t < v.end);
  if (i < 0)
    i = caps.findIndex((v, k) => v.end <= t && t < caps[k + 1]?.start && joined(v, caps[k + 1]));
  if (i < 0) return;
  const c = caps[i];
  const a = (joined(caps[i - 1], c) ? 1 : ramp(t, c.start - 0.04, 0.12)) * (joined(c, caps[i + 1]) ? 1 : 1 - ramp(t, c.end - 0.1, 0.1));
  text((c.display_text ?? c.text).trim(), 960, 970, 26, {
    align: "center",
    color: P.ink,
    alpha: 0.94 * Math.max(a, 1e-3),
    role: "caption"
  });
}

// picture/film/drawing/symbols.js
function diamond(x, y, r, { color = P.evidence, alpha = 1, solid = false, width = 2.5 } = {}) {
  const build = () => {
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r, y);
    ctx.closePath();
  };
  if (solid) fill(build, { color, alpha });
  else stroke(build, { color, alpha, width });
}
function token(x, y, { color = P.ink, alpha = 1, r = 14, hollow = false } = {}) {
  dot(x, y, r, { color, alpha, hollow, width: 3 });
  if (!hollow) ring(x, y, r + 7, { color, alpha: alpha * 0.45, width: 2 });
}
function lock(x, y, { closed = 1, color = P.authority, alpha = 1, size = 1 } = {}) {
  const w = 34 * size, h = 26 * size, lift = (1 - ease(closed)) * 12 * size;
  box(x - w / 2, y - h / 2, w, h, {
    fill: P.row,
    stroke: color,
    alpha,
    radius: 5 * size,
    width: 2.5
  });
  stroke(() => ctx.arc(x, y - h / 2 - lift, w * 0.32, Math.PI, 0), {
    color,
    alpha,
    width: 3 * size
  });
  dot(x, y + 1, 3.5 * size, { color, alpha });
}
function clock(x, y, r, { hand = 0, color = P.ink, alpha = 1 } = {}) {
  ring(x, y, r, { color, alpha, width: 2.5 });
  const a = -Math.PI / 2 + Math.PI * 2 * hand;
  line(x, y, x + r * 0.75 * Math.cos(a), y + r * 0.75 * Math.sin(a), { color, alpha, width: 3 });
  line(x, y, x, y - r * 0.5, { color, alpha: alpha * 0.6, width: 2 });
}
function seal(x, y, r, { color = P.authority, alpha = 1, hollow = false, stamp = alpha } = {}) {
  ring(x, y, r, { color, alpha, width: 3 });
  ring(x, y, r * 0.74, { color, alpha: stamp * 0.6, width: 1.5, dash: hollow ? [5, 5] : null });
  if (!hollow) check(x, y + r * 0.05, r * 0.8, { color, alpha: stamp });
}
function person(x, y, { color = P.ink, alpha = 1, size = 1, solid = true } = {}) {
  const r = 15 * size, fillQ = solid === true ? 1 : solid === false ? 0 : clamp(solid);
  if (fillQ < 1)
    dot(x, y - r * 1.15, r, { color, alpha: alpha * (1 - fillQ), hollow: true, width: 2.5 });
  if (fillQ > 0) dot(x, y - r * 1.15, r, { color, alpha: alpha * fillQ });
  stroke(() => ctx.arc(x, y + r * 1.9, r * 1.55, Math.PI * 1.08, Math.PI * 1.92), {
    color,
    alpha,
    width: 3 * size
  });
}
function agent(x, y, { alpha = 1, size = 1, color = P.evidence } = {}) {
  diamond(x, y, 22 * size, { color, alpha });
  dot(x, y, 4.5 * size, { color, alpha });
}
function documentIcon(x, y, w, h, { alpha = 1, stroke: s = P.ink, rows = 4, fillColor = P.row, fold = true } = {}) {
  if (alpha < 0.01) return;
  const c = Math.min(22, w * 0.2);
  fill(
    () => {
      ctx.moveTo(x, y);
      ctx.lineTo(x + w - c, y);
      ctx.lineTo(x + w, y + c);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
    },
    { color: fillColor, alpha }
  );
  stroke(
    () => {
      ctx.moveTo(x, y);
      ctx.lineTo(x + w - c, y);
      ctx.lineTo(x + w, y + c);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
    },
    { color: s, alpha, width: 2 }
  );
  if (fold)
    stroke(
      () => {
        ctx.moveTo(x + w - c, y);
        ctx.lineTo(x + w - c, y + c);
        ctx.lineTo(x + w, y + c);
      },
      { color: s, alpha, width: 1.5 }
    );
  for (let i = 0; i < rows; i++) {
    const ry = y + h * (0.3 + i * 0.55 / Math.max(1, rows));
    line(x + w * 0.14, ry, x + w * (i % 2 ? 0.62 : 0.82), ry, {
      color: P.muted,
      alpha: alpha * 0.8,
      width: 2
    });
  }
}
function tableIcon(x, y, w, h, { alpha = 1, stroke: s = P.ink, rows = 4, cols = 3 } = {}) {
  if (alpha < 0.01) return;
  box(x, y, w, h, { fill: P.row, stroke: s, alpha, radius: 8 });
  stroke(
    () => {
      for (let r = 1; r < rows; r++) {
        ctx.moveTo(x, y + h * r / rows);
        ctx.lineTo(x + w, y + h * r / rows);
      }
    },
    { color: P.line, alpha, width: 1.5 }
  );
  stroke(
    () => {
      for (let c = 1; c < cols; c++) {
        ctx.moveTo(x + w * c / cols, y);
        ctx.lineTo(x + w * c / cols, y + h);
      }
    },
    { color: P.line, alpha, width: 1.5 }
  );
}
function check(x, y, s, { color = P.evidence, alpha = 1, upto = 1, width = 3.5 } = {}) {
  path(
    [
      [x - s * 0.5, y],
      [x - s * 0.12, y + s * 0.38],
      [x + s * 0.55, y - s * 0.42]
    ],
    { color, alpha, upto, width }
  );
}
function cross(x, y, s, { color = P.unknown, alpha = 1, width = 3.5 } = {}) {
  line(x - s / 2, y - s / 2, x + s / 2, y + s / 2, { color, alpha, width });
  line(x + s / 2, y - s / 2, x - s / 2, y + s / 2, { color, alpha, width });
}
function pill(label, x, y, {
  alpha = 1,
  ink = null,
  color = P.ink,
  border = P.line,
  fillColor = P.row,
  size = LABEL,
  align = "center",
  padX = 18,
  h = null,
  bold = false,
  dash = null,
  dashed = null,
  group = null,
  role = "label"
} = {}) {
  if (alpha < 0.015) return null;
  const w = measure(label, size, bold, role) + padX * 2, height = h ?? size * TYPE + 22;
  const left = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
  box(left, y - height / 2, w, height, { fill: fillColor, alpha, radius: height / 2 });
  if (dashed === null)
    box(left, y - height / 2, w, height, { stroke: border, alpha, radius: height / 2, dash });
  else {
    box(left, y - height / 2, w, height, {
      stroke: border,
      alpha: alpha * (1 - clamp(dashed)),
      radius: height / 2
    });
    box(left, y - height / 2, w, height, {
      stroke: border,
      alpha: alpha * clamp(dashed),
      radius: height / 2,
      dash: dash ?? [6, 6]
    });
  }
  text(label, left + w / 2, y + 1, size, {
    align: "center",
    color,
    alpha: ink ?? alpha,
    bold,
    group,
    role
  });
  return { left, right: left + w, top: y - height / 2, bottom: y + height / 2, width: w };
}

// picture/film/framing/chapters.js
var chapterOrder = film.chapters.map((c) => c.id);
var chapterNumber = (id) => String(chapterOrder.indexOf(id) + 1).padStart(2, "0");
var opensChapter = (s) => {
  const i = film.segments.indexOf(s);
  return i > 0 && film.segments[i - 1].chapter !== s.chapter;
};
var titleY = (s, t) => mix(540, 72, ease(clamp((t - (cardLanding(s) - RISE)) / RISE)));
var clearOfTitle = (s, t, y = 400) => {
  if (!opensChapter(s)) return 1;
  const c = cameraOf(s, t);
  return clamp((c.oy + c.k * (y - c.ay) - 45 - titleY(s, t)) / 60);
};
var cardLanding = (s) => s.voice_start + 0.1;
var RISE = 1.1;
function chapterCard(s, t) {
  if (!opensChapter(s) || t >= cardLanding(s)) return;
  const enter = ramp(t, s.start, 0.3);
  if (enter <= 0) return;
  const chapter = film.chapters.find((c) => c.id === s.chapter), number = chapterNumber(s.chapter);
  const large = en ? 54 : 60, p = clamp((t - (cardLanding(s) - RISE)) / RISE), q = ease(p), size = mix(large, 24, q);
  ctx.save();
  ctx.font = font(24, false, `${number}  ${chapter.title}`);
  const prefix = ctx.measureText(`${number}  `).width;
  ctx.restore();
  const gap = prefix * size / 24, total = gap + measure(chapter.title, size, false, "chapter");
  const left = mix(960 - total / 2, 96, q), y = mix(540, 72, q), ink = mix(1, 0.72, q) * enter;
  text(number, left, y, size, {
    color: blend(P.evidence, P.muted, q),
    alpha: ink,
    role: "chapter"
  });
  text(chapter.title, left + gap, y, size, {
    color: blend(P.ink, P.muted, q),
    alpha: ink,
    role: "chapter"
  });
  line(900, 600, 1020, 600, {
    color: P.line,
    alpha: enter * (1 - ramp(t, cardLanding(s) - RISE, 0.35))
  });
}
function illustrative(alpha) {
  if (alpha < 0.015 || measuring) return;
  ctx.save();
  ctx.setTransform(resolution, 0, 0, resolution, 0, 0);
  pill(L("示意", "Illustrative"), 1824, 74, {
    alpha,
    color: P.muted,
    border: P.line,
    size: 22 * TYPE,
    align: "right",
    padX: 14,
    h: 36,
    role: "marker"
  });
  ctx.restore();
}
function runningHead(s, t) {
  if (t < film.segments[0].voice_start) return;
  const first = film.segments.find((v) => v.chapter === s.chapter);
  const a = 0.72 * (first === film.segments[0] ? ramp(t, first.voice_start, 0.6) : t >= cardLanding(first) ? 1 : 0);
  const chapter = film.chapters.find((c) => c.id === s.chapter);
  text(`${chapterNumber(s.chapter)}  ${chapter.title}`, 96, 72, 24, {
    color: P.muted,
    alpha: a,
    role: "chapter"
  });
}
function partHead(v, t) {
  const parts = film.segments.filter((x2) => x2.chapter === v.chapter);
  if (parts.length < 2) return;
  const a = 0.72 * ramp(t, cardLanding(parts[0]), 0.3);
  if (a <= 0) return;
  const chapter = film.chapters.find((c) => c.id === v.chapter), x = 96 + measure(`${chapterNumber(v.chapter)}  ${chapter.title}`, 24, false, "chapter") + 22;
  line(x, 61, x, 83, { color: P.line, alpha: a });
  text(`${parts.indexOf(v) + 1}  ${v.title}`, x + 22, 72, 24, {
    color: P.muted,
    alpha: a,
    role: "chapter"
  });
}

// picture/film/framing/measuring.js
function measuringContext() {
  let m = [1, 0, 0, 1, 0, 0], path2 = [], last = [0, 0];
  const stack2 = [], marks = { strong: null, seen: null };
  const keys = [
    "globalAlpha",
    "strokeStyle",
    "fillStyle",
    "lineWidth",
    "lineCap",
    "lineJoin",
    "font",
    "textAlign",
    "textBaseline",
    "letterSpacing"
  ];
  const tx = (x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  const by = (b) => {
    const a = m;
    m = [
      a[0] * b[0] + a[2] * b[1],
      a[1] * b[0] + a[3] * b[1],
      a[0] * b[2] + a[2] * b[3],
      a[1] * b[2] + a[3] * b[3],
      a[0] * b[4] + a[2] * b[5] + a[4],
      a[1] * b[4] + a[3] * b[5] + a[5]
    ];
  };
  const add = (key, [x, y]) => {
    const e = marks[key] ?? (marks[key] = [x, y, x, y]);
    e[0] = Math.min(e[0], x);
    e[1] = Math.min(e[1], y);
    e[2] = Math.max(e[2], x);
    e[3] = Math.max(e[3], y);
  };
  const sizeOf = () => Number(/(\d+(?:\.\d+)?)px/.exec(meter.font)?.[1] ?? 30);
  const widthOf = (v) => [...v].reduce(
    (w, ch) => w + (/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/u.test(ch) ? 1.02 : /[A-Z]/.test(ch) ? 0.72 : 0.6),
    0
  ) * sizeOf();
  function paint(color, points) {
    if (meter.globalAlpha <= 0.15) return;
    const strong = contrastOf(color, meter.globalAlpha) >= 3;
    for (const point of points) {
      add("seen", point);
      if (strong) add("strong", point);
    }
  }
  function arcPoints(x, y, rx, ry, a0, a1) {
    const n = Math.max(4, Math.ceil(Math.abs(a1 - a0) / (Math.PI / 12)));
    for (let i = 0; i <= n; i++) {
      const a = a0 + (a1 - a0) * i / n;
      path2.push(tx(x + rx * Math.cos(a), y + ry * Math.sin(a)));
    }
    last = [x + rx * Math.cos(a1), y + ry * Math.sin(a1)];
  }
  const meter = {
    marks,
    globalAlpha: 1,
    strokeStyle: "#000000",
    fillStyle: "#000000",
    lineWidth: 1,
    lineCap: "butt",
    lineJoin: "miter",
    font: "30px Film",
    textAlign: "left",
    textBaseline: "middle",
    letterSpacing: "0px",
    save() {
      stack2.push([m, keys.map((k) => meter[k])]);
    },
    restore() {
      const [saved, values] = stack2.pop();
      m = saved;
      keys.forEach((k, i) => {
        meter[k] = values[i];
      });
    },
    setTransform(a, b, c, d, e, f) {
      m = [a, b, c, d, e, f];
    },
    getTransform() {
      return { a: m[0], b: m[1], c: m[2], d: m[3], e: m[4], f: m[5] };
    },
    translate(x, y) {
      by([1, 0, 0, 1, x, y]);
    },
    scale(x, y) {
      by([x, 0, 0, y, 0, 0]);
    },
    setLineDash() {
    },
    fillRect() {
    },
    beginPath() {
      path2 = [];
    },
    closePath() {
    },
    moveTo(x, y) {
      path2.push(tx(x, y));
      last = [x, y];
    },
    lineTo(x, y) {
      path2.push(tx(x, y));
      last = [x, y];
    },
    arc(x, y, r, a0, a1) {
      arcPoints(x, y, r, r, a0, a1);
    },
    ellipse(x, y, rx, ry, rotation, a0, a1) {
      arcPoints(x, y, rx, ry, a0, a1);
    },
    quadraticCurveTo(cx, cy, x, y) {
      const [x0, y0] = last;
      for (let i = 1; i <= 8; i++) {
        const q = i / 8, u = 1 - q;
        path2.push(
          tx(u * u * x0 + 2 * u * q * cx + q * q * x, u * u * y0 + 2 * u * q * cy + q * q * y)
        );
      }
      last = [x, y];
    },
    roundRect(x, y, w, h) {
      path2.push(tx(x, y), tx(x + w, y), tx(x + w, y + h), tx(x, y + h));
      last = [x, y];
    },
    stroke() {
      paint(meter.strokeStyle, path2);
    },
    fill() {
      paint(meter.fillStyle, path2);
    },
    measureText(v) {
      const size = sizeOf(), width = widthOf(v), left = meter.textAlign === "center" ? width / 2 : meter.textAlign === "right" ? width : 0;
      const ascent = meter.textBaseline === "top" ? 0 : meter.textBaseline === "middle" ? size * 0.52 : size * 0.8;
      const descent = meter.textBaseline === "top" ? size * 1.05 : meter.textBaseline === "middle" ? size * 0.52 : size * 0.22;
      return {
        width,
        actualBoundingBoxLeft: left,
        actualBoundingBoxRight: width - left,
        actualBoundingBoxAscent: ascent,
        actualBoundingBoxDescent: descent
      };
    },
    fillText(v, x, y) {
      const b = meter.measureText(v);
      paint(meter.fillStyle, [
        tx(x - b.actualBoundingBoxLeft, y - b.actualBoundingBoxAscent),
        tx(x + b.actualBoundingBoxRight, y + b.actualBoundingBoxDescent)
      ]);
    }
  };
  return meter;
}

// picture/film/framing/titles.js
var LEFT = 260;
var RIGHT = 1624;
var RULE = 652;
var WORDMARK = { size: 300, baseline: 534, tracking: -4 };
var TITLE = { zh: { size: 50, first: 743, step: 75 }, en: { size: 42, first: 736, step: 63 } };
var AUTHOR = "Yang HENG";
var AUTHOR_SIZE = 34;
var NOTE_SIZE = 24;
var NOTE_STEP = 54;
function inkOf(v, size, bold = false, tracking = 0) {
  ctx.save();
  ctx.font = font(size, bold, v);
  ctx.letterSpacing = `${tracking}px`;
  ctx.textAlign = "left";
  const m = ctx.measureText(v);
  ctx.restore();
  return { left: -m.actualBoundingBoxLeft, right: m.actualBoundingBoxRight };
}
function titled(v, x, y, size, { end = false, bold = false, tracking = 0, ...o } = {}) {
  const ink = inkOf(v, size, bold, tracking);
  text(v, x - (end ? ink.right : ink.left), y, size, {
    ...o,
    bold,
    tracking,
    baseline: "alphabetic",
    role: "title"
  });
}
function titleSignature(alpha, signed = alpha) {
  const lines = L(
    ["数据部门工作指南", "精华版"],
    ["Data Department Work Guidelines", "The Essentials"]
  ), { size, first, step } = en ? TITLE.en : TITLE.zh, last = first + step * (lines.length - 1);
  titled("DDWG", LEFT, WORDMARK.baseline, WORDMARK.size, {
    bold: true,
    tracking: WORDMARK.tracking,
    alpha
  });
  line(LEFT, RULE, RIGHT, RULE, { color: P.line, width: 1, alpha, cap: "butt" });
  lines.forEach((v, i) => titled(v, LEFT, first + i * step, size, { alpha }));
  titled(AUTHOR, RIGHT, last, AUTHOR_SIZE, { end: true, alpha: signed });
  return last;
}
function credits(t) {
  const start = film.duration - film.credits_duration;
  const last = titleSignature(ramp(t, start, 0.5), ramp(t, start + 0.2, 0.5));
  titled(L("旁白为合成语音", "Narration: synthetic voice"), RIGHT, last + NOTE_STEP, NOTE_SIZE, {
    end: true,
    color: P.muted,
    alpha: ramp(t, start + 0.1, 0.35)
  });
}

// picture/film/drawing/links.js
function rounded(corners, r) {
  const out = [corners[0]];
  for (let i = 1; i < corners.length - 1; i++) {
    const [ax, ay] = corners[i - 1], [bx, by] = corners[i], [cx2, cy2] = corners[i + 1];
    const d1 = Math.hypot(bx - ax, by - ay), d2 = Math.hypot(cx2 - bx, cy2 - by);
    if (d1 < 1e-6 || d2 < 1e-6) continue;
    const k = Math.min(r, d1 / 2, d2 / 2), p = [bx - (bx - ax) / d1 * k, by - (by - ay) / d1 * k], q = [bx + (cx2 - bx) / d2 * k, by + (cy2 - by) / d2 * k];
    for (let n = 0; n <= 6; n++) {
      const u = n / 6;
      out.push([
        (1 - u) ** 2 * p[0] + 2 * (1 - u) * u * bx + u * u * q[0],
        (1 - u) ** 2 * p[1] + 2 * (1 - u) * u * by + u * u * q[1]
      ]);
    }
  }
  out.push(corners.at(-1));
  return out;
}
function along(points, q) {
  const lengths = points.slice(1).map((pt, i) => Math.hypot(pt[0] - points[i][0], pt[1] - points[i][1])), total = lengths.reduce((a, b) => a + b, 0);
  let left = clamp(q) * total;
  const kept = [points[0]];
  for (let i = 0; i < lengths.length; i++) {
    if (left >= lengths[i]) {
      kept.push(points[i + 1]);
      left -= lengths[i];
      continue;
    }
    const f = lengths[i] ? left / lengths[i] : 0, a = points[i], b = points[i + 1];
    kept.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
    break;
  }
  return { point: kept.at(-1), kept };
}
function link(x1, y1, x2, y2, {
  route = null,
  mid = null,
  r = 14,
  color = P.line,
  alpha = 1,
  upto = 1,
  width = 2,
  dash = null,
  flow = null,
  end = true
} = {}) {
  if (alpha < 0.01 || upto <= 0 || Math.hypot(x2 - x1, y2 - y1) < 1) return;
  const kind = route ?? (Math.abs(x1 - x2) < 0.5 || Math.abs(y1 - y2) < 0.5 ? "straight" : "vhv");
  const m = mid ?? (kind === "vhv" ? (y1 + y2) / 2 : (x1 + x2) / 2);
  const corners = {
    straight: [
      [x1, y1],
      [x2, y2]
    ],
    vhv: [
      [x1, y1],
      [x1, m],
      [x2, m],
      [x2, y2]
    ],
    hvh: [
      [x1, y1],
      [m, y1],
      [m, y2],
      [x2, y2]
    ],
    vh: [
      [x1, y1],
      [x1, y2],
      [x2, y2]
    ],
    hv: [
      [x1, y1],
      [x2, y1],
      [x2, y2]
    ]
  }[kind];
  const points = rounded(corners, r), drawn = along(points, upto).kept;
  if (drawn.length > 1)
    stroke(() => drawn.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)), {
      color,
      alpha,
      width,
      dash
    });
  if (end) dot(x2, y2, width + 2.5, { color, alpha: alpha * clamp((upto - 0.9) / 0.1) });
  if (flow !== null && flow < upto) {
    const [px, py] = along(points, flow).point;
    flowDot(px, py, width + 2, flow, { color, alpha });
  }
}

// picture/film/naming/names.js
var NAME_GAP = 22;
var LEADING = 1.3;
var NAME_JOINT = /[、，。；：,]$/u;
var CLAUSE_JOINT = /[，。；：,]$/u;
function wrapName(v, width, size = LABEL) {
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v.includes("\n")) return v.split("\n");
  if (!Number.isFinite(width) || measure(v, size) <= width) return [v];
  const latin = !/[\u4e00-\u9fff]/u.test(v), tokens = latin ? v.split(/(?<= )/) : [...v], splits = [];
  for (let k = 1; k < tokens.length; k++) {
    const a = tokens.slice(0, k).join("").trimEnd(), b = tokens.slice(k).join("").trimStart();
    if (!a || !b || /^[、，。；：）”]/u.test(b)) continue;
    splits.push({
      a,
      b,
      joint: !latin && NAME_JOINT.test(a),
      worst: Math.max(measure(a, size), measure(b, size))
    });
  }
  const joints = splits.filter((s) => s.joint), fitting = joints.filter((s) => s.worst <= width);
  const clauses = fitting.filter((s) => CLAUSE_JOINT.test(s.a));
  const pool = clauses.length ? clauses : fitting.length ? fitting : joints.length ? joints : splits;
  if (!pool.length) return [v];
  const best = pool.reduce((x, s) => s.worst < x.worst ? s : x);
  if (best.worst <= width || tokens.length < 3) return [best.a, best.b];
  const [head, ...rest] = wrapName(best.a, width, size);
  return [head, ...wrapName([...rest, best.b].join(latin ? " " : ""), width, size)];
}
var hangOf = (line2, align, em) => /[、，。；：！？]$/u.test(line2) ? (align === "right" ? 0.5 : align === "center" ? 0.3 : 0) * em : 0;
function nameText(v, x, y, { width = Infinity, size = LABEL, valign = "middle", align = "center", ...o } = {}) {
  const lines = Array.isArray(v) ? v : wrapName(v, width, size), em = labelSize(size), step = em * LEADING;
  const top = valign === "top" ? y + em / 2 : valign === "bottom" ? y - em / 2 - step * (lines.length - 1) : y - step * (lines.length - 1) / 2;
  lines.forEach(
    (line2, k) => text(line2, x + hangOf(line2, align, em), top + k * step, size, {
      align,
      ...o,
      whole: lines.join(" ")
    })
  );
  return { lines, top: top - em / 2, bottom: top + step * (lines.length - 1) + em / 2 };
}
var lineCaches = /* @__PURE__ */ new WeakMap();
function growLines(parts, width = Infinity, size = LABEL) {
  const cache = lineCaches.get(ctx) ?? /* @__PURE__ */ new Map(), key = JSON.stringify([String(width), size, parts]);
  lineCaches.set(ctx, cache);
  if (cache.has(key)) return cache.get(key);
  const greedy = [[]];
  parts.forEach((part, k) => {
    const line2 = greedy.at(-1);
    if (line2.length && measure([...line2.map((j) => parts[j]), part].join(""), size) > width)
      greedy.push([k]);
    else line2.push(k);
  });
  let lines = greedy;
  const n = greedy.length, span = (a, b) => measure(parts.slice(a, b).join(""), size);
  const widths = greedy.map((line2) => span(line2[0], line2.at(-1) + 1));
  if (n > 1 && parts.length <= 16 && widths.at(-1) < 0.4 * Math.max(...widths)) {
    let best = null;
    const search = (left, cuts) => {
      const from = cuts.at(-1) ?? 0;
      if (left === 1) {
        const ends = [...cuts, parts.length], starts = [0, ...cuts], widths2 = ends.map((end, i) => span(starts[i], end));
        if (!widths2.every((w, i) => w <= width || ends[i] - starts[i] === 1)) return;
        const worst = Math.max(...widths2), spread = widths2.reduce((sum, v) => sum + v * v, 0);
        if (!best || worst < best.worst - 0.5 || Math.abs(worst - best.worst) <= 0.5 && spread < best.spread)
          best = { starts, ends, worst, spread };
        return;
      }
      for (let cut = from + 1; cut <= parts.length - left + 1; cut++)
        search(left - 1, [...cuts, cut]);
    };
    search(n, []);
    if (best)
      lines = best.ends.map(
        (end, i) => Array.from({ length: end - best.starts[i] }, (_, j) => best.starts[i] + j)
      );
  }
  cache.set(key, lines);
  return lines;
}
var blockHeight = (lines, size = LABEL) => labelSize(size) * (1 + LEADING * (lines - 1));
function growTexts(parts, width = Infinity, size = LABEL) {
  const lines = growLines(parts, width, size).map((line2) => line2.map((k) => [k, parts[k]]));
  lines.forEach((line2, r) => {
    const [k, v] = line2[0], lead = r ? v.match(/^[、，,;；\s]+/u)?.[0] ?? "" : "";
    if (!lead) return;
    line2[0] = [k, v.slice(lead.length)];
    const mark = lead.replace(/\s+/gu, "");
    if (mark) lines[r - 1].push([k, mark]);
  });
  return lines;
}
function growName(t, parts, ats, x, y, {
  width = Infinity,
  size = LABEL,
  valign = "top",
  alpha = 1,
  build = false,
  align = "left",
  ...o
} = {}) {
  const em = labelSize(size), step = em * LEADING, lines = growTexts(parts, width, size);
  const top = valign === "top" ? y + em / 2 : valign === "bottom" ? y - em / 2 - step * (lines.length - 1) : y - step * (lines.length - 1) / 2;
  lines.forEach((line2, r) => {
    const span = line2.reduce((w, [, v]) => w + measure(v, size), 0);
    let left = (align === "center" ? x - span / 2 : align === "right" ? x - span : x) + hangOf(line2.map(([, v]) => v).join(""), align, em);
    line2.forEach(([k, v]) => {
      const at2 = build ? ats[k] ?? ats[0] : ats[0];
      text(v, left, top + r * step, size, {
        align: "left",
        ...o,
        alpha: alpha * ramp(t, at2 - 0.15, 0.4),
        whole: o.whole ?? parts.join("")
      });
      left += measure(v, size);
    });
  });
  return {
    lines: lines.length,
    top: top - em / 2,
    bottom: top + step * (lines.length - 1) + em / 2
  };
}
var NOTE = 22;
var TERM_GAP = 16;
var TERM_STACK = 10;
function termRowLayout(term, qual, width = Infinity, inline = null) {
  const one = !qual.length || (inline ?? measure(term.join(""), LABEL) + TERM_GAP + measure(qual.join(""), NOTE) <= width);
  const head = blockHeight(growLines(term, width).length);
  return {
    one,
    height: one ? head : head + TERM_STACK + blockHeight(growLines(qual, width, NOTE).length, NOTE)
  };
}
function termRow(t, term, termAts, qual, qualAts, x, y, {
  width = Infinity,
  alpha = 1,
  color = P.ink,
  set = null,
  build = false,
  inline = null,
  align = "left",
  qualLeft = null,
  noteWidth: noteWidth2 = width,
  buildTerm = false
} = {}) {
  const whole = [...term, ...qual].join(" "), { one } = termRowLayout(term, qual, width, inline ?? (align === "left" ? null : false)), shared = one && qual.length, span = measure(term.join(""), LABEL) + TERM_GAP + measure(qual.join(""), NOTE), left = shared ? align === "center" ? x - span / 2 : align === "right" ? x - span : x : x, head = growName(t, term, termAts, left, y, {
    width,
    alpha,
    color,
    whole,
    set,
    build: buildTerm,
    align: shared ? "left" : align
  });
  if (!qual.length) return head;
  const after = qualLeft !== null && align === "left" ? qualLeft : left + measure(term.join(""), LABEL) + TERM_GAP;
  const tail = growName(
    t,
    qual,
    qualAts,
    one ? after : x,
    one ? head.top + (labelSize(LABEL) - labelSize(NOTE)) / 2 : head.bottom + TERM_STACK,
    {
      size: NOTE,
      alpha,
      color: P.muted,
      width: one ? Infinity : noteWidth2,
      whole,
      set,
      build,
      align: one ? "left" : align
    }
  );
  return { top: head.top, bottom: Math.max(head.bottom, tail.bottom) };
}
function rejectedName(v, x, y, {
  alpha = 1,
  mark = 1,
  size = LABEL,
  align = "center",
  valign = "middle",
  width = Infinity,
  set = null,
  markLeft = null
} = {}) {
  const s = Math.min(26, labelSize(size) * 0.9), at2 = align === "center" && markLeft === null ? x - (16 + s) / 2 : x;
  const block = nameText(v, at2, y, {
    align,
    valign,
    width,
    size,
    color: P.muted,
    alpha: Math.min(alpha, mix(1, 0.7, clamp(mark))),
    set
  });
  const w = Math.max(...block.lines.map((line2) => measure(line2, size))), left = align === "left" ? at2 : align === "right" ? at2 - w : at2 - w / 2, markAt = markLeft ?? left + w + 16;
  cross(markAt + s / 2, (block.top + block.bottom) / 2, s, {
    alpha: alpha * mark,
    width: 3
  });
  return { ...block, left, right: markAt + s };
}

// picture/film/drawing/timeline.js
var HOUR = 180;
var HOURS = [-2, 4];
var LATE_BY = 2;
var TICK = 7;
var RAIL = 3.5;
var MARK = 7;
var CARD = [150, 110];
var STEM = 36;
var LANDING = 14;
var SPAN = 44;
var SPAN_TICK = 10;
var SPAN_WIDTH = 3;
var DUE_TICK = 9;
var NIGHT_POINT = 4.5;
function geometry(x, y, scale, hours, lateBy) {
  const hour = HOUR * scale, at2 = (h) => x + (h - LATE_BY / 2) * hour, [cw, ch] = CARD.map((v) => v * scale), stem = STEM * scale, above = (h) => ({
    left: at2(h) - cw / 2,
    top: y - stem - ch,
    right: at2(h) + cw / 2,
    bottom: y - stem
  }), span = y + Math.max(40, SPAN * scale);
  return {
    x,
    y,
    scale,
    hour,
    at: at2,
    above,
    left: at2(hours[0]),
    right: at2(hours[1]),
    due: at2(0),
    arrival: at2(lateBy),
    tick: Math.max(4, TICK * scale),
    rail: Math.max(2.5, RAIL * scale),
    mark: Math.max(5.5, MARK * scale),
    card: above(lateBy),
    span: {
      y: span,
      tick: Math.max(6, SPAN_TICK * scale),
      width: Math.max(2.5, SPAN_WIDTH * scale),
      left: at2(0),
      right: at2(lateBy)
    }
  };
}
var SIDES = { axis: "top", due: "top", arrival: "top", card: "top", late: "bottom" };
function anchor(g, slot, side, { measured = true, lift = 0 } = {}) {
  const over = g.y - g.tick - NAME_GAP, card = { ...g.card, top: g.card.top - lift, bottom: g.card.bottom - lift }, s = g.span, middle = (s.left + s.right) / 2;
  const places = {
    "axis:top": [g.left, over, "left", "bottom"],
    "axis:left": [g.left - g.rail / 2 - NAME_GAP, g.y, "right", "middle"],
    "due:top": [g.due, over, "center", "bottom"],
    "due:left": [s.left - s.width / 2 - NAME_GAP, s.y, "right", "middle"],
    "arrival:top": [g.arrival, over, "center", "bottom"],
    "arrival:right": [s.right + s.width / 2 + NAME_GAP, s.y, "left", "middle"],
    "card:top": [(card.left + card.right) / 2, card.top - NAME_GAP, "center", "bottom"],
    "card:right": [card.right + NAME_GAP, (card.top + card.bottom) / 2, "left", "middle"],
    "late:top": [middle, over, "center", "bottom"],
    "late:bottom": measured ? [middle, s.y + s.tick + NAME_GAP, "center", "top"] : [middle, g.y + g.rail + NAME_GAP, "center", "top"]
  };
  const place = places[`${slot}:${side}`];
  if (!place) throw Error(`The timeline has no place for its ${slot} name at the ${side}`);
  return place;
}
function nameBox(v, [x, y, align, valign], { size = LABEL, width = Infinity } = {}) {
  const lines = wrapName(v, width, size), w = Math.max(...lines.map((v2) => measure(v2, size))), h = labelSize(size) * (1 + LEADING * (lines.length - 1)), left = align === "left" ? x : align === "right" ? x - w : x - w / 2, top = valign === "top" ? y : valign === "bottom" ? y - h : y - h / 2;
  return { left, top, right: left + w, bottom: top + h };
}
var partOf = (v) => typeof v === "number" ? { upto: v, alpha: 1, dash: false } : { upto: 1, alpha: 1, dash: false, ...v };
var nameOf = (v) => typeof v === "string" || Array.isArray(v) ? { v } : v;
var union = (boxes) => boxes.length ? {
  left: Math.min(...boxes.map((b) => b.left)),
  top: Math.min(...boxes.map((b) => b.top)),
  right: Math.max(...boxes.map((b) => b.right)),
  bottom: Math.max(...boxes.map((b) => b.bottom))
} : { left: 0, top: 0, right: 0, bottom: 0 };
function lastNight(x, y, scale = 1, {
  axis = 1,
  card = 0,
  arrival = null,
  late = 0,
  due = 0,
  lit = 0,
  flow = null,
  alpha = 1,
  hours = HOURS,
  lateBy = LATE_BY,
  names = {}
} = {}) {
  const g = geometry(x, y, scale, hours, lateBy), placed = {};
  const [A5, C4, S2, D3, H] = [axis, card, late, due, lit].map(partOf), settle = ease(clamp(C4.upto / 0.6)), lift = LANDING * scale * (1 - settle), reach = clamp((C4.upto - 0.4) / 0.6), R2 = partOf(
    arrival ?? (C4.upto > 0 ? { upto: clamp((reach - 0.85) / 0.15), alpha: C4.alpha } : 0)
  );
  if (A5.upto > 0) {
    const end = mix(g.left, g.right, clamp(A5.upto));
    stroke(
      () => {
        ctx.moveTo(g.left, y);
        ctx.lineTo(end, y);
        for (let h = Math.ceil(hours[0]); h <= hours[1] && g.at(h) <= end + 0.5; h++) {
          ctx.moveTo(g.at(h), y - g.tick);
          ctx.lineTo(g.at(h), y + g.tick);
        }
      },
      { color: P.line, alpha: alpha * A5.alpha, width: g.rail }
    );
  }
  if (H.upto > 0)
    line(g.due, y, mix(g.due, g.arrival, clamp(H.upto)), y, {
      color: P.unknown,
      alpha: alpha * H.alpha,
      width: g.rail * 2,
      dash: H.dash ? [10, 9] : null
    });
  if (S2.upto > 0) {
    const { y: sy, tick, width, left, right } = g.span, o = { color: P.unknown, alpha: alpha * S2.alpha, width }, grown = tick * clamp((S2.upto - 0.85) / 0.15);
    stroke(() => {
      ctx.moveTo(left, sy - tick);
      ctx.lineTo(left, sy + tick);
      if (grown > 0.5) {
        ctx.moveTo(right, sy - grown);
        ctx.lineTo(right, sy + grown);
      }
    }, o);
    line(left, sy, mix(left, right, clamp(S2.upto)), sy, { ...o, dash: S2.dash ? [8, 8] : null });
  }
  if (C4.upto > 0) {
    const a = alpha * C4.alpha;
    tableIcon(
      g.card.left,
      g.card.top - lift,
      g.card.right - g.card.left,
      g.card.bottom - g.card.top,
      { alpha: a * clamp(C4.upto / 0.4) }
    );
    if (reach > 0)
      line(g.arrival, g.card.bottom, g.arrival, mix(g.card.bottom, y, reach), {
        color: P.line,
        alpha: a,
        width: 2
      });
  }
  if (D3.upto > 0) {
    const a = alpha * D3.alpha * clamp(D3.upto);
    dot(g.due, y, g.mark, { color: P.ground, alpha: a });
    ring(g.due, y, g.mark, { color: P.ink, alpha: a, width: 2.5 });
  }
  if (R2.upto > 0)
    dot(g.arrival, y, g.mark, { color: P.ink, alpha: alpha * R2.alpha * clamp(R2.upto) });
  if (flow !== null && A5.upto >= 1)
    flowDot(mix(g.arrival, g.right, flow), y, Math.max(3, 4 * scale), flow, {
      color: P.ink,
      alpha: alpha * A5.alpha
    });
  for (const slot of Object.keys(SIDES)) {
    const n = nameOf(names[slot]);
    if (!n?.v) continue;
    const { v, alpha: shown = 1, side = SIDES[slot], ...o } = n, place = anchor(g, slot, side, { measured: S2.upto > 0, lift });
    placed[slot] = nameBox(v, place, o);
    nameText(v, place[0], place[1], {
      ...o,
      align: place[2],
      valign: place[3],
      alpha: alpha * shown
    });
  }
  return { ...g, names: placed };
}
function lastNightExtent(scale = 1, {
  axis = 1,
  card = 0,
  arrival = null,
  late = 0,
  due = 0,
  lit = 0,
  hours = HOURS,
  lateBy = LATE_BY,
  names = {}
} = {}) {
  const g = geometry(0, 0, scale, hours, lateBy), on = (v) => partOf(v).upto > 0, disc = (x, r) => ({ left: x - r, top: -r, right: x + r, bottom: r }), boxes = [];
  if (on(axis))
    boxes.push({
      left: g.left - g.rail / 2,
      top: -g.tick - g.rail / 2,
      right: g.right + g.rail / 2,
      bottom: g.tick + g.rail / 2
    });
  if (on(lit))
    boxes.push({ left: g.due - g.rail, top: -g.rail, right: g.arrival + g.rail, bottom: g.rail });
  if (on(due)) boxes.push(disc(g.due, g.mark + 1.25));
  if (on(arrival ?? card)) boxes.push(disc(g.arrival, g.mark));
  if (on(card)) boxes.push({ ...g.card });
  if (on(late)) {
    const { y, tick, width, left, right } = g.span;
    boxes.push({
      left: left - width / 2,
      top: y - tick - width / 2,
      right: right + width / 2,
      bottom: y + tick + width / 2
    });
  }
  for (const slot of Object.keys(SIDES)) {
    const n = nameOf(names[slot]);
    if (!n?.v) continue;
    const { v, side = SIDES[slot], ...o } = n;
    boxes.push(nameBox(v, anchor(g, slot, side, { measured: on(late) }), o));
  }
  return union(boxes);
}
function nights(xs, y, scale = 0.3, { axis = 1, arrival = 0, lit = 0, alpha = 1, hours = [-1, 3], lateBy = [] } = {}) {
  const late = (i) => lateBy[i] ?? 0, gs = xs.map((x, i) => geometry(x, y, scale, hours, late(i)));
  const [A5, R2, H] = [axis, arrival, lit].map(partOf);
  if (alpha < 0.01 || !gs.length) return gs;
  if (A5.upto > 0)
    stroke(
      () => gs.forEach((g) => {
        const end = mix(g.left, g.right, clamp(A5.upto));
        ctx.moveTo(g.left, y);
        ctx.lineTo(end, y);
        if (g.due <= end + 0.5) {
          ctx.moveTo(g.due, y - DUE_TICK);
          ctx.lineTo(g.due, y + DUE_TICK);
        }
      }),
      { color: P.line, alpha: alpha * A5.alpha, width: gs[0].rail }
    );
  const delayed = gs.filter((_, i) => late(i) > 0);
  if (H.upto > 0 && delayed.length)
    stroke(
      () => delayed.forEach((g) => {
        ctx.moveTo(g.due, y);
        ctx.lineTo(mix(g.due, g.arrival, clamp(H.upto)), y);
      }),
      {
        color: P.unknown,
        alpha: alpha * H.alpha,
        width: gs[0].rail * 2,
        dash: H.dash ? [10, 9] : null
      }
    );
  if (R2.upto > 0)
    gs.forEach((g, i) => {
      if (lateBy[i] !== null)
        dot(g.arrival, y, NIGHT_POINT, { color: P.ink, alpha: alpha * R2.alpha * clamp(R2.upto) });
    });
  return gs;
}

// picture/film/timing/stages.js
var STAGE_CUT = 0.18;
var stageCuts = /* @__PURE__ */ new Map();
var declareCut = (at2) => {
  const id = layout.scene;
  if (id === null) return;
  const v = stageCuts.get(id) ?? /* @__PURE__ */ new Set();
  v.add(at2);
  stageCuts.set(id, v);
};
var stageOut = (t, word) => {
  declareCut(word + STAGE_CUT);
  return t < word + STAGE_CUT ? 1 : 0;
};
var stageIn = (t, word) => {
  declareCut(word + STAGE_CUT);
  return t < word + STAGE_CUT ? 0 : 1;
};

// picture/film/naming/lists.js
var named = (t, at2) => ramp(t, at2 - 0.15, 0.4);
var SECOND = 0.58;
var listLevel = (t, ats, i, until = Infinity) => {
  const last = ats.at(-1), said = pauseHold(Math.max(last + 1.5, (phraseEnd.get(last) ?? last) + 0.3), 0.4);
  const cut = Math.min(
    ...[...stageCuts.get(layout.scene) ?? []].filter((c) => c > last && c < thoughtEnd(last))
  );
  const end = Math.min(thoughtEnd(last), cut);
  const done = Math.min(said, Math.max(last - 0.1, end - 0.45)), back = Math.min(0.4, Math.max(0.15, end - 0.05 - done));
  const dims = i + 1 < ats.length && done - ats[i + 1] > 0.6;
  const level = i + 1 < ats.length ? mix(
    mix(1, SECOND, dims ? ramp(t, pauseHold(ats[i + 1] - 0.15, 0.3), 0.3) : 0),
    1,
    ramp(t, done, back)
  ) : 1;
  return level * (1 - ramp(t, pauseHold(until, 0.4), 0.4));
};
var listIn = (t, ats, i, until = Infinity) => ramp(t, ats[i] - 0.15, 0.4) * listLevel(t, ats, i, until);
var speaking = (t, ats, i) => {
  const until = i + 1 < ats.length ? ats[i + 1] - 0.15 : pauseHold(Math.max(ats[i] + 1.5, (phraseEnd.get(ats[i]) ?? ats[i]) + 0.3), 0.3);
  return ramp(t, ats[i] - 0.15, 0.3) * (1 - ramp(t, until, 0.3));
};
function beats(t, x, y, r, ats, { color = P.ink, alpha = 1 } = {}) {
  const flash = Math.max(
    0,
    ...ats.map((at2) => {
      const p = clamp((t - at2 - 0.05) / 0.5);
      return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0;
    })
  );
  if (flash > 0) ring(x, y, r, { color, alpha: alpha * flash * 0.5, width: 3.5 });
}

// picture/film/scenes/p01/failures.js
function people(xs, y, { size = 0.6, alpha = 1, color = P.ink, absent = false } = {}) {
  if (alpha < 0.01 || !xs.length) return;
  const r = 15 * size, heads = () => xs.forEach((x) => {
    ctx.moveTo(x + r, y - r * 1.15);
    ctx.arc(x, y - r * 1.15, r, 0, Math.PI * 2);
  });
  if (absent) stroke(heads, { color, alpha, width: 2.5, dash: [4, 4] });
  else fill(heads, { color, alpha });
  stroke(
    () => xs.forEach((x) => {
      const a0 = Math.PI * 1.08;
      ctx.moveTo(x + r * 1.55 * Math.cos(a0), y + r * 1.9 + r * 1.55 * Math.sin(a0));
      ctx.arc(x, y + r * 1.9, r * 1.55, a0, Math.PI * 1.92);
    }),
    { color, alpha, width: 3 * size + 0.5, dash: absent ? [5, 4] : null }
  );
}
function openMark(x, y, r, { alpha = 1, turn = 0 } = {}) {
  if (alpha < 0.01) return;
  dot(x, y, r, { color: P.ground, alpha });
  ring(x, y, r, {
    color: P.unknown,
    alpha,
    width: 3,
    dash: [6, 5],
    start: -Math.PI / 2 + turn
  });
  text("?", x, y + 1, r * 1.05, { role: "mark", align: "center", color: P.unknown, alpha });
}
function forkMark(cx, cy, { alpha = 1, facts = 0, run = null } = {}) {
  if (alpha < 0.01) return;
  const y = cy + 28, fx = cx - 58, branch = forkBranch(fx, y);
  line(cx - 124, y, cx + 66, y, { color: P.line, alpha, width: 3 });
  stroke(() => branch.forEach(([x, py], i) => i ? ctx.lineTo(x, py) : ctx.moveTo(x, py)), {
    color: P.authority,
    alpha,
    width: 3.5
  });
  dot(...branch.at(-1), 6, { color: P.authority, alpha });
  dot(fx, y, 5, { color: P.ink, alpha });
  if (run !== null) flowDot(...along(branch, run).point, 5, run, { color: P.authority, alpha });
  openMark(cx + 88, y, 21, { alpha: alpha * facts });
}
function forkBranch(fx, y) {
  const quad = (a, c, b) => Array.from({ length: 9 }, (_, i) => {
    const q = i / 8, u = 1 - q;
    return [u * u * a[0] + 2 * u * q * c[0] + q * q * b[0], u * u * a[1] + 2 * u * q * c[1] + q * q * b[1]];
  });
  return [
    [fx, y],
    ...quad([fx + 16, y], [fx + 40, y], [fx + 40, y - 24]),
    ...quad([fx + 40, y - 24], [fx + 40, y - 48], [fx + 64, y - 48]).slice(1),
    [fx + 98, y - 48]
  ];
}
function patchMark(cx, cy, { alpha = 1, drip = null, again = 0, light = 0 } = {}) {
  if (alpha < 0.01) return;
  const py = cy - 18;
  stroke(
    () => {
      ctx.moveTo(cx - 124, py);
      ctx.lineTo(cx - 15, py);
      ctx.moveTo(cx + 15, py + 7);
      ctx.lineTo(cx + 124, py + 7);
    },
    { color: P.ink, alpha, width: 7, cap: "butt" }
  );
  box(cx - 44, cy + 34, 88, 18, { fill: P.row, stroke: P.ink, alpha, radius: 6, width: 2.5 });
  stroke(
    () => {
      ctx.moveTo(cx - 36, py + 4);
      ctx.lineTo(cx - 36, cy + 34);
      ctx.moveTo(cx + 36, py + 11);
      ctx.lineTo(cx + 36, cy + 34);
    },
    { color: P.line, alpha, width: 2 }
  );
  if (drip !== null) flowDot(cx, mix(py + 10, cy + 30, drip), 5, drip, { color: P.ink, alpha });
  if (again > 0.01 && drip !== null) {
    const q = (drip + 0.5) % 1;
    flowDot(cx + 58, mix(cy + 20, cy + 76, q), 5, q, { color: P.ink, alpha: alpha * again });
  }
  if (light > 0.01) ring(cx, py + 3, 27, { color: P.unknown, alpha: alpha * light, width: 3 });
}
function meetingMark(cx, cy, { alpha = 1, seats = [0, 0], beat = [0, 0, 0] } = {}) {
  if (alpha < 0.01) return;
  const top = cy - 10, xs = [cx - 54, cx, cx + 54], seated = top - 14;
  people(xs, seated, { alpha });
  box(cx - 86, top, 172, 34, { fill: P.row, stroke: P.ink, alpha, radius: 8, width: 2.5 });
  xs.forEach((x, i) => {
    if (beat[i] > 0.01)
      ring(x, seated - 10, 17, { color: P.ink, alpha: alpha * beat[i] * 0.6, width: 2.5 });
  });
  [cx - 40, cx + 40].forEach(
    (x, i) => people([x], top + 34 + 37, { alpha: alpha * seats[i], color: P.unknown, absent: true })
  );
}
function pagesMark(cx, cy, { alpha = 1, pages = 3, bars = 0 } = {}) {
  if (alpha < 0.01) return;
  const ground = cy + 64, whole = Math.floor(pages), part = pages - whole;
  line(cx - 108, ground, cx + 112, ground, { color: P.line, alpha, width: 2.5 });
  const agentX = cx - 80;
  stroke(
    () => {
      ctx.moveTo(agentX, ground - 46);
      ctx.lineTo(agentX + 23, ground - 23);
      ctx.lineTo(agentX, ground);
      ctx.lineTo(agentX - 23, ground - 23);
      ctx.closePath();
    },
    { color: P.evidence, alpha, width: 2.5 }
  );
  dot(agentX, ground - 23, 4.5, { color: P.evidence, alpha });
  const slab = (k) => ground - 4 - (k + 1) * 12;
  const slabs = (from, to) => () => {
    for (let k = from; k < to; k++) ctx.roundRect(cx - 48, slab(k), 62, 8, 2);
  };
  fill(slabs(0, whole), { color: P.row, alpha });
  stroke(slabs(0, whole), { color: P.ink, alpha, width: 2 });
  if (part > 0.01) {
    const lift = (1 - part) * 10;
    stroke(
      () => ctx.roundRect(cx - 48, slab(whole) - lift, 62, 8, 2),
      { color: P.ink, alpha: alpha * part, width: 2 }
    );
  }
  if (bars > 0.01) {
    const shape = () => {
      ctx.roundRect(cx + 44, ground - 26, 22, 26, 3);
      ctx.roundRect(cx + 78, ground - 26, 22, 26, 3);
    };
    fill(shape, { color: P.row, alpha: alpha * bars });
    stroke(shape, { color: P.ink, alpha: alpha * bars, width: 2.5 });
  }
}

// picture/film/scenes/p01/scene.js
function cuesOf(s) {
  return {
    night: cue(s, "昨晚", "Last night"),
    // 01.2's first words, on which the failures' stage cuts in, a thought boundary.
    says: cue(s, "有人马上说", "Someone says at once"),
    data: cue(s, "价格数据", "price data"),
    late: cue(s, "晚了两个小时", "two hours late"),
    vendor: cue(s, "换供应商", "change the vendor"),
    facts: cue(s, "事实还没查清", "before the facts"),
    patch: cue(s, "手工把数据补上", "patches the data"),
    again: cue(s, "下个月照样出错", "next month it fails again"),
    mechanism: cue(s, "机制", "the mechanism"),
    meeting: cue(s, "开了个会", "A meeting"),
    speaks: cue(s, "人人都发了言", "everyone speaks"),
    decide: cue(s, "决定", "decide"),
    act: cue(s, "动手", "or act"),
    agent: cue(s, "智能体", "an Agent"),
    more: cue(s, "材料多了", "more material"),
    judgment: cue(s, "判断和结果", "the judgment"),
    busy: cue(s, "大家都没闲着", "Everyone keeps busy"),
    who: cue(s, "谁可以决定", "who may decide"),
    which: cue(s, "哪些事实", "which facts"),
    boundary: cue(s, "哪条边界", "which boundary"),
    noOne: cue(s, "没人说得清", "no one can say"),
    guide: cue(s, "数据部门工作指南", "The Data Department Work Guidelines"),
    against: cue(s, "针对", "against"),
    four: cue(s, "四种失败", "four failures")
  };
}
var XS = [450, 790, 1130, 1470];
var ROW_Y = 570;
var NAME_TOP = 675;
var SPAN2 = 680;
var CROSS_Y = 425;
var BRACKET_Y = NAME_TOP + 54;
var TOPS = [
  [0, -27],
  [0, -30],
  [0, -52],
  [-80, 10]
];
var TERMS = () => [
  L("换供应商", "A new vendor"),
  L("手工补上的数据", "Data patched by hand"),
  L("一场会", "A meeting"),
  L("十页分析", "Ten pages of analysis")
];
var QUALS = () => [
  [L("事实还没查清", "before the facts are in")],
  [L("机制一点没动", "the mechanism untouched")],
  [],
  [L("判断和结果", "judgment and outcome")]
];
var SEATS = () => L(["决定", "动手"], ["Decision", "Action"]);
function stageNight(t, a, c) {
  const names = {
    axis: { v: L("昨晚", "Last night"), alpha: named(t, c.night) },
    card: { v: L("价格数据", "Price data"), alpha: named(t, c.data) },
    late: { v: L("晚了两个小时", "Two hours late"), alpha: named(t, c.late) }
  };
  const e = lastNightExtent(1, { card: 1, late: 1, names });
  lastNight(960 - (e.left + e.right) / 2, 505 - (e.top + e.bottom) / 2, 1, {
    alpha: a,
    card: soon(t, c.data - 0.15, 0.8),
    late: soon(t, c.late + 0.05, 0.7),
    // The night runs on from the first word, so the opening holds its rail, its name and a moving point.
    flow: voiceTime(t) * 0.25 % 1,
    names
  });
}
function compactNight(a, t) {
  return lastNight(960, 250, 0.75, {
    alpha: a,
    card: 1,
    late: 1,
    flow: voiceTime(t) * 0.25 % 1,
    names: {
      axis: L("昨晚", "Last night"),
      card: { v: L("价格数据", "Price data"), side: "right" },
      late: L("晚了两个小时", "Two hours late")
    }
  });
}
function figure(k, x, t, a, c, busy = false) {
  const vt = voiceTime(t), on = a * ramp(t, [c.vendor, c.patch, c.meeting, c.agent][k] - 0.15, 0.4), part = (at2) => ramp(t, at2 - 0.15, 0.4);
  if (k === 0)
    forkMark(x, ROW_Y, {
      alpha: on,
      facts: busy ? 0 : part(c.facts),
      run: busy ? vt * 0.45 % 1 : null
    });
  if (k === 1)
    patchMark(x, ROW_Y, {
      alpha: on,
      drip: vt * 0.7 % 1,
      again: busy ? 0 : part(c.again),
      light: busy ? 0 : part(c.mechanism)
    });
  if (k === 2) {
    const flash = (i) => {
      const p = (t - c.speaks - 0.05 - 0.35 * i) / 0.5;
      return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0;
    };
    meetingMark(x, ROW_Y, {
      alpha: on,
      seats: busy ? [0, 0] : [part(c.decide), part(c.act)],
      beat: busy ? [0, 0, 0] : [0, 1, 2].map(flash)
    });
  }
  if (k === 3)
    pagesMark(x, ROW_Y, {
      alpha: on,
      pages: busy ? 9 : 3 + 6 * soon(t, c.more + 0.05, 1.6),
      bars: busy ? 0 : part(c.judgment)
    });
}
function stageFailures(t, a, c) {
  compactNight(a, t);
  const rail = { color: P.line, alpha: a, width: 2.5 };
  line(960, 362, 960, CROSS_Y, rail);
  path(
    [
      [960 - SPAN2, BRACKET_Y],
      [960 - SPAN2, CROSS_Y],
      [960 + SPAN2, CROSS_Y],
      [960 + SPAN2, BRACKET_Y]
    ],
    rail
  );
  const ats = [c.vendor, c.patch, c.meeting, c.agent], terms = TERMS(), quals = QUALS(), qualAts = [[c.facts], [c.mechanism], [], [c.judgment]], seats = [c.decide, c.act];
  ats.forEach((at2, k) => {
    const x = XS[k], [dx, dy] = TOPS[k];
    link(x + dx, CROSS_Y, x + dx, ROW_Y + dy, {
      alpha: a * ramp(t, at2 - 0.15, 0.3),
      upto: soon(t, at2 + 0.05, 0.4)
    });
    figure(k, x, t, a, c);
    termRow(t, [terms[k]], [at2], quals[k], qualAts[k], x, NAME_TOP, {
      align: "center",
      inline: false,
      build: true,
      width: 300,
      set: "failures-told",
      alpha: a * listLevel(t, ats, k)
    });
    if (k === 2)
      SEATS().forEach(
        (v, i) => nameText(v, x + (i ? 71 : -71), ROW_Y + 51, {
          align: i ? "left" : "right",
          alpha: a * listIn(t, seats, i),
          set: "seats"
        })
      );
  });
}
function busyRow(t, a, c) {
  const terms = TERMS(), quals = QUALS();
  XS.forEach((x, k) => {
    figure(k, x, t, a, c, true);
    growName(t, [terms[k]], [-Infinity], x, NAME_TOP, {
      align: "center",
      width: 300,
      set: "failures",
      alpha: a,
      whole: [terms[k], ...quals[k]].join(" ")
    });
  });
}
function rowName(v, t, at2, a) {
  const y = BRACKET_Y, on = a * soon(t, at2 - 0.1, 0.5), reach = SPAN2 * on;
  line(960 - reach, y, 960 + reach, y, { color: P.line, alpha: a * clamp(on * 3), width: 2 });
  if (on > 0.98)
    [-SPAN2, SPAN2].forEach(
      (dx) => line(960 + dx, y, 960 + dx, y - 10, { color: P.line, alpha: a, width: 2 })
    );
  nameText(v, 960, y + NAME_GAP, { valign: "top", alpha: a * named(t, at2) });
}
var QX = [540, 960, 1380];
var QY = 232;
function stageBusy(t, a, c) {
  busyRow(t, a, c);
  rowName(L("大家", "Everyone"), t, c.busy, a);
  const qs = [L(c.who, c.noOne), c.which, c.boundary], names = L(
    ["谁可以决定", "哪些事实", "哪条边界"],
    ["Who may decide", "Which facts", "Which boundary"]
  ), vt = voiceTime(t);
  qs.forEach((at2, i) => {
    openMark(QX[i], QY, 24, { alpha: a * ramp(t, at2 - 0.15, 0.4), turn: vt * 0.5 + i });
    nameText(names[i], QX[i], QY + 24 + NAME_GAP, {
      valign: "top",
      alpha: a * listIn(t, qs, i),
      set: "questions"
    });
  });
}
function stageGuide(t, a, c) {
  busyRow(t, a, c);
  const name = L("数据部门工作指南", ["Data Department", "Work Guidelines"]), wide = en ? Math.max(...name.map((v) => measure(v))) : measure(name), W = 150, H = 186, TOP3 = 168, left = 960 - (W + NAME_GAP + wide) / 2;
  documentIcon(left, TOP3, W, H, { alpha: a, rows: 5 });
  nameText(name, left + W + NAME_GAP, TOP3 + H / 2, { align: "left", alpha: a * named(t, c.guide) });
  XS.forEach((x, k) => {
    const [dx, dy] = TOPS[k];
    link(left + W / 2, TOP3 + H + 8, x + dx, ROW_Y + dy, {
      route: "vhv",
      mid: CROSS_Y,
      alpha: a,
      upto: soon(t, c.against + 0.05 + 0.1 * k, 0.6)
    });
  });
  rowName(L("四种失败", "Four failures"), t, c.four, a);
}
scenes["01"] = function(s, t) {
  if (t < s.words[0].start - 0.12) {
    titleSignature(1);
    return;
  }
  const c = cuesOf(s);
  const A5 = stageOut(t, c.says), B6 = stageIn(t, c.says) * stageOut(t, c.busy), C4 = stageIn(t, c.busy) * stageOut(t, c.guide), D3 = stageIn(t, c.guide);
  if (A5 > 0) stageNight(t, A5, c);
  if (B6 > 0) stageFailures(t, B6, c);
  if (C4 > 0) stageBusy(t, C4, c);
  if (D3 > 0) stageGuide(t, D3, c);
  illustrative(1);
};

// picture/film/drawing/workspace.js
function kernelIcon(x, y, r, { alpha = 1, color = P.authority, beat = 0, turn = 0 } = {}) {
  if (alpha < 0.01) return;
  const build = () => {
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 6 + i * Math.PI / 3 + turn, px = x + r * Math.cos(a), py = y + r * Math.sin(a);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath();
  };
  fill(build, { color: P.row, alpha });
  stroke(build, { color, alpha, width: 3 });
  dot(x, y, r * 0.26 * (1 + 0.25 * clamp(beat)), { color, alpha });
  ring(x, y, r * 0.52, { color, alpha: alpha * 0.5, width: 2 });
}
function tagIcon(x, y, w, h, { alpha = 1, color = P.authority } = {}) {
  if (alpha < 0.01) return;
  const build = () => {
    ctx.moveTo(x, y);
    ctx.lineTo(x + h / 2, y - h / 2);
    ctx.lineTo(x + w, y - h / 2);
    ctx.lineTo(x + w, y + h / 2);
    ctx.lineTo(x + h / 2, y + h / 2);
    ctx.closePath();
  };
  fill(build, { color: P.row, alpha });
  stroke(build, { color, alpha, width: 2.5 });
  dot(x + h / 2 + 2, y, 4, { color, alpha });
}
function recoverIcon(x, y, r, { alpha = 1, color = P.evidence, upto = 1 } = {}) {
  if (alpha < 0.01) return;
  ring(x, y, r, { color, alpha, width: 3, upto: 0.78 * clamp(upto), start: -Math.PI * 0.35 });
  const a = -Math.PI * 0.35 + Math.PI * 2 * 0.78 * clamp(upto);
  if (upto > 0.9) dot(x + r * Math.cos(a), y + r * Math.sin(a), 5, { color, alpha });
}
function layersIcon(x, y, w, h, { alpha = 1, color = P.ink, fillColor = P.row, layers = 3 } = {}) {
  if (alpha < 0.01) return;
  const slab = h / (layers + 0.4), build = () => {
    for (let i = 0; i < layers; i++)
      ctx.roundRect(x - w / 2, y - h / 2 + i * slab * 1.05, w, slab * 0.86, 8);
  };
  fill(build, { color: fillColor, alpha });
  stroke(build, { color, alpha, width: 2.5 });
  stroke(
    () => {
      for (let i = 0; i < layers; i++) {
        const ry = y - h / 2 + (i * 1.05 + 0.43) * slab;
        ctx.moveTo(x - w / 2 + 24, ry);
        ctx.lineTo(x + w / 2 - 24, ry);
      }
    },
    { color, alpha: alpha * 0.6, width: 2 }
  );
}
function bubble(x, y, r, { alpha = 1, color = P.muted } = {}) {
  if (alpha < 0.01) return;
  const build = () => {
    ctx.roundRect(x - r * 1.3, y - r * 0.85, r * 2.6, r * 1.7, r * 0.5);
  };
  fill(build, { color: P.row, alpha });
  stroke(build, { color, alpha, width: 2.5 });
  stroke(
    () => {
      ctx.moveTo(x - r * 0.7, y - r * 0.1);
      ctx.lineTo(x + r * 0.7, y - r * 0.1);
      ctx.moveTo(x - r * 0.7, y + r * 0.3);
      ctx.lineTo(x + r * 0.2, y + r * 0.3);
    },
    { color, alpha, width: 2 }
  );
}
function ledger(x, y, w, h, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  documentIcon(x - w / 2, y - h / 2, w, h, { alpha, rows: 0 });
  const rows = [-2, -1, 1, 2].map((k) => y + k * h * 0.17);
  stroke(
    () => rows.forEach((ry, k) => {
      ctx.moveTo(x - w * 0.34, ry);
      ctx.lineTo(x + w * (k % 2 ? 0.18 : 0.3), ry);
    }),
    { color: P.muted, alpha: alpha * 0.8, width: 2 }
  );
  line(x - w * 0.34, y, x + w / 2 - 34, y, { color: P.authority, alpha, width: 3 });
}

// picture/film/scenes/p02/marks.js
function guidePage(x, y, w, h, { alpha = 1, seal: rim = 0, stamp = 0 } = {}) {
  const at2 = [x + w - 52, y + h - 58], half = w / 2, n = Math.floor((h - 90) / 30) + 1;
  if (alpha < 0.01) return at2;
  box(x, y, w, h, { fill: P.row, stroke: P.ink, alpha, radius: 6, width: 2.5 });
  line(x + half, y, x + half, y + h, { color: P.ink, alpha, width: 2.5 });
  stroke(
    () => [x, x + half].forEach((px) => {
      ctx.moveTo(px + 22, y + 38);
      ctx.lineTo(px + half * 0.62, y + 38);
    }),
    { color: P.ink, alpha, width: 4 }
  );
  stroke(
    () => [x, x + half].forEach((px, side) => {
      for (let k = 0; k < n; k++) {
        const ry = y + 74 + k * 30, end = side && k >= n - 3 ? px + half - 102 : px + half - (k % 2 ? 44 : 22);
        ctx.moveTo(px + 22, ry);
        ctx.lineTo(end, ry);
      }
    }),
    { color: P.muted, alpha: alpha * 0.8, width: 2 }
  );
  if (rim > 0.01) seal(at2[0], at2[1], 30, { alpha: alpha * rim, stamp: alpha * stamp });
  return at2;
}
var toAndFro = (vt, speed = 1.2) => 0.5 - 0.5 * Math.cos(vt * speed);
function people2(xs, y, { size = 0.9, alpha = 1, color = P.ink } = {}) {
  if (alpha < 0.01) return;
  const r = 15 * size;
  fill(
    () => xs.forEach((x) => {
      ctx.moveTo(x + r, y - r * 1.15);
      ctx.arc(x, y - r * 1.15, r, 0, Math.PI * 2);
    }),
    { color, alpha }
  );
  stroke(
    () => xs.forEach((x) => {
      const a0 = Math.PI * 1.08;
      ctx.moveTo(x + r * 1.55 * Math.cos(a0), y + r * 1.9 + r * 1.55 * Math.sin(a0));
      ctx.arc(x, y + r * 1.9, r * 1.55, a0, Math.PI * 1.92);
    }),
    { color, alpha, width: 3 * size + 0.5 }
  );
}
function agents(xs, y, { r = 22, alpha = 1, color = P.evidence } = {}) {
  if (alpha < 0.01) return;
  stroke(
    () => xs.forEach((x) => {
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r, y);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x - r, y);
      ctx.closePath();
    }),
    { color, alpha, width: 2.5 }
  );
  fill(
    () => xs.forEach((x) => {
      ctx.moveTo(x + r * 0.2, y);
      ctx.arc(x, y, r * 0.2, 0, Math.PI * 2);
    }),
    { color, alpha }
  );
}
function handedMark(k, x, y, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  const o = { color: P.muted, alpha, width: 2.5 };
  if (k === 0) documentIcon(x - 24, y - 30, 48, 60, { alpha, stroke: P.muted, rows: 3 });
  if (k === 1) tableIcon(x - 34, y - 24, 68, 48, { alpha, stroke: P.muted, rows: 3, cols: 3 });
  if (k === 2) {
    documentIcon(x - 24, y - 30, 48, 60, { alpha, stroke: P.muted, rows: 0 });
    stroke(
      () => {
        ctx.moveTo(x - 14, y + 18);
        ctx.lineTo(x - 4, y + 4);
        ctx.lineTo(x + 4, y + 10);
        ctx.lineTo(x + 14, y - 8);
      },
      { ...o, width: 2.5 }
    );
  }
  if (k === 3) {
    line(x - 30, y, x + 30, y, o);
    fill(
      () => [-30, 0, 30].forEach((dx) => {
        ctx.moveTo(x + dx + 7, y);
        ctx.arc(x + dx, y, 7, 0, Math.PI * 2);
      }),
      { color: P.muted, alpha }
    );
  }
}
function wave(x0, x1, y, phase, { alpha = 1, amp = 13 } = {}) {
  if (alpha < 0.01) return;
  stroke(
    () => {
      for (let x = x0; x <= x1; x += 3) {
        const q = (x - x0) / (x1 - x0), v = y - amp * Math.sin(q * Math.PI * 4 - phase) * Math.sin(Math.PI * q);
        x === x0 ? ctx.moveTo(x, v) : ctx.lineTo(x, v);
      }
    },
    { color: P.evidence, alpha, width: 3 }
  );
}
function outputMark(k, x, y, { alpha = 1, run = 0 } = {}) {
  if (alpha < 0.01) return;
  if (k === 0) {
    dot(x, y, 22, { color: P.ground, alpha });
    ring(x, y, 22, { color: P.ink, alpha, width: 3 });
    dot(x, y, 6, { color: P.ink, alpha });
  }
  if (k === 1) tableIcon(x - 34, y - 26, 68, 52, { alpha, rows: 3, cols: 3 });
  if (k === 2) {
    line(x - 34, y + 16, x + 34, y + 16, { color: P.line, alpha, width: 3 });
    token(x - 24 + 48 * run, y - 6, { alpha, r: 10 });
  }
}
function outcome(x, y, { alpha = 1, bounds = 0, done = 0 } = {}) {
  if (alpha < 0.01) return;
  dot(x, y, 19, { color: P.ground, alpha });
  ring(x, y, 19, { color: P.ink, alpha, width: 3 });
  if (bounds > 0.01)
    stroke(
      () => [-1, 1].forEach((side) => {
        const bx = x + side * 31;
        ctx.moveTo(bx - side * 6, y - 22);
        ctx.lineTo(bx, y - 22);
        ctx.lineTo(bx, y + 22);
        ctx.lineTo(bx - side * 6, y + 22);
      }),
      { color: P.ink, alpha: alpha * bounds, width: 2.5 }
    );
  if (done > 0.01) check(x, y + 1, 22, { color: P.evidence, alpha, upto: clamp(done) });
}
function mechanism(x, y, { alpha = 1, turn = 0, watch = 0 } = {}) {
  if (alpha < 0.01) return;
  kernelIcon(x, y, 22, { alpha, color: P.ink, turn, beat: watch });
  if (watch > 0.01) ring(x, y, 31, { color: P.evidence, alpha: alpha * watch, width: 2.5 });
}
function reports(xs, y, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  const w = 38, h = 48;
  const pages = () => xs.forEach((x) => ctx.roundRect(x - w / 2, y - h / 2, w, h, 4));
  fill(pages, { color: P.row, alpha });
  stroke(pages, { color: P.muted, alpha, width: 2 });
  stroke(
    () => xs.forEach(
      (x) => [-10, 0, 10].forEach((dy, k) => {
        ctx.moveTo(x - 11, y + dy);
        ctx.lineTo(x + (k === 1 ? 4 : 11), y + dy);
      })
    ),
    { color: P.muted, alpha: alpha * 0.8, width: 2 }
  );
}

// picture/film/scenes/p02/tasks.js
function taskCues(s) {
  return {
    task: cue(s, "一项任务", "a task"),
    three: cue(s, "三件事", "three things"),
    outcomes: [
      cue(s, "问题解决掉", "resolve the problem"),
      cue(s, "判断检验过", "test the judgment"),
      cue(s, "系统", "the system")
    ],
    holds: cue(s, "说清", "say when it holds"),
    sooner: cue(s, "更早认出来", "recognize"),
    better: cue(s, "处理得更好", "handle it better"),
    kinds: cue(s, "三种结果", "three outcomes"),
    reports: cue(s, "三份报告", "three reports"),
    colleague: cue(s, "连夜", "The colleague"),
    first: cue(s, "只做到了第一件", "only the first")
  };
}
var TASK = { x: 960, y: 440, r: 21 };
var RING_GAP = 4;
var RAIL_Y = 570;
var RING_Y = 640;
var PITCH = 300;
var XS2 = [TASK.x - PITCH, TASK.x, TASK.x + PITCH];
var RING = 19;
var BESIDE = { x: 840, pitch: 42, half: 61 };
var REFUSAL = 16 + Math.min(26, labelSize(LABEL) * 0.9);
var TASK_NAME = () => L("一项任务", "A task");
var THREE = () => L("三件事", "Three things");
var REPORTS = () => L("三份报告", "Three reports");
var COLLEAGUE = () => L("那位同事", "The colleague");
var ONLY_FIRST = () => L("只做到了第一件", "only the first");
var OUTCOMES = () => [
  [[L("问题解决掉", "Problem resolved")], []],
  [[L("判断检验过", "Judgment tested")], [L("成立的条件", "its conditions stated")]],
  [
    [L("系统", "The system")],
    L(["更早认出来", "，或者处理得更好"], ["sooner recognition,", " better handling"])
  ]
];
var noteWidth = () => Math.max(...OUTCOMES().map(([term]) => measure(term.join(""))));
function nameHalf([term, qual]) {
  const lineWidth = (line2) => measure(line2.map(([, v]) => v).join(""), NOTE);
  return Math.max(
    measure(term.join("")),
    ...qual.length ? growTexts(qual, noteWidth(), NOTE).map(lineWidth) : []
  ) / 2;
}
var railHalf = () => PITCH + Math.max(nameHalf(OUTCOMES()[0]), nameHalf(OUTCOMES()[2]));
function stageOutcomes(s, t, c) {
  const C4 = stageIn(t, c.task) * stageOut(t, c.colleague), C22 = stageIn(t, c.colleague);
  const a = Math.max(C4, C22);
  if (a <= 0) return;
  const vt = voiceTime(t), { x, y, r } = TASK, half = railHalf(), first = C22 * ramp(t, c.first - 0.15, 0.4);
  token(x, y, { alpha: a * ramp(t, c.task - 0.15, 0.4) });
  nameText(TASK_NAME(), x, y - r - NAME_GAP, { valign: "bottom", alpha: a * named(t, c.task) });
  stroke(
    () => {
      ctx.moveTo(x, y + r + RING_GAP);
      ctx.lineTo(x, RAIL_Y);
      ctx.moveTo(x - half, RAIL_Y);
      ctx.lineTo(x + half, RAIL_Y);
    },
    { color: P.line, alpha: a * ramp(t, c.task - 0.15, 0.4), width: 3.5 }
  );
  nameText(THREE(), x + NAME_GAP, (y + r + RING_GAP + RAIL_Y) / 2, {
    align: "left",
    alpha: a * named(t, c.three)
  });
  const noteW = noteWidth();
  OUTCOMES().forEach(([term, qual], k) => {
    const at2 = c.outcomes[k], ox = XS2[k], on = a * ramp(t, at2 - 0.15, 0.4);
    link(ox, RAIL_Y, ox, RING_Y - RING - 7, {
      alpha: on,
      upto: soon(t, at2 + 0.05, 0.4),
      width: 2.5
    });
    if (k < 2)
      outcome(ox, RING_Y, {
        alpha: on,
        bounds: k === 1 ? ramp(t, c.holds - 0.1, 0.4) : 0,
        done: k === 0 ? soon(t, c.first + 0.05, 0.5) * C22 : 0
      });
    else
      mechanism(ox, RING_Y, {
        alpha: on,
        turn: vt * 0.5,
        watch: ramp(t, c.sooner - 0.1, 0.4)
      });
    beats(t, ox, RING_Y, RING + 12, [c.kinds], { alpha: C4 });
    termRow(
      t,
      term,
      [at2],
      qual,
      k === 1 ? [c.holds] : [c.sooner, c.better],
      ox,
      RING_Y + RING + NAME_GAP,
      {
        align: "center",
        inline: false,
        build: true,
        noteWidth: noteW,
        set: "outcomes",
        alpha: a * listLevel(t, c.outcomes, k)
      }
    );
  });
  const reportsOn = C4 * ramp(t, c.reports - 0.15, 0.4), { x: bx, pitch, half: pages } = BESIDE;
  reports([bx - pitch, bx, bx + pitch], y, { alpha: reportsOn });
  rejectedName(REPORTS(), bx - pages - NAME_GAP - REFUSAL, y, {
    align: "right",
    alpha: reportsOn,
    mark: ramp(t, c.reports + 0.05, 0.3)
  });
  if (C22 <= 0) return;
  illustrative(C22);
  people2([bx], y, { size: 1, alpha: C22 });
  link(bx + 30, y, x - r - RING_GAP, y, {
    alpha: C22,
    upto: soon(t, c.colleague + 0.05, 0.5),
    width: 2.5
  });
  const { height } = termRowLayout([COLLEAGUE()], [ONLY_FIRST()], Infinity, false);
  termRow(
    t,
    [COLLEAGUE()],
    [c.colleague],
    [ONLY_FIRST()],
    [c.first],
    bx - 24 - NAME_GAP,
    y - height / 2,
    {
      align: "right",
      inline: false,
      alpha: C22
    }
  );
  const lit = { color: P.evidence, alpha: first, width: 3 };
  stroke(() => {
    ctx.moveTo(x, y + r + RING_GAP);
    ctx.lineTo(x, RAIL_Y);
    ctx.lineTo(XS2[0], RAIL_Y);
  }, lit);
  link(XS2[0], RAIL_Y, XS2[0], RING_Y - RING - 7, {
    ...lit,
    flow: t > c.first + 0.6 ? vt * 0.5 % 1 : null
  });
}

// picture/film/scenes/p02/scene.js
function cuesOf2(s) {
  return {
    guide: cue(s, "这份指南", "The guidelines"),
    seal: cue(s, "工作质量", "contract"),
    stamp: cue(s, "契约", "quality"),
    members: cue(s, "部门成员", "members"),
    delegate: cue(s, "委托", "delegate"),
    agents: cue(s, "智能体", "Agents"),
    value: cue(s, "数据工作的价值", "The value of data work"),
    handed: [
      cue(s, "一个文件", "a file"),
      cue(s, "一张表", "a table"),
      cue(s, "一份报告", "a report"),
      cue(s, "一个流程", "a process")
    ],
    signal: cue(s, "现实里的信号", "signals from the world"),
    becomes: cue(s, "变成", "into judgments"),
    others: cue(s, "别人", "others"),
    outputs: [
      cue(s, "判断", "judgments"),
      cue(s, "数据资产", "data assets"),
      cue(s, "行动", "actions")
    ],
    qualities: [
      cue(s, "讲得清", "explained"),
      cue(s, "经得起查", "checked"),
      cue(s, "能用到哪里", "clear limits")
    ],
    ...taskCues(s)
  };
}
var PAGE = { w: 400, h: 350 };
var ROW = 700;
var HEADS = ROW - 36;
var CROSS = 42;
var PAGE_TOP = HEADS - 2 * CROSS - PAGE.h;
var MEMBERS = [620, 680, 740];
var AGENTS = [1180, 1240];
var ROW_NAMES = ROW + 22 + NAME_GAP;
function stageGuide2(s, t, a, c) {
  const x = 960 - PAGE.w / 2 - (measure(L("契约", "Contract")) - measure(L("这份指南", "The guidelines"))) / 2;
  const g = a * clearOfTitle(s, t, PAGE_TOP), bottom = PAGE_TOP + PAGE.h, mid = bottom + CROSS, agentsX = (AGENTS[0] + AGENTS[1]) / 2;
  const sealAt = guidePage(x, PAGE_TOP, PAGE.w, PAGE.h, {
    alpha: g * ramp(t, s.voice_start - 0.4, 0.35),
    seal: ramp(t, c.seal - 0.15, 0.4),
    stamp: ramp(t, c.stamp - 0.1, 0.35)
  });
  nameText(L("这份指南", "The guidelines"), x - NAME_GAP, PAGE_TOP + PAGE.h / 2, {
    align: "right",
    alpha: g * named(t, c.guide)
  });
  nameText(L("契约", "Contract"), x + PAGE.w + NAME_GAP, sealAt[1], {
    align: "left",
    alpha: g * named(t, c.seal)
  });
  const members = g * ramp(t, c.members - 0.15, 0.4), agentsOn = g * ramp(t, c.agents - 0.15, 0.4);
  people2(MEMBERS, ROW, { alpha: members });
  link(x + PAGE.w * 0.25, bottom, MEMBERS[1], HEADS, {
    route: "vhv",
    mid,
    alpha: members,
    upto: soon(t, c.members + 0.05, 0.5)
  });
  nameText(L("部门成员", "Members"), MEMBERS[1], ROW_NAMES, {
    valign: "top",
    alpha: g * named(t, c.members)
  });
  agents(AGENTS, ROW, { alpha: agentsOn });
  link(x + PAGE.w * 0.75, bottom, agentsX, ROW - 30, {
    route: "vhv",
    mid,
    alpha: agentsOn,
    upto: soon(t, c.agents + 0.05, 0.5)
  });
  nameText(L("智能体", "Agents"), agentsX, ROW_NAMES, {
    valign: "top",
    alpha: g * named(t, c.agents)
  });
  const reach = soon(t, c.delegate + 0.05, 0.8);
  link(MEMBERS[2] + 34, ROW, AGENTS[0] - 34, ROW, {
    alpha: g * ramp(t, c.delegate - 0.15, 0.4),
    upto: reach,
    width: 2.5,
    flow: reach > 0.99 ? voiceTime(t) * 0.45 % 1 : null
  });
  nameText(L("委托", "Delegation"), 960, ROW_NAMES, {
    valign: "top",
    alpha: g * named(t, c.delegate)
  });
}
var WAY_Y = 450;
var WAY = [360, 1560];
var WAVE_END = 470;
var HANG_Y = 530;
var HANG_NAMES = HANG_Y + 32 + NAME_GAP;
var OUT_Y = 680;
var OUT_NAMES = OUT_Y + 32 + NAME_GAP;
var HANDED_X = [600, 840, 1080, 1320];
var OUTPUT_X = [720, 960, 1200];
var OTHERS = [1594, 1640];
var OTHERS_X = 1617;
var OVER = WAY_Y - 7 - NAME_GAP;
var SECOND2 = 0.58;
var REFUSAL_CROSS = Math.min(26, labelSize(LABEL) * 0.9);
var HANDED = () => L(["一个文件", "一张表", "一份报告", "一个流程"], ["A file", "A table", "A report", "A process"]);
var OUTPUTS = () => L(["判断", "数据资产", "行动"], ["Judgments", "Data assets", "Actions"]);
var QUALITIES = () => L(["讲得清", "经得起查", "能用到哪里"], ["Explained", "Checked", "Clear limits"]);
function theWay(t, a, c, end) {
  const signal = ramp(t, c.signal - 0.15, 0.4), start = t >= c.signal - 0.15 ? WAVE_END : WAY[0];
  line(start, WAY_Y, end, WAY_Y, { color: P.line, alpha: a, width: 3.5 });
  dot(WAY[1], WAY_Y, 6, { color: P.line, alpha: a });
  if (t < c.signal - 0.15) dot(WAY[0], WAY_Y, 6, { color: P.line, alpha: a });
  wave(WAY[0], WAVE_END, WAY_Y, voiceTime(t) * 5, { alpha: a * signal });
  nameText(L("工作的价值", "The value of data work"), 960, OVER, {
    valign: "bottom",
    alpha: a * named(t, c.value)
  });
  nameText(L("现实里的信号", "Signals from the world"), (WAY[0] + WAVE_END) / 2, OVER, {
    valign: "bottom",
    alpha: a * named(t, c.signal)
  });
}
function stageWay(t, a, c) {
  const vt = voiceTime(t), end = WAY[1];
  theWay(t, a, c, end);
  const recede = ramp(t, c.becomes + 0.05, 0.4);
  HANDED().forEach((v, k) => {
    const seen = a * ramp(t, c.handed[k] - 0.15, 0.4), on = a * listIn(t, c.handed, k), level = on * mix(1, SECOND2, recede), mark = ramp(t, c.handed[k] + 0.05, 0.3);
    handedMark(k, HANDED_X[k], HANG_Y, { alpha: level });
    const name = rejectedName(v, HANDED_X[k], HANG_NAMES, {
      valign: "top",
      alpha: Math.min(level, mix(1, 0.7, mark)),
      mark: 0,
      set: "handed"
    });
    cross(name.right - REFUSAL_CROSS / 2, (name.top + name.bottom) / 2, REFUSAL_CROSS, {
      alpha: mix(on, seen, recede) * mark,
      width: 3
    });
  });
  const q = vt * 0.3 % 1;
  if (t > c.others) flowDot(mix(WAVE_END, end, q), WAY_Y, 6, q, { color: P.evidence, alpha: a });
  OUTPUTS().forEach((v, k) => {
    const on = a * ramp(t, c.outputs[k] - 0.15, 0.4);
    line(OUTPUT_X[k], WAY_Y + 2, OUTPUT_X[k], OUT_Y - 32, { color: P.line, alpha: on, width: 2 });
    outputMark(k, OUTPUT_X[k], OUT_Y, { alpha: on, run: toAndFro(vt) });
    nameText(v, OUTPUT_X[k], OUT_NAMES, {
      valign: "top",
      alpha: a * listIn(t, c.outputs, k),
      set: "outputs"
    });
  });
  const others = a * ramp(t, c.others - 0.15, 0.4);
  people2(OTHERS, WAY_Y, { size: 0.8, alpha: others });
  const own = nameText(L("别人", "Others"), OTHERS_X, WAY_Y + 18 + NAME_GAP, {
    valign: "top",
    alpha: a * named(t, c.others)
  });
  growName(t, QUALITIES(), c.qualities, OTHERS_X, own.bottom + 18, {
    width: Math.max(...QUALITIES().map((v) => measure(v, NOTE))),
    size: NOTE,
    color: P.muted,
    align: "center",
    build: true,
    alpha: a
  });
}
scenes["02"] = function(s, t) {
  const c = cuesOf2(s);
  const A5 = stageOut(t, c.value), B6 = stageIn(t, c.value) * stageOut(t, c.task);
  if (A5 > 0) stageGuide2(s, t, A5, c);
  if (B6 > 0) stageWay(t, B6, c);
  stageOutcomes(s, t, c);
};

// picture/film/scenes/p03/marks.js
function recordMark(x, y, w, h, { alpha = 1, checked: checked2 = 1 } = {}) {
  if (alpha < 0.01) return;
  documentIcon(x - w / 2, y - h / 2, w, h, { alpha, rows: 3 });
  if (checked2 > 0.01)
    check(x + w * 0.12, y + h * 0.3, w * 0.34, { alpha: alpha * clamp(checked2), width: 3.5 });
}
function dashedPage(x, y, w, h, { alpha = 1, color = P.unknown } = {}) {
  if (alpha < 0.01) return;
  box(x - w / 2, y - h / 2, w, h, { stroke: color, alpha, radius: 6, width: 2.5, dash: [7, 6] });
  stroke(
    () => [0.3, 0.5, 0.7].forEach((q, k) => {
      ctx.moveTo(x - w * 0.32, y - h / 2 + h * q);
      ctx.lineTo(x + w * (k === 1 ? 0.12 : 0.32), y - h / 2 + h * q);
    }),
    { color, alpha: alpha * 0.8, width: 2, dash: [6, 6] }
  );
}
function eye(x, y, { alpha = 1, color = P.evidence, hollow = false, repeat = 0, r = 30 } = {}) {
  if (alpha < 0.01) return;
  stroke(
    () => {
      ctx.moveTo(x - r, y);
      ctx.quadraticCurveTo(x, y - r * 0.9, x + r, y);
      ctx.quadraticCurveTo(x, y + r * 0.9, x - r, y);
      ctx.closePath();
    },
    { color, alpha, width: 3 }
  );
  dot(x, y, r * 0.3, { color, alpha, hollow, width: 2.5 });
  if (repeat > 0.01) {
    const cx = x + r + 16, cy = y - r * 0.55;
    ring(cx, cy, 11, {
      color,
      alpha: alpha * repeat,
      width: 2.5,
      upto: 0.78,
      start: -Math.PI * 0.2
    });
    dot(cx + 11 * Math.cos(Math.PI * 1.36), cy + 11 * Math.sin(Math.PI * 1.36), 3.5, {
      color,
      alpha: alpha * repeat
    });
  }
}
function leadMark(k, x, y, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  const o = { color: P.muted, alpha, width: 2.5 };
  if (k === 0) bubble(x, y, 15, { alpha });
  if (k === 1) {
    ring(x, y, 17, { ...o, dash: [5, 5] });
    dot(x, y, 4.5, { color: P.muted, alpha });
  }
  if (k === 2) layersIcon(x, y, 42, 36, { alpha, color: P.muted });
  if (k === 3) {
    box(x - 21, y - 17, 42, 34, { fill: P.row, stroke: P.muted, alpha, radius: 4, width: 2.5 });
    stroke(
      () => {
        ctx.moveTo(x - 13, y + 8);
        ctx.lineTo(x - 4, y - 2);
        ctx.lineTo(x + 3, y + 4);
        ctx.lineTo(x + 13, y - 8);
      },
      { ...o, width: 2 }
    );
  }
  if (k === 4) {
    stroke(() => {
      ctx.moveTo(x, y - 17);
      ctx.lineTo(x + 17, y);
      ctx.lineTo(x, y + 17);
      ctx.lineTo(x - 17, y);
      ctx.closePath();
    }, o);
    dot(x, y, 3.5, { color: P.muted, alpha });
  }
}
function bar(x, y, { alpha = 1, length = 44, vertical = false } = {}) {
  if (alpha < 0.01) return;
  const d = length / 2;
  if (vertical) line(x, y - d, x, y + d, { color: P.unknown, alpha, width: 5, cap: "butt" });
  else line(x - d, y, x + d, y, { color: P.unknown, alpha, width: 5, cap: "butt" });
}
function conflictMark(x, y, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  stroke(
    () => {
      ctx.moveTo(x - 22, y - 10);
      ctx.lineTo(x - 8, y + 10);
      ctx.lineTo(x + 8, y - 10);
      ctx.lineTo(x + 22, y + 10);
    },
    { color: P.unknown, alpha, width: 3.5 }
  );
}
function actionMark(x, y, { alpha = 1, color = P.ink } = {}) {
  if (alpha < 0.01) return;
  line(x - 28, y + 14, x + 28, y + 14, { color: P.line, alpha, width: 3 });
  dot(x, y, 10, { color, alpha });
  ring(x, y, 17, { color, alpha: alpha * 0.45, width: 2 });
}
function reportMark(x, y, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  documentIcon(x - 26, y - 32, 52, 64, { alpha, rows: 2 });
  fill(
    () => {
      ctx.roundRect(x - 14, y + 12, 7, 12, 1);
      ctx.roundRect(x - 3, y + 6, 7, 18, 1);
      ctx.roundRect(x + 8, y + 16, 7, 8, 1);
    },
    { color: P.ink, alpha }
  );
}
var LEADS = [
  ["转述", "Second-hand accounts"],
  ["记忆", "Memory"],
  ["缓存", "Caches"],
  ["派生视图", "Generated views"],
  ["智能体的输出", "Agent output"]
];
var LEAD_ORDER = () => L([0, 1, 2, 3, 4], [0, 2, 3, 4, 1]);

// picture/film/scenes/p03/case.js
var flowOf = (t) => voiceTime(t) * 0.25 % 1;
var NIGHT = () => L("昨晚", "Last night");
var COLLECTION = () => L("采集", "Collection");
var LATE = () => L("晚了两个小时", "Two hours late");
function theNight(t, a, c) {
  lastNight(960, 250, 0.75, {
    alpha: a,
    card: soon(t, c.collection - 0.15, 0.8),
    late: soon(t, c.late - 0.15, 0.7),
    flow: flowOf(t),
    names: {
      axis: { v: NIGHT(), alpha: named(t, c.lastNight) },
      card: { v: COLLECTION(), side: "right", alpha: named(t, c.collection + 0.1) },
      late: { v: LATE(), alpha: named(t, c.late) }
    }
  });
}
var COLUMNS = [560, 960, 1360];
var ROW_Y2 = 590;
var MARK2 = [84, 104];
var RAIL2 = { y: ROW_Y2 + MARK2[1] / 2 + 10, reach: 90 };
var NAMES_TOP = RAIL2.y + NAME_GAP;
var OBSERVATION = { x: COLUMNS[1] + 170, r: 34 };
var OWNER_Y = 800;
function theFact(t, a, c) {
  ledger(COLUMNS[0], ROW_Y2, ...MARK2, { alpha: a * ramp(t, c.log - 0.15, 0.4) });
  check(COLUMNS[0] + 30, ROW_Y2 + 30, 30, { alpha: a * ramp(t, c.fact - 0.1, 0.4), width: 4 });
  termRow(
    t,
    [L("日志", "The log")],
    [c.log],
    [L("事实", "a fact")],
    [c.fact],
    COLUMNS[0],
    NAMES_TOP,
    {
      align: "center",
      inline: false,
      alpha: a
    }
  );
}
function theHypothesis(t, a, c, { checked: checked2 = true } = {}) {
  const x = COLUMNS[1], vt = voiceTime(t);
  dashedPage(x, ROW_Y2, ...MARK2, { alpha: a * ramp(t, c.vendorLate - 0.15, 0.4) });
  openMark(x + MARK2[0] / 2 + 6, ROW_Y2 - MARK2[1] / 2 + 4, 20, {
    alpha: a * ramp(t, c.hypothesis - 0.15, 0.4),
    turn: vt * 0.6
  });
  termRow(
    t,
    [L("供应商发布", "Vendor publication")],
    [c.vendorLate],
    [L("假设", "a hypothesis")],
    [c.hypothesis],
    x,
    NAMES_TOP,
    { align: "center", inline: false, alpha: a }
  );
  if (!checked2) return;
  const on = a * ramp(t, c.checks - 0.15, 0.4);
  clock(x - MARK2[0] / 2 - 4, ROW_Y2 - MARK2[1] / 2 + 4, 17, { alpha: on, hand: 0.15 });
  nameText(
    L("发布时间", "Publication time"),
    x - MARK2[0] / 2 - 4 - 17 - NAME_GAP,
    ROW_Y2 - MARK2[1] / 2 + 4,
    {
      align: "right",
      alpha: a * named(t, c.checks)
    }
  );
}
function stageCase(t, a, c) {
  theNight(t, a, c);
  line(COLUMNS[0] - RAIL2.reach, RAIL2.y, COLUMNS[2] + RAIL2.reach, RAIL2.y, {
    color: P.line,
    alpha: a,
    width: 2.5
  });
  theFact(t, a, c);
  theHypothesis(t, a, c);
  const { x, r } = OBSERVATION, seen = a * ramp(t, c.observation - 0.15, 0.4);
  eye(x, ROW_Y2, { alpha: seen, hollow: true, r });
  const term = [L("观察", "An observation")], qual = [L("能推翻它", "would refute it")], { height } = termRowLayout(term, qual, Infinity, false);
  termRow(t, term, [c.observation], qual, [c.refute], x, ROW_Y2 - r * 0.9 - NAME_GAP - height, {
    align: "center",
    inline: false,
    alpha: a
  });
  const refuted = a * ramp(t, c.refute - 0.15, 0.4);
  link(x - r - 8, ROW_Y2 + 18, COLUMNS[1] + MARK2[0] / 2 + 10, ROW_Y2 + 18, {
    alpha: refuted,
    upto: soon(t, c.refute + 0.05, 0.6),
    width: 2.5
  });
  if (refuted > 0.01)
    [
      [-1, -1, 1, 1],
      [1, -1, -1, 1]
    ].forEach(
      ([x0, y0, x1, y1]) => line(COLUMNS[1] + 13 * x0, ROW_Y2 + 13 * y0, COLUMNS[1] + 13 * x1, ROW_Y2 + 13 * y1, {
        color: P.unknown,
        alpha: refuted,
        width: 3.5,
        dash: [5, 4]
      })
    );
  const cx = COLUMNS[2];
  forkMark(cx, ROW_Y2 - 20, {
    alpha: a * ramp(t, c.choice - 0.15, 0.4),
    run: voiceTime(t) * 0.45 % 1
  });
  termRow(
    t,
    [L("换供应商", "A new vendor")],
    [c.choice],
    [L("选择", "a choice")],
    [c.isChoice],
    cx,
    NAMES_TOP,
    {
      align: "center",
      inline: false,
      alpha: a
    }
  );
  person(cx, OWNER_Y + 4, {
    color: P.authority,
    alpha: a * ramp(t, c.owner - 0.15, 0.4),
    size: 0.9
  });
  nameText(L("决策负责人", "Decision owner"), cx, OWNER_Y + 36 + NAME_GAP, {
    valign: "top",
    alpha: a * named(t, c.owner)
  });
}

// picture/film/scenes/p03/close.js
var MEET = { x: 960, y: 470, k: 1.8 };
var COURSE = [300, 1620];
var COURSE_Y = MEET.y + 7 * MEET.k;
var STATION_R = 11;
var AGENDA = () => L(["决定什么", "谁决定", "哪些事实"], ["What to decide", "Who decides", "Which facts"]);
var at = (x, y) => [MEET.x + (x - MEET.x) * MEET.k, MEET.y + (y - MEET.y) * MEET.k];
function stageMeeting(t, a, c) {
  const vt = voiceTime(t), { x, y, k } = MEET, decision = a * ramp(t, c.decision - 0.15, 0.4), doer = a * ramp(t, c.whoDoes - 0.15, 0.4);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.translate(-x, -y);
  meetingMark(x, y, { alpha: a, seats: [0, 0] });
  ring(x - 40, y + 56, 11, { color: P.authority, alpha: decision, width: 3 });
  dot(x - 40, y + 56, 3.5, { color: P.authority, alpha: decision });
  people([x + 40], y + 61, { alpha: doer });
  ctx.restore();
  const top = at(x, y - 10 - 14 - 2.15 * 9)[1], half = at(x + 86, y)[0] - x;
  nameText(L("那场会", "The meeting"), x, top - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, c.meeting)
  });
  stroke(
    () => {
      ctx.moveTo(COURSE[0], COURSE_Y);
      ctx.lineTo(x - half - 6, COURSE_Y);
      ctx.moveTo(x + half + 6, COURSE_Y);
      ctx.lineTo(COURSE[1], COURSE_Y);
    },
    { color: P.line, alpha: a, width: 4 }
  );
  const q = vt * 0.2 % 1;
  flowDot(mix(COURSE[0], COURSE[1], q), COURSE_Y, 5, q, { color: P.ink, alpha: a });
  const before = a * ramp(t, c.before - 0.15, 0.4), over = COURSE_Y - STATION_R - NAME_GAP, under = COURSE_Y + STATION_R + NAME_GAP;
  station(COURSE[0], COURSE_Y, before);
  nameText(L("会前", "Before it"), COURSE[0], over, {
    valign: "bottom",
    alpha: a * named(t, c.before)
  });
  AGENDA().forEach(
    (v, i) => nameText(v, COURSE[0], under + i * 46, {
      valign: "top",
      alpha: a * listIn(t, c.items, i),
      set: "agenda"
    })
  );
  const ends = a * ramp(t, c.ends - 0.15, 0.4);
  station(COURSE[1], COURSE_Y, ends);
  nameText(L("散会时", "When it ends"), COURSE[1], over, {
    valign: "bottom",
    alpha: a * named(t, c.ends)
  });
  const [dx, dy] = at(x - 40, y + 56), [px] = at(x + 40, y + 61);
  nameText(L("决定", "A decision"), dx - 11 * k - NAME_GAP, dy, {
    align: "right",
    alpha: a * named(t, c.decision)
  });
  growName(
    t,
    L(["谁去做、", "什么时候做完"], ["Who does what"]),
    L([c.whoDoes, c.byWhen], [c.whoDoes]),
    px + 14 * k + NAME_GAP,
    dy,
    { valign: "middle", build: true, alpha: a }
  );
  const missing = a * ramp(t, c.missing - 0.15, 0.4), openY = COURSE_Y + 110;
  link(COURSE[1], COURSE_Y + STATION_R + 2, COURSE[1], openY - 24, {
    alpha: missing,
    upto: soon(t, c.missing + 0.05, 0.4),
    width: 2.5
  });
  openMark(COURSE[1], openY, 20, { alpha: missing, turn: vt * 0.6 });
  nameText(L("还缺什么", "Still missing"), COURSE[1], openY + 20 + NAME_GAP, {
    valign: "top",
    alpha: a * named(t, c.missing)
  });
}
function station(x, y, alpha) {
  if (alpha < 0.01) return;
  dot(x, y, STATION_R, { color: P.ground, alpha });
  ring(x, y, STATION_R, { color: P.ink, alpha, width: 3 });
}
var TOP = 300;
var DIVIDER = [TOP - 56, TOP + 56];
var CONFLICT_Y = DIVIDER[1] + 56;
var MID = 590;
var RAIL3 = MID + 60;
var MID_NAMES = RAIL3 + NAME_GAP;
var SIDES2 = [600, 1320];
var BARS = [944, 976];
function stageApart(t, a, c) {
  line(SIDES2[0] - 60, RAIL3, SIDES2[1] + 60, RAIL3, { color: P.line, alpha: a, width: 2.5 });
  seal(SIDES2[0], TOP, 46, { alpha: a });
  recordMark(SIDES2[1], TOP, 88, 112, { alpha: a });
  [
    [L("行动依据", "Authority to act"), L("谁可以决定做什么", "who may decide"), -1],
    [
      L("事实依据", "Authority about facts"),
      L("靠什么认定一件事是真的", "what can establish truth"),
      1
    ]
  ].forEach(([term, qual, side]) => {
    const { height } = termRowLayout([term], [qual], Infinity, false);
    termRow(
      t,
      [term],
      [-Infinity],
      [qual],
      [-Infinity],
      side < 0 ? SIDES2[0] - 46 - NAME_GAP : SIDES2[1] + 44 + NAME_GAP,
      TOP - height / 2,
      { align: side < 0 ? "right" : "left", inline: false, alpha: a }
    );
  });
  const ways = a * ramp(t, c.substitute - 0.15, 0.4), reach = soon(t, c.substitute + 0.05, 0.5), rise = soon(t, c.substitute + 0.05, 0.6);
  if (rise > 0)
    line(960, DIVIDER[1], 960, mix(DIVIDER[1], DIVIDER[0], rise), {
      color: P.line,
      alpha: a * Math.min(1, rise * 3),
      width: 3
    });
  line(SIDES2[0] + 52, TOP, mix(SIDES2[0] + 52, BARS[0], reach), TOP, { alpha: ways, width: 2.5 });
  line(SIDES2[1] - 50, TOP, mix(SIDES2[1] - 50, BARS[1], reach), TOP, { alpha: ways, width: 2.5 });
  BARS.forEach(
    (bx) => bar(bx, TOP, { alpha: ways * (reach > 0.95 ? 1 : 0), vertical: true, length: 34 })
  );
  rejectedName(L("替代", "Substitution"), 960, DIVIDER[0] - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, c.substitute),
    mark: ramp(t, c.substitute + 0.05, 0.3)
  });
  const falseOn = a * ramp(t, c.falseTrue - 0.15, 0.4), stop = TOP + 150;
  line(SIDES2[0], TOP + 50, SIDES2[0], mix(TOP + 50, stop - 6, soon(t, c.falseTrue + 0.05, 0.5)), {
    alpha: falseOn,
    width: 2.5
  });
  bar(SIDES2[0], stop, { alpha: falseOn * ramp(t, c.falseTrue + 0.45, 0.2) });
  dashedPage(SIDES2[0], MID, 84, 104, { alpha: falseOn });
  nameText(L("假的事实", "A false fact"), SIDES2[0], MID_NAMES, {
    valign: "top",
    alpha: a * named(t, c.falseTrue)
  });
  const actOn = a * ramp(t, c.permission - 0.15, 0.4);
  const stop2 = stop - 36;
  line(SIDES2[1], TOP + 60, SIDES2[1], mix(TOP + 60, stop2 - 6, soon(t, c.permission + 0.05, 0.5)), {
    alpha: actOn,
    width: 2.5
  });
  bar(SIDES2[1], stop2, { alpha: actOn * ramp(t, c.permission + 0.45, 0.2), length: 34 });
  const q = voiceTime(t) * 0.4 % 1;
  [
    [SIDES2[0], TOP + 50, c.falseTrue],
    [SIDES2[1], TOP + 60, c.permission, stop2]
  ].forEach(([wx, from, at2, end = stop]) => {
    if (t > at2 + 0.6) flowDot(wx, mix(from, end - 8, q), 4.5, q, { color: P.line, alpha: a });
  });
  actionMark(SIDES2[1], MID, { alpha: actOn });
  nameText(L("去做的权限", "Permission to act"), SIDES2[1], MID_NAMES, {
    valign: "top",
    alpha: a * named(t, c.permission)
  });
  const conflict = a * ramp(t, c.conflict - 0.15, 0.4);
  line(960, DIVIDER[1], 960, mix(DIVIDER[1], CONFLICT_Y - 12, soon(t, c.conflict + 0.05, 0.4)), {
    alpha: conflict,
    width: 3
  });
  conflictMark(960, CONFLICT_Y, { alpha: conflict });
  nameText(L("冲突", "Conflict"), 960 + 22 + NAME_GAP, CONFLICT_Y, {
    align: "left",
    alpha: a * named(t, c.conflict)
  });
  const report = a * ramp(t, c.report - 0.15, 0.4);
  link(960, CONFLICT_Y + 12, 960, MID - 36, {
    alpha: report,
    upto: soon(t, c.report + 0.05, 0.5),
    width: 2.5
  });
  reportMark(960, MID, { alpha: report });
  nameText(L("冲突和影响", "The conflict and its impact"), 960, MID_NAMES, {
    valign: "top",
    alpha: a * named(t, c.report)
  });
  const refused = [c.alter, c.oneSide];
  L(["改记录", "悄悄照一边做"], ["Altering the record", "Silently acting for one side"]).forEach(
    (v, i) => rejectedName(v, 960, MID_NAMES + 58 + i * 44, {
      valign: "top",
      alpha: a * listIn(t, refused, i),
      mark: ramp(t, refused[i] + 0.05, 0.3),
      set: "refused"
    })
  );
}

// picture/film/scenes/p03/facts.js
var ROW_Y3 = 395;
var RECORDS_X = [840, 1080];
var STATE_Y = 518;
var BAR_Y = 604;
var JOIN_Y = 640;
var LEADS_Y = 700;
var LEAD_HALF = 22;
var LEAD_GAP = 44;
var STATE = () => L(["来源、", "时间、", "对象、", "范围"], ["Source, ", "time, ", "subject, ", "scope"]);
function leadPlaces() {
  const widths = LEAD_ORDER().map((k) => Math.max(2 * LEAD_HALF, measure(L(...LEADS[k]), NOTE))), pitch = Math.max(130, ...widths.slice(1).map((w, i) => (widths[i] + w) / 2 + LEAD_GAP)), middle = (widths.length - 1) / 2;
  return { xs: widths.map((_, i) => 960 + (i - middle) * pitch), widths };
}
function stageFacts(t, a, c) {
  const records = a * ramp(t, c.primary - 0.15, 0.4), observed = a * ramp(t, c.observe - 0.15, 0.4), names = ROW_Y3 + 52 + NAME_GAP;
  recordMark(RECORDS_X[0], ROW_Y3, 84, 104, { alpha: records });
  nameText(L("原始记录", "Primary records"), RECORDS_X[0], names, {
    valign: "top",
    alpha: a * named(t, c.primary)
  });
  eye(RECORDS_X[1], ROW_Y3, { alpha: observed, repeat: 1, r: 34 });
  nameText(L("能重复的观察", "Observations"), RECORDS_X[1], names, {
    valign: "top",
    alpha: a * named(t, c.observe)
  });
  growName(t, STATE(), c.state, 960, STATE_Y, {
    size: NOTE,
    color: P.muted,
    align: "center",
    build: true,
    alpha: a
  });
  const { xs, widths } = leadPlaces();
  line(xs[0], JOIN_Y, xs.at(-1), JOIN_Y, { color: P.line, alpha: a, width: 2.5 });
  LEAD_ORDER().forEach((k, i) => {
    const on2 = a * ramp(t, c.leads[i] - 0.15, 0.4);
    line(xs[i], JOIN_Y, xs[i], LEADS_Y - LEAD_HALF - 4, { color: P.line, alpha: on2, width: 2.5 });
    leadMark(k, xs[i], LEADS_Y, { alpha: on2 });
    nameText(L(...LEADS[k]), xs[i], LEADS_Y + LEAD_HALF + 16, {
      valign: "top",
      size: NOTE,
      alpha: a * listIn(t, c.leads, i),
      set: "leads"
    });
  });
  const meet = soon(t, c.notPrimary + 0.05, 0.7);
  if (meet > 0) {
    line(960, JOIN_Y, 960, JOIN_Y - (JOIN_Y - BAR_Y - 4) * meet, {
      color: P.line,
      alpha: a * Math.min(1, meet * 3),
      width: 2.5
    });
    bar(960, BAR_Y, { alpha: a * ramp(t, c.notPrimary + 0.6, 0.3), length: 56 });
  }
  if (meet >= 1) {
    const q = voiceTime(t) * 0.35 % 1;
    flowDot(960, mix(JOIN_Y, BAR_Y + 8, q), 5, q, { color: P.line, alpha: a });
  }
  const under = LEADS_Y + LEAD_HALF + 16 + 25 + 14, on = a * soon(t, c.onlyLeads - 0.1, 0.5);
  if (on > 0.01) {
    const half = Math.max(...xs.map((x, i) => Math.abs(x - 960) + widths[i] / 2));
    stroke(
      () => {
        ctx.moveTo(960 - half, under - 8);
        ctx.lineTo(960 - half, under);
        ctx.lineTo(960 + half, under);
        ctx.lineTo(960 + half, under - 8);
      },
      { color: P.line, alpha: on, width: 2 }
    );
  }
  nameText(L("线索", "Leads"), 960, under + NAME_GAP - 6, {
    valign: "top",
    alpha: a * named(t, c.onlyLeads)
  });
}

// picture/film/scenes/p03/kinds.js
var KINDS = { left: 560, right: 1360, y: 490, name: 350 };
var SEAL_R = 58;
var RECORD = [110, 140];
function twoKinds(s, t, a, c, { facts = false } = {}) {
  const g = a * clearOfTitle(s, t, KINDS.name - 30), on = g * ramp(t, s.voice_start - 0.4, 0.35), fork2 = KINDS.name + 16, joint = fork2 + 24, names = Math.max(KINDS.y + SEAL_R, KINDS.y + RECORD[1] / 2) + NAME_GAP;
  nameText(L("两种依据", "Two kinds of authority"), 960, KINDS.name, {
    valign: "bottom",
    alpha: g * (facts ? 1 : named(t, c.two) * (1 - ramp(t, c.act - 0.15, 0.4)))
  });
  const q = voiceTime(t) * 0.3 % 1;
  [KINDS.left, KINDS.right].forEach(
    (x) => flowDot(mix(960, x, q), joint, 4.5, q, { color: P.line, alpha: on })
  );
  stroke(
    () => {
      ctx.moveTo(960, fork2);
      ctx.lineTo(960, joint);
      ctx.moveTo(KINDS.left, KINDS.y - SEAL_R - 4);
      ctx.lineTo(KINDS.left, joint);
      ctx.lineTo(KINDS.right, joint);
      ctx.lineTo(KINDS.right, KINDS.y - RECORD[1] / 2 - 4);
    },
    { color: P.line, alpha: on, width: 2.5 }
  );
  seal(KINDS.left, KINDS.y, SEAL_R, { alpha: on });
  recordMark(KINDS.right, KINDS.y, ...RECORD, { alpha: on });
  const rise = facts ? 1 : soon(t, c.apart + 0.05, 0.6);
  if (rise > 0)
    line(960, KINDS.y + 110, 960, KINDS.y + 110 - 190 * rise, {
      color: P.line,
      alpha: g * Math.min(1, rise * 3),
      width: 3
    });
  termRow(
    t,
    [L("行动依据", "Authority to act")],
    [facts ? -Infinity : c.act],
    [L("谁可以决定做什么", "who may decide")],
    [facts ? -Infinity : c.who],
    KINDS.left,
    names,
    { align: "center", inline: false, alpha: g }
  );
  if (facts)
    termRow(
      t,
      [L("事实依据", "Authority about facts")],
      [c.facts],
      [L("靠什么认定一件事是真的", "what can establish truth")],
      [c.what],
      KINDS.right,
      names,
      { align: "center", inline: false, alpha: g }
    );
}

// picture/film/scenes/p03/order.js
var HEAD_Y = 300;
var SEAL_R2 = 46;
var ROWS = [420, 510, 600, 690];
var TO_NAMES = 34;
var OWNER = { dx: -38, size: 0.55 };
var RANKS = () => L(
  [
    "法律、监管、安全要求和公司的强制性制度",
    "决策负责人作出的明确决定",
    "有效的契约、制度、规范、决策记录",
    "工作计划、临时约定、个人偏好"
  ],
  [
    "Law, regulation, security, mandatory policy",
    "The explicit decision of the decision owner",
    "Contracts, policies, specifications, decision records",
    "Plans, provisional agreements, personal preferences"
  ]
);
var HEAD = () => L("行动依据", "Authority to act");
var QUESTION = () => L("谁可以决定做什么", "who may decide");
function spineX() {
  const left = OWNER.dx - 1.55 * 15 * OWNER.size, head = SEAL_R2 + NAME_GAP + Math.max(measure(HEAD()), measure(QUESTION(), NOTE)), rights = RANKS().map((v) => TO_NAMES + measure(v)), shifts = rights.map((_, k) => 960 - (left + Math.max(head, ...rights.slice(0, k + 1))) / 2);
  return (Math.max(...shifts) + Math.min(...shifts)) / 2;
}
function stageOrder(t, a, c) {
  const x = spineX(), grow = soon(t, c.order + 0.05, 0.5), top = HEAD_Y + SEAL_R2 + 4;
  seal(x, HEAD_Y, SEAL_R2, { alpha: a });
  termRow(t, [HEAD()], [-Infinity], [QUESTION()], [-Infinity], x + SEAL_R2 + NAME_GAP, HEAD_Y - 32, {
    align: "left",
    inline: false,
    alpha: a
  });
  line(x, top, x, top + (ROWS[3] - top) * grow, { color: P.line, alpha: a, width: 4 });
  const q = voiceTime(t) * 0.22 % 1;
  if (grow >= 1) flowDot(x, mix(top, ROWS[3], q), 5, q, { color: P.authority, alpha: a });
  RANKS().forEach((v, k) => {
    const on = a * ramp(t, c.ranks[k] - 0.15, 0.4);
    dot(x, ROWS[k], 7, { color: P.ink, alpha: on });
    nameText(v, x + TO_NAMES, ROWS[k], {
      align: "left",
      alpha: a * listIn(t, c.ranks, k),
      set: "ranks"
    });
    if (k === 1)
      person(x + OWNER.dx, ROWS[k] + 8, { size: OWNER.size, color: P.authority, alpha: on });
  });
}

// picture/film/scenes/p03/scene.js
var checked = (s) => cue(s, "查过发布时间", "checks the publication time");
function cuesOf3(s) {
  const c = {
    two: cue(s, "两种依据", "Two kinds of authority"),
    apart: cue(s, "分开看", "stay apart"),
    act: cue(s, "行动依据", "Authority to act"),
    who: cue(s, "谁可以决定", "who may decide"),
    // The order opens on 03.3's first words. Its span grows on 「有先后」, where the Chinese announces the order; the
    // English announces it in 03.2, so there the span grows on the first rank.
    opens: cue(s, "它有先后", "Law"),
    order: cue(s, "有先后", "Law"),
    ranks: [
      cue(s, "最先是法律", "Law"),
      cue(s, "才是这件事", "the explicit decision"),
      cue(s, "有效的契约", "contracts"),
      cue(s, "工作计划", "Plans")
    ],
    another: cue(s, "另一种", "Authority about facts"),
    facts: cue(s, "事实依据", "Authority about facts"),
    what: cue(s, "靠什么认定", "what can establish"),
    primary: cue(s, "要看原始记录", "primary records"),
    observe: cue(s, "能重复的观察", "repeatable observations"),
    state: [
      cue(s, "来源", "a source"),
      cue(s, "时间对象", "time"),
      cue(s, "对象和范围", "subject"),
      cue(s, "范围转述", "scope")
    ],
    leads: LEAD_ORDER().map((k) => cue(s, ...LEADS[k])),
    notPrimary: cue(s, "都不是原始记录", "are not primary records"),
    onlyLeads: cue(s, "线索", "leads")
  };
  return { ...c, ...caseCues(s), ...closeCues(s) };
}
function caseCues(s) {
  const choice = cue(s, "要不要换供应商", "Whether to change vendors");
  return {
    night: cue(s, "拿昨晚的事来说", "Take last night"),
    lastNight: cue(s, "昨晚", "last night"),
    collection: cue(s, "采集", "The collection"),
    late: cue(s, "晚了两个小时", "two hours late"),
    log: cue(s, "日志", "the log"),
    fact: cue(s, "这是事实", "that is a fact"),
    vendorLate: cue(s, "供应商发布晚了", "the vendor published late"),
    hypothesis: cue(s, "假设", "a hypothesis"),
    checks: cue(s, "查过发布时间", "checks the publication time"),
    observation: cueFrom(s, "观察", "observation", checked(s)),
    refute: cue(s, "推翻", "refute"),
    choice,
    isChoice: cue(s, "选择", "a choice"),
    owner: cueFrom(s, "决策负责人", "decision owner", choice)
  };
}
function closeCues(s) {
  return {
    meeting: cue(s, "前面说的那场会", "The meeting at the start"),
    before: cue(s, "会前", "Before it"),
    items: [
      cue(s, "要决定什么", "what is to be decided"),
      cue(s, "由谁决定", "who decides"),
      cue(s, "需要哪些事实", "which facts")
    ],
    ends: cue(s, "散会时", "When it ends"),
    decision: cue(s, "有了决定", "reach a decision"),
    whoDoes: cue(s, "谁去做", "who does what"),
    byWhen: cue(s, "什么时候做完", "by when"),
    missing: cue(s, "还缺什么", "still missing"),
    neither: cue(s, "两种依据不能", "Neither kind"),
    substitute: cue(s, "互相替代", "stands in for"),
    falseTrue: cue(s, "假的变成真的", "false fact"),
    permission: cue(s, "去做的权限", "permission to act"),
    conflict: cue(s, "两者冲突时", "When the two conflict"),
    report: cue(s, "讲出冲突和影响", "report the conflict"),
    alter: cue(s, "不改记录", "alter the record"),
    oneSide: cue(s, "其中一边", "one side")
  };
}
scenes["03"] = function(s, t) {
  const c = cuesOf3(s);
  const A5 = stageOut(t, c.opens), B6 = stageIn(t, c.opens) * stageOut(t, c.another), C1 = stageIn(t, c.another) * stageOut(t, c.primary), C22 = stageIn(t, c.primary) * stageOut(t, c.night), D3 = stageIn(t, c.night) * stageOut(t, c.meeting), E4 = stageIn(t, c.meeting) * stageOut(t, c.neither), F3 = stageIn(t, c.neither);
  if (A5 > 0) twoKinds(s, t, A5, c);
  if (B6 > 0) stageOrder(t, B6, c);
  if (C1 > 0) twoKinds(s, t, C1, c, { facts: true });
  if (C22 > 0) stageFacts(t, C22, c);
  if (D3 > 0) stageCase(t, D3, c);
  if (E4 > 0) stageMeeting(t, E4, c);
  if (F3 > 0) stageApart(t, F3, c);
  illustrative(Math.max(D3, E4));
};

// picture/film/scenes/p04/marks.js
function sidesOf(cx, cy, w, h, gap) {
  const l = cx - w / 2, r = cx + w / 2, t = cy - h / 2, b = cy + h / 2;
  return [
    [
      [l + gap, t],
      [r - gap, t]
    ],
    [
      [r, t + gap],
      [r, b - gap]
    ],
    [
      [r - gap, b],
      [l + gap, b]
    ],
    [
      [l, b - gap],
      [l, t + gap]
    ]
  ];
}
function field(cx, cy, w, h, { alpha = 1, drawn = [1, 1, 1, 1], lit = [0, 0, 0, 0], gap = 16, width = 4 } = {}) {
  if (alpha < 0.01) return;
  const sides = sidesOf(cx, cy, w, h, gap), shown = sides.map((_, k) => k).filter((k) => drawn[k] > 0);
  const paint = (ks, color) => {
    if (!ks.length) return;
    stroke(
      () => ks.forEach((k) => {
        const [[x0, y0], [x1, y1]] = sides[k], q = clamp(drawn[k]);
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q);
      }),
      { color, alpha, width }
    );
  };
  paint(
    shown.filter((k) => lit[k] <= 1e-3),
    P.line
  );
  paint(
    shown.filter((k) => lit[k] >= 0.999),
    P.authority
  );
  shown.filter((k) => lit[k] > 1e-3 && lit[k] < 0.999).forEach((k) => paint([k], blend(P.line, P.authority, lit[k])));
}
function fieldRow(xs, cy, s, { alpha = 1, lit = 0, gap = 12 } = {}) {
  if (alpha < 0.01) return;
  stroke(
    () => xs.forEach(
      (x) => sidesOf(x, cy, s, s, gap).forEach(([[x0, y0], [x1, y1]]) => {
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      })
    ),
    { color: blend(P.line, P.authority, lit), alpha, width: 4 }
  );
}
function fieldIcon(cx, cy, s, k, { alpha = 1 } = {}) {
  field(cx, cy, s, s, {
    alpha,
    lit: [0, 1, 2, 3].map((i) => i === k ? 1 : 0),
    gap: 5,
    width: 3.5
  });
}
function tierDoc(cx, cy, w, h, { alpha = 1, color = P.ink, rows = 3 } = {}) {
  if (alpha < 0.01) return;
  const x = cx - w / 2, y = cy - h / 2;
  documentIcon(x, y, w, h, { alpha, stroke: color, rows: 0 });
  stroke(
    () => {
      for (let i = 0; i < rows; i++) {
        const ry = y + h * (0.3 + i * 0.55 / Math.max(1, rows));
        ctx.moveTo(x + w * 0.14, ry);
        ctx.lineTo(x + w * (i % 2 ? 0.62 : 0.82), ry);
      }
    },
    { color: P.muted, alpha: alpha * 0.8, width: 2 }
  );
}
function lens(cx, cy, r, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  ring(cx, cy, r, { color: P.evidence, alpha, width: 4 });
  line(cx + r * 0.72, cy + r * 0.72, cx + r * 1.35, cy + r * 1.35, {
    color: P.evidence,
    alpha,
    width: 6
  });
}
function speaker(cx, cy, { alpha = 1, agent: agent2 = false } = {}) {
  if (alpha < 0.01) return;
  if (agent2) {
    stroke(
      () => {
        ctx.moveTo(cx, cy - 20);
        ctx.lineTo(cx + 20, cy);
        ctx.lineTo(cx, cy + 20);
        ctx.lineTo(cx - 20, cy);
        ctx.closePath();
      },
      { color: P.evidence, alpha, width: 2.5 }
    );
    dot(cx, cy, 4, { color: P.evidence, alpha });
  } else {
    dot(cx, cy - 14, 11, { color: P.ink, alpha });
    stroke(() => ctx.arc(cx, cy + 14, 17, Math.PI * 1.08, Math.PI * 1.92), {
      color: P.ink,
      alpha,
      width: 3
    });
  }
  const bx = cx + 26, by = cy - 28;
  fill(() => ctx.roundRect(bx, by - 11, 30, 22, 7), { color: P.row, alpha });
  box(bx, by - 11, 30, 22, { stroke: P.muted, alpha, radius: 7, width: 2.5 });
}

// picture/film/scenes/p04/lines.js
var FIELD = { y: 480, h: 440 };
var TOP2 = FIELD.y - FIELD.h / 2;
var ROWS2 = () => L(
  [
    ["说真话", ["不编造、", "隐瞒、", "挑着说，", "不把没把握说成有把握"]],
    ["守边界", ["对象和时间、", "能力和权限，", "数据、", "安全、", "合规和行动"]],
    ["责任落到人", ["重要的判断、", "决定、", "变更和验收"]],
    ["不虚报完成", ["做完、", "做对、", "能用、", "有人在用，", "要有当前的、", "对得上的证据"]]
  ],
  [
    [
      "Telling the truth",
      ["no fabrication, ", "hiding, ", "cherry-picking ", "or false certainty"]
    ],
    [
      "Staying in bounds",
      [
        "subject, time, ",
        "competence, permission, ",
        "data, ",
        "security, ",
        "compliance, ",
        "action"
      ]
    ],
    ["Naming the owner", ["every important judgment, ", "decision, change ", "and acceptance"]],
    [
      "No false completion",
      ["without current evidence: ", "not complete, correct, usable, adopted"]
    ]
  ]
);
var B = { pitch: 100, icon: 34, toText: 26, margin: 64 };
function stageLines(t, a, c) {
  const rows = ROWS2(), widest = Math.max(...rows.flatMap(([v, q]) => [measure(v), measure(q.join(""), NOTE)])), rowHeight = Math.max(...rows.map(([v, q]) => termRowLayout([v], q, Infinity, false).height)), span = B.icon + B.toText + widest, height = 3 * B.pitch + rowHeight + 2 * B.margin, first = TOP2 + B.margin, iconX = 960 - span / 2 + B.icon / 2, textX = iconX + B.icon / 2 + B.toText;
  field(960, TOP2 + height / 2, span + 2 * B.margin, height, {
    alpha: a,
    lit: c.ordinals.map((at2) => ramp(t, at2 - 0.15, 0.4))
  });
  nameText(L("四条底线", "Four boundaries"), 960, TOP2 - NAME_GAP, {
    valign: "bottom",
    alpha: a
  });
  rows.forEach(([term, qual], k) => {
    const top = first + k * B.pitch;
    fieldIcon(iconX, top + rowHeight / 2, B.icon, k, {
      alpha: a * ramp(t, c.rows[k] - 0.15, 0.4)
    });
    termRow(t, [term], [c.rows[k]], qual, c.quals[k], textX, top, {
      align: "left",
      inline: false,
      build: true,
      set: "boundaries",
      alpha: a * listLevel(t, [...c.rows, c.listEnd], k)
    });
  });
}
var C = { y: TOP2 + 200, s: 400, pitch: 64 };
var CASES = () => L(
  ["自主、探索和创造", "停下来，讲出来，往上报"],
  ["Autonomy, exploration, creative work", "Halt, disclosure, escalation"]
);
function stageCases(t, a, c) {
  const names = CASES(), x = 960, right = x + C.s / 2, top = C.y - C.s / 2, under = C.y + C.s / 2 + NAME_GAP, vt = voiceTime(t), ats = [c.free, c.halt], level = (i) => listLevel(t, ats, i);
  field(x, C.y, C.s, C.s, { alpha: a, lit: [1, 1, 1, 1] });
  nameText(L("四条底线", "Four boundaries"), x, top - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, c.inside)
  });
  const free = a * ramp(t, c.inside - 0.15, 0.4);
  dot(x - 70 + 60 * Math.sin(vt * 0.9), C.y - 60 + 45 * Math.sin(vt * 1.3), 8, {
    color: P.ink,
    alpha: free * level(0)
  });
  nameText(names[0], x, under, {
    valign: "top",
    alpha: a * listIn(t, ats, 0),
    set: "cases"
  });
  const near = a * ramp(t, c.near - 0.15, 0.4), halted = soon(t, c.near + 0.05, 0.7), hx = mix(x + 40, right - 34, halted), hy = C.y;
  dot(hx, hy, 8, { color: P.ink, alpha: near * level(1) });
  ring(hx, hy, 17, {
    color: P.authority,
    alpha: near * level(1) * ramp(t, c.halt - 0.1, 0.4),
    width: 3
  });
  const rise = soon(t, c.halt + 0.4, 0.6);
  if (rise > 0)
    line(hx, hy - 17, hx, mix(hy - 17, top + 8, rise), { alpha: near * level(1), width: 2.5 });
  nameText(names[1], x, under + C.pitch, {
    valign: "top",
    alpha: a * listIn(t, ats, 1),
    set: "cases"
  });
}

// picture/film/naming/placement.js
var rowNameTop = (bottoms, gap = NAME_GAP) => Math.max(...bottoms) + gap;
var RAIL_CLEAR = 30;
var widestLine = (v, size) => Math.max(
  ...(Array.isArray(v) ? v : String(v).split("\n")).map((line2) => measure(line2, size))
);
function railNames(names, xs, y, {
  side = 1,
  gap = NAME_GAP + 18,
  size = LABEL,
  alpha = () => 1,
  color = () => P.ink,
  wrap = RAIL_WRAP,
  set = `rail:${names[0]}`
} = {}) {
  const widths = names.map((v) => widestLine(v, size));
  const room = (i) => 2 * Math.min(
    i ? xs[i] - xs[i - 1] - widths[i - 1] / 2 - RAIL_CLEAR : Infinity,
    i + 1 < xs.length ? xs[i + 1] - xs[i] - widths[i + 1] / 2 - RAIL_CLEAR : Infinity
  );
  names.forEach((v, i) => {
    const width = Math.min(wrap, room(i));
    nameText(v, xs[i], y + side * gap, {
      width,
      size,
      valign: side > 0 ? "top" : "bottom",
      align: "center",
      alpha: alpha(i),
      color: color(i),
      set
    });
  });
}
var RAIL_WRAP = 240;
function radialName(v, cx, cy, r, a, { gap = NAME_GAP, ry = r, width = 260, ...o } = {}) {
  const c = Math.cos(a), sn = Math.sin(a), x = cx + c * (r + gap), y = cy + sn * (ry + gap);
  const align = c > 0.3 ? "left" : c < -0.3 ? "right" : "center", valign = align === "center" ? sn > 0 ? "top" : "bottom" : "middle";
  return nameText(v, x, y, { align, valign, width, ...o });
}

// picture/film/scenes/p04/ladder.js
var WORK = () => L(
  [
    { term: ["局部、可逆"], qual: ["无对外承诺"] },
    { term: ["跨角色、做得久"], qual: ["几种方案、重大不确定"] },
    {
      term: ["生产、", "资金、", "敏感数据、", "安全合规"],
      qual: ["删除覆盖、", "对外承诺、", "不可逆"]
    }
  ],
  [
    { term: ["Local, reversible work"], qual: ["no external commitment"] },
    {
      term: ["Cross-role ", "or extended work"],
      qual: ["competing options, material uncertainty"],
      width: 260,
      noteWidth: Infinity
    },
    {
      term: ["Production, funds, sensitive data, ", "security or compliance"],
      qual: ["deletion, ", "overwrite, ", "external commitment, ", "irreversibility"],
      width: 490,
      noteWidth: 300
    }
  ]
);
var RECORD2 = () => L(
  [
    { term: ["一次讲清"], qual: ["结论、", "依据、", "做法"] },
    { term: ["现有的工作记录"], qual: ["问题、", "方案、", "做法、", "验收"] },
    { term: ["书面决定、", "明确授权"], qual: ["回滚或降级预案、", "独立评审、", "由人验收"] }
  ],
  [
    { term: ["One clear exchange"], qual: ["conclusion, ", "basis, ", "action"] },
    {
      term: ["Problem, ", "options, ", "execution path, ", "acceptance"],
      qual: ["existing work record"],
      width: 370,
      noteWidth: Infinity
    },
    {
      term: ["A written decision, ", "explicit authorization"],
      qual: ["a rollback or degradation path, ", "independent review, ", "human acceptance"],
      width: 310,
      noteWidth: 360
    }
  ]
);
var workTimes = (c) => [
  { term: [c.tiers[0]], qual: [c.tierQuals[0]] },
  { term: [c.tiers[1]], qual: [c.tierQuals[1]] },
  { term: [c.tiers[2], ...c.tierParts.term], qual: [c.tierQuals[2], ...c.tierParts.qual] }
];
var recordTimes = (c) => [
  { term: [c.oneClear], qual: [c.clearQual, ...c.clearParts] },
  {
    term: L([c.record], [c.recordQual, ...c.recordParts]),
    qual: L([c.recordQual, ...c.recordParts], [c.record])
  },
  { term: c.written.slice(0, 2), qual: c.written.slice(2) }
];
var HEAD2 = () => L(
  { top: "风险", left: "多少记录", right: "多少手续" },
  { top: "Risk", left: null, right: "Process" }
);
var TIER_Y = [330, 520, 720];
var DOCS = [
  [52, 66],
  [80, 102],
  [112, 144]
];
var SPINE = [236, 820];
var HEAD_GAP = 70;
var TO_WORK = 40;
var TO_DOC = 64;
var DOC_RIGHT = TO_DOC + DOCS[2][0];
var blockWidth = ({ term, qual, width = Infinity, noteWidth: noteWidth2 = width }) => Math.max(
  ...growTexts(term, width).map((line2) => line2.reduce((w, [, v]) => w + measure(v), 0)),
  ...growTexts(qual, noteWidth2, NOTE).map(
    (line2) => line2.reduce((w, [, v]) => w + measure(v, NOTE), 0)
  )
);
function spineX2(c) {
  const head = HEAD2(), top = measure(head.top) / 2, records = recordTimes(c), parts = [
    [
      c.risk,
      Math.max(top, head.left ? HEAD_GAP + measure(head.left) : 0),
      Math.max(top, HEAD_GAP + measure(head.right))
    ],
    ...WORK().map((row, k) => [c.tiers[k], TO_WORK + blockWidth(row), 0]),
    ...RECORD2().map((row, k) => [records[k].term[0], 0, DOC_RIGHT + NAME_GAP + blockWidth(row)])
  ].sort((p, q) => p[0] - q[0]);
  let left = 0, right = 0;
  const offsets = parts.map(([, l, r]) => {
    left = Math.max(left, l);
    right = Math.max(right, r);
    return (right - left) / 2;
  });
  return 960 - (Math.max(...offsets) + Math.min(...offsets)) / 2;
}
function stageLadder(t, a, c) {
  const x = spineX2(c), head = HEAD2(), top = SPINE[0];
  line(x, top, x, SPINE[1], { color: P.line, alpha: a, width: 4 });
  dot(x, top, 6, { color: P.line, alpha: a });
  dot(x, SPINE[1], 6, { color: P.line, alpha: a });
  nameText(head.top, x, top - 14 - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, L(c.riskWord, c.risk))
  });
  if (head.left)
    nameText(head.left, x - HEAD_GAP, top + 12, { align: "right", alpha: a * named(t, c.risk) });
  nameText(head.right, x + HEAD_GAP, top + 12, { align: "left", alpha: a * named(t, c.process) });
  const works = workTimes(c);
  WORK().forEach(({ term, qual, width = Infinity, noteWidth: noteWidth2 = width }, k) => {
    const y = TIER_Y[k], reaching = growTexts(term, width)[0].at(-1)[0], on = a * ramp(t, (works[k].term[reaching] ?? works[k].term[0]) - 0.15, 0.4);
    line(x - 10, y, x + 10, y, { color: P.ink, alpha: on, width: 4 });
    termRow(t, term, works[k].term, qual, works[k].qual, x - TO_WORK, y - 32, {
      align: "right",
      inline: false,
      width,
      noteWidth: noteWidth2,
      build: true,
      buildTerm: true,
      alpha: a
    });
  });
  const marked = c.tiers.reduce(
    (y, at2, k) => mix(y, TIER_Y[k], soon(t, at2 - 0.15, 0.4)),
    TIER_Y[0]
  );
  dot(x, marked, 6, { color: P.authority, alpha: a * ramp(t, c.tiers[0] - 0.15, 0.4) });
  const docRight = x + DOC_RIGHT, times = recordTimes(c);
  RECORD2().forEach(({ term, qual, width = Infinity, noteWidth: noteWidth2 = width }, k) => {
    const [w, h] = DOCS[k], at2 = times[k].term[0], on = a * ramp(t, at2 - 0.15, 0.4);
    tierDoc(docRight - w / 2, TIER_Y[k], w, h, { alpha: on, rows: 2 + k });
    termRow(t, term, times[k].term, qual, times[k].qual, docRight + NAME_GAP, TIER_Y[k] - 32, {
      align: "left",
      inline: false,
      width,
      noteWidth: noteWidth2,
      build: true,
      buildTerm: true,
      alpha: a
    });
  });
}
var E = {
  tierY: 350,
  nightY: 330,
  drop: L(64, 48),
  lean: 24,
  scale: 0.55,
  hours: [-1, 3],
  lens: 30,
  agent: 180
};
var FIX_Y = [318, 420];
var NIGHT_REACH = 2 * 99;
var FIX_TURN = 40;
var FIX_STEP = 24;
var BUBBLE = 39;
var EXAMINED = () => L(["事实、", "推理、", "变更、", "证据"], ["facts, ", "reasoning, ", "changes, ", "evidence"]);
var FIXES = () => L(["换供应商", "改生产环境里的采集任务"], ["A new vendor", "Collection job in production"]);
function stageReview(t, a, c) {
  const [w3, h3] = DOCS[2], lit = ramp(t, c.belongs - 0.15, 0.4), vt = voiceTime(t), tierY = E.tierY + E.drop, nightY = E.nightY + E.drop, work = WORK()[2], workTop = tierY + h3 / 2 + NAME_GAP, fixRoom = Math.max(...FIXES().map((v) => measure(v))) + 2 * NAME_GAP, nightAt = w3 / 2 + 10 + fixRoom + FIX_STEP + FIX_TURN + NIGHT_REACH, upperLeft = -Math.max(w3 / 2, blockWidth(work) / 2), tierX = 960 + E.lean - (upperLeft + nightAt + NIGHT_REACH) / 2;
  tierDoc(tierX, tierY, w3, h3, { alpha: a, color: blend(P.ink, P.authority, lit), rows: 4 });
  const { term, qual, width = Infinity, noteWidth: noteWidth2 = width } = work;
  const workBlock = termRow(t, term, [-Infinity], qual, [-Infinity], tierX, workTop, {
    align: "center",
    inline: false,
    width,
    noteWidth: noteWidth2,
    alpha: a
  });
  const night = lastNight(tierX + nightAt, nightY, E.scale, {
    alpha: a,
    card: 1,
    hours: E.hours,
    flow: vt * 0.25 % 1,
    names: { axis: { v: L("昨晚的事", "Last night's case"), alpha: named(t, c.lastCase) } }
  });
  FIXES().forEach((v, i) => {
    const y2 = FIX_Y[i] + E.drop, on = a * ramp(t, c.fixes[i] - 0.15, 0.4);
    link(night.left - 6, i ? nightY + 4 : nightY - 4, tierX + w3 / 2 + 10, y2, {
      route: "hvh",
      mid: night.left - FIX_TURN - i * FIX_STEP,
      alpha: on,
      upto: soon(t, c.fixes[i] + 0.05, 0.7),
      width: 2.5
    });
    nameText(v, (tierX + w3 / 2 + 10 + night.left - FIX_TURN - FIX_STEP) / 2, y2 - NAME_GAP + 6, {
      valign: "bottom",
      alpha: a * listIn(t, c.fixes, i),
      set: "fixes"
    });
  });
  const y = Math.max(660, workBlock.bottom + NAME_GAP + BUBBLE), names = rowNameTop([y + 18, y + 20]), r = E.lens, reviewName = L("独立评审", "Independent review"), authorName = L("作者", "Author"), agentName = L("智能体", "Agent"), account = L("自己怎么说", "Own account"), refusal = (measure(account) + 42) / 2, stop = E.agent + measure(agentName) / 2 + 2 * NAME_GAP + refusal, lensAt = stop + refusal + 2 * NAME_GAP + r, textAt = lensAt + r * 1.4 + NAME_GAP, reach = textAt + blockWidth({ term: [reviewName], qual: EXAMINED() }), authorX = tierX + nightAt + NIGHT_REACH - reach, agentX = authorX + E.agent, stopX = authorX + stop, lensX = authorX + lensAt;
  const review = a * ramp(t, c.review - 0.15, 0.4);
  lens(lensX, y, r, { alpha: review });
  termRow(t, [reviewName], [c.review], EXAMINED(), c.examined, authorX + textAt, y - 32, {
    align: "left",
    inline: false,
    build: true,
    alpha: a
  });
  const author = a * ramp(t, c.author - 0.15, 0.4), agent2 = a * ramp(t, c.agent - 0.15, 0.4);
  speaker(authorX, y, { alpha: author });
  nameText(authorName, authorX, names, { valign: "top", alpha: a * named(t, c.author) });
  speaker(agentX, y, { alpha: agent2, agent: true });
  nameText(agentName, agentX, names, { valign: "top", alpha: a * named(t, c.agent) });
  const own = a * ramp(t, c.own - 0.15, 0.4), way = soon(t, c.own + 0.05, 0.5);
  link(authorX + 24, y, agentX - 26, y, { alpha: own, upto: way, width: 2.5, end: false });
  link(agentX + 26, y, stopX - 8, y, { alpha: own, upto: way, width: 2.5, end: false });
  link(lensX - r - 6, y, stopX + 8, y, { alpha: own, upto: way, width: 2.5, end: false });
  bar(stopX, y, { alpha: own * ramp(t, c.own + 0.5, 0.2), vertical: true, length: 36 });
  rejectedName(account, stopX, names, {
    valign: "top",
    alpha: own,
    mark: ramp(t, c.own + 0.05, 0.3)
  });
}

// picture/film/scenes/p04/scene.js
var each = (zh, en2) => L(zh, en2)();
function cuesOf4(s) {
  const lastCase = cue(s, "昨晚的事", "Last night's case"), tiers = [
    cue(s, "局部", "Local"),
    cue(s, "跨角色", "Cross-role"),
    cue(s, "涉及生产", "Work touching production")
  ], oneClear = cue(s, "一次讲清", "one clear exchange"), recordQual = cue(s, "问题", "the problem");
  return {
    four: cue(s, "四条底线", "Four boundaries"),
    never: cue(s, "不能越过", "never be crossed"),
    // The ordinal that brings each boundary; the first, 04.2's first word, cuts the list's stage in.
    ordinals: [
      cue(s, "第一", "First"),
      cue(s, "第二", "Second"),
      cue(s, "第三", "Third"),
      cue(s, "第四", "Fourth")
    ],
    rows: [
      cue(s, "说真话", "tell the truth"),
      cue(s, "守边界", "stay in bounds"),
      cue(s, "责任落到人", "name the owner"),
      cue(s, "不虚报完成", "do not claim false completion")
    ],
    quals: [
      [
        cue(s, "不编造", "no fabrication"),
        cue(s, "不隐瞒", "no hiding"),
        cue(s, "不挑着说", "no cherry-picking"),
        cue(s, "没把握", "no uncertainty")
      ],
      [
        cue(s, "对象和时间", "subject"),
        cue(s, "能力和权限", "competence"),
        cue(s, "数据", "data"),
        ...each(
          () => [cue(s, "安全", ""), cue(s, "合规", "")],
          () => [cue(s, "", "security"), cue(s, "", "compliance"), cue(s, "", "action")]
        )
      ],
      [
        cue(s, "重要的判断", "every important judgment"),
        cue(s, "决定", "decision"),
        cue(s, "变更", "and acceptance")
      ],
      each(
        () => [
          cue(s, "做完了", ""),
          cue(s, "做对了", ""),
          cue(s, "能用了", ""),
          cue(s, "有人在用", ""),
          cue(s, "都要有当前", ""),
          cue(s, "对得上", "")
        ],
        () => [cue(s, "", "without current evidence"), cue(s, "", "call nothing complete")]
      )
    ],
    // The fourth boundary's last words, on which the list of the four counts as said.
    listEnd: cue(s, "证据", "adopted"),
    inside: cue(s, "在这四条底线之内", "Inside them"),
    free: cue(s, "自主", "autonomy"),
    near: cue(s, "快要越线时", "When an action would cross one"),
    halt: cue(s, "停下来", "stop"),
    ladder: cue(s, "要留多少记录", "Risk sets the process"),
    risk: cue(s, "多少记录", "Risk sets the process"),
    riskWord: cue(s, "看风险", "Risk sets the process"),
    process: cue(s, "多少手续", "the process"),
    tiers,
    tierQuals: [
      cue(s, "不对外承诺", "no external commitment"),
      cue(s, "几种方案", "competing options"),
      cue(s, "删除覆盖", "deletion")
    ],
    // The later parts of the highest tier's work, its term's and its qualifier's, each on its words; English sets its
    // term in its two lines.
    tierParts: each(
      () => ({
        term: [cue(s, "资金", ""), cue(s, "敏感数据", ""), cueFrom(s, "安全合规", "", tiers[2])],
        qual: [cueFrom(s, "对外承诺", "", tiers[2]), cue(s, "不可逆", "")]
      }),
      () => ({
        term: [cueFrom(s, "", "security", tiers[2])],
        qual: [
          cue(s, "", "overwrite"),
          cueFrom(s, "", "external commitment", tiers[2]),
          cue(s, "", "irreversible")
        ]
      })
    ),
    oneClear,
    clearQual: cue(s, "结论", "conclusion"),
    // The later parts of the first record's qualifier and of the second record's contents.
    clearParts: [cue(s, "依据", "basis"), cueFrom(s, "做法", "action", oneClear)],
    record: cue(s, "现有的工作记录", "existing work record"),
    recordQual,
    recordParts: [
      cueFrom(s, "方案", "options", recordQual),
      cueFrom(s, "做法", "execution path", recordQual),
      cueFrom(s, "验收", "acceptance", recordQual)
    ],
    written: [
      cue(s, "书面决定", "a written decision"),
      cue(s, "明确授权", "explicit authorization"),
      cue(s, "回滚", "a rollback"),
      cue(s, "独立评审", "independent review"),
      cue(s, "由人验收", "human acceptance")
    ],
    lastCase,
    fixes: [
      cue(s, "换供应商", "a new vendor"),
      cue(s, "改生产环境", "a change to the collection job")
    ],
    belongs: cue(s, "都属于这一类", "belongs here"),
    review: cueFrom(s, "独立评审", "Independent review", lastCase),
    examined: [
      cue(s, "实际的事实", "the actual facts"),
      cue(s, "推理", "reasoning"),
      cueFrom(s, "变更", "changes", lastCase),
      cueFrom(s, "证据", "evidence", lastCase)
    ],
    author: cue(s, "作者", "the author's"),
    agent: cue(s, "智能体", "the Agent's"),
    own: cue(s, "自己怎么说", "own account"),
    whatever: cue(s, "风险高低", "Whatever the risk"),
    duty: cue(s, "该尽的义务", "every duty")
  };
}
var A = { x: 960, y: FIELD.y, w: 520, h: FIELD.h };
function stageField(t, a, c) {
  field(A.x, A.y, A.w, A.h, {
    alpha: a,
    drawn: [0, 1, 2, 3].map((k) => soon(t, c.four - 0.15 + 0.08 * k, 0.3)),
    lit: [1, 1, 1, 1]
  });
  nameText(L("四条底线", "Four boundaries"), A.x, A.y - A.h / 2 - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, c.four)
  });
  const run = soon(t, c.never + 0.05, 0.7);
  dot(mix(A.x, A.x + A.w / 2 - 12, run), A.y, 8, {
    color: P.ink,
    alpha: a * ramp(t, c.four - 0.15, 0.3)
  });
}
var F = { xs: [600, 960, 1320], y: 480, s: 260 };
var DOCS2 = [
  [60, 76],
  [88, 112],
  [120, 152]
];
function stageDuty(t, a, c) {
  fieldRow(F.xs, F.y, F.s, { alpha: a, lit: ramp(t, c.duty - 0.15, 0.4) });
  F.xs.forEach((x, k) => tierDoc(x, F.y, ...DOCS2[k], { alpha: a, rows: 2 + k }));
  nameText(L("风险高低", "Every level of risk"), 960, F.y + F.s / 2 + NAME_GAP, {
    valign: "top",
    alpha: a * named(t, c.whatever)
  });
  nameText(L("该尽的义务", "Every duty"), 960, F.y - F.s / 2 - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, c.duty)
  });
}
scenes["04"] = function(s, t) {
  const c = cuesOf4(s);
  const SA = stageOut(t, c.ordinals[0]), SB = stageIn(t, c.ordinals[0]) * stageOut(t, c.inside), SC = stageIn(t, c.inside) * stageOut(t, c.ladder), SD = stageIn(t, c.ladder) * stageOut(t, c.lastCase), SE = stageIn(t, c.lastCase) * stageOut(t, c.whatever), SF = stageIn(t, c.whatever);
  if (SA > 0) stageField(t, SA, c);
  if (SB > 0) stageLines(t, SB, c);
  if (SC > 0) stageCases(t, SC, c);
  if (SD > 0) stageLadder(t, SD, c);
  if (SE > 0) stageReview(t, SE, c);
  if (SF > 0) stageDuty(t, SF, c);
  illustrative(SE);
};

// picture/film/scenes/p05/kit.js
var early = (t, clause, at2) => named(t, Math.max(clause - 0.2, at2 - 1.35));
var centring = (x0, x1) => 960 - (x0 + x1) / 2;
var flowOf2 = (t, speed = 0.35, offset = 0) => (voiceTime(t) * speed + offset) % 1;
function fileMark(x, y, { alpha = 1, w = 64, h = 80 } = {}) {
  documentIcon(x - w / 2, y - h / 2, w, h, { alpha, rows: 3 });
}
function chartMark(x, y, { alpha = 1, w = 96, h = 72 } = {}) {
  if (alpha < 0.01) return;
  box(x - w / 2, y - h / 2, w, h, { fill: P.row, stroke: P.ink, alpha, radius: 6, width: 2 });
  path(
    [
      [x - w * 0.34, y + h * 0.26],
      [x - w * 0.1, y + h * 0.02],
      [x + w * 0.1, y + h * 0.12],
      [x + w * 0.34, y - h * 0.26]
    ],
    { color: P.ink, alpha, width: 3 }
  );
}
function signalCurve(x, y, { alpha = 1, w = 110, h = 64 } = {}) {
  if (alpha < 0.01) return;
  line(x - w / 2, y + h / 2, x + w / 2, y + h / 2, { color: P.line, alpha, width: 2 });
  path(
    Array.from({ length: 13 }, (_, k) => {
      const q = k / 12;
      return [x - w / 2 + q * w, y + h / 2 - 8 - (h - 14) * (q * q * 0.8 + 0.12 * Math.sin(q * 9))];
    }),
    { color: P.ink, alpha, width: 3 }
  );
}
function targetMark(x, y, r, { alpha = 1, color = P.ink } = {}) {
  if (alpha < 0.01) return;
  ring(x, y, r, { color, alpha, width: 3 });
  ring(x, y, r * 0.58, { color, alpha, width: 2.5 });
  dot(x, y, r * 0.18, { color, alpha });
}
function openMark2(x, y, r = 15, { alpha = 1, turn = 0 } = {}) {
  if (alpha < 0.01) return;
  dot(x, y, r, { color: P.ground, alpha });
  ring(x, y, r, {
    color: P.unknown,
    alpha,
    width: 2.5,
    dash: [5, 5],
    start: -Math.PI / 2 + turn
  });
}
function patchMark2(x, y, s, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  box(x - s / 2, y - s / 2, s, s, { fill: P.row, stroke: P.ink, alpha, radius: 3, width: 2.5 });
  stroke(
    () => {
      ctx.moveTo(x - s * 0.28, y - s * 0.28);
      ctx.lineTo(x + s * 0.28, y + s * 0.28);
      ctx.moveTo(x + s * 0.28, y - s * 0.28);
      ctx.lineTo(x - s * 0.28, y + s * 0.28);
    },
    { color: P.muted, alpha, width: 2 }
  );
}
function bar2(x, y, { alpha = 1, length = 52, vertical = false, width = 4 } = {}) {
  if (vertical) line(x, y - length / 2, x, y + length / 2, { color: P.unknown, alpha, width });
  else line(x - length / 2, y, x + length / 2, y, { color: P.unknown, alpha, width });
}
function runPoint(points, q, { alpha = 1, color = P.unknown, r = 6 } = {}) {
  if (alpha < 0.01 || q <= 0) return;
  const legs = points.slice(1).map(([x, y], k2) => Math.hypot(x - points[k2][0], y - points[k2][1])), total = legs.reduce((a, b) => a + b, 0);
  let left = clamp(q) * total, k = 0;
  while (k < legs.length - 1 && left > legs[k]) left -= legs[k++];
  const u = legs[k] ? clamp(left / legs[k]) : 0, [x0, y0] = points[k], [x1, y1] = points[k + 1];
  dot(mix(x0, x1, u), mix(y0, y1, u), r, { color, alpha });
}
function missingPage(x, y, w, h, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  const c = Math.min(22, w * 0.2);
  stroke(
    () => {
      ctx.moveTo(x, y);
      ctx.lineTo(x + w - c, y);
      ctx.lineTo(x + w, y + c);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
    },
    { color: P.muted, alpha, width: 2.5, dash: [7, 7] }
  );
}

// picture/film/scenes/p05/data.js
var A2 = { top: 388, card: [300, 170], page: [120, 170], pageX: 620, cardX: 1210 };
var UNKNOWN_Y = 241;
var BAR_Y2 = 568;
var BUS_Y = 608;
var ROW_Y4 = 676;
var ROW_XS = [700, 960, 1220];
var UNKNOWN_XS = () => L([630, 850, 1070, 1290], [600, 840, 1080, 1320]);
function evidenceStage(s, t, c, g) {
  const [cw, ch] = A2.card, cardX = A2.cardX, page = g * named(t, c.evidence), mid = A2.top + ch / 2;
  tableIcon(cardX - cw / 2, A2.top, cw, ch, { alpha: g });
  missingPage(A2.pageX - A2.page[0] / 2, A2.top, A2.page[0], A2.page[1], { alpha: page });
  link(A2.pageX + A2.page[0] / 2 + 12, mid, cardX - cw / 2 - 12, mid, {
    alpha: g,
    dash: [8, 8],
    width: 2.5
  });
  nameText(L("数据", "Data"), cardX, A2.top - NAME_GAP, {
    valign: "bottom",
    alpha: g * named(t, c.first1)
  });
  nameText(L("证据", "Evidence"), A2.pageX, A2.top - NAME_GAP, { valign: "bottom", alpha: page });
  const rowAt = c.nonProofs, seen = (i) => g * ramp(t, rowAt[i] - 0.15, 0.4);
  fileMark(ROW_XS[0], ROW_Y4, { alpha: seen(0), h: 76 });
  chartMark(ROW_XS[1], ROW_Y4, { alpha: seen(1) });
  signalCurve(ROW_XS[2], ROW_Y4, { alpha: seen(2) });
  railNames(L(["文件", "图", "模型信号"], ["File", "Chart", "Model signal"]), ROW_XS, ROW_Y4, {
    gap: 38 + NAME_GAP,
    alpha: (i) => g * listIn(t, rowAt, i),
    set: "non-proofs"
  });
  const rise = soon(t, c.refuse - 0.1, 0.5), up = soon(t, c.refuse + 0.25, 0.45), shut = g * ramp(t, c.refuse + 0.55, 0.3);
  stroke(
    () => {
      for (const x of ROW_XS) {
        ctx.moveTo(x, ROW_Y4 - 40);
        ctx.lineTo(x, mix(ROW_Y4 - 40, BUS_Y, rise));
      }
      if (rise > 0.98) {
        ctx.moveTo(ROW_XS[0], BUS_Y);
        ctx.lineTo(ROW_XS[2], BUS_Y);
      }
    },
    { color: P.line, alpha: g * ramp(t, c.refuse - 0.15, 0.3), width: 2 }
  );
  if (up > 0)
    line(960, BUS_Y, 960, mix(BUS_Y, BAR_Y2 + 2, up), { color: P.line, alpha: g, width: 2 });
  bar2(960, BAR_Y2, { alpha: shut, length: 56 });
  const ats = c.unknowns;
  const uxs = UNKNOWN_XS();
  uxs.forEach((x, i) => openMark2(x, UNKNOWN_Y, 15, { alpha: g * ramp(t, ats[i] - 0.15, 0.4) }));
  railNames(
    L(
      ["含义", "质量", "使用权限", "复现"],
      ["Meaning", "Quality", "Permission", "Reproducibility"]
    ),
    uxs,
    UNKNOWN_Y,
    { gap: 15 + NAME_GAP, alpha: (i) => g * listIn(t, ats, i), set: "unknowns" }
  );
}
var A22 = { y: 505, card: [220, 140], cardX: 640, useX: 1300, r: 56 };
var USE = () => L("具体用途", "A specific use");
function fitShift() {
  const left = A22.cardX - A22.card[0] / 2, reach = A22.useX - A22.r - 12, whole = A22.useX + Math.max(A22.r, measure(USE()) / 2);
  return 960 - (2 * left + reach + whole) / 4;
}
function fitStage(s, t, c, g) {
  const [cw, ch] = A22.card, top = A22.y - ch / 2, use = g * named(t, c.use), shift = fitShift(), cardX = A22.cardX + shift, useX = A22.useX + shift;
  tableIcon(cardX - cw / 2, top, cw, ch, { alpha: g });
  nameText(L("数据", "Data"), cardX, top - NAME_GAP, { valign: "bottom", alpha: g });
  link(cardX + cw / 2 + 12, A22.y, useX - A22.r - 12, A22.y, {
    alpha: g,
    width: 3,
    flow: t > c.fit ? flowOf2(t, 0.4) : null
  });
  nameText(L("证明适合", "Shown fit"), (cardX + cw / 2 + useX - A22.r) / 2, A22.y - NAME_GAP, {
    valign: "bottom",
    alpha: g * named(t, c.fit)
  });
  targetMark(useX, A22.y, A22.r, { alpha: use });
  nameText(USE(), useX, top - NAME_GAP, {
    valign: "bottom",
    alpha: use
  });
  const sx = cardX + cw / 2, sy = top + ch, rim = g * named(t, c.trust), stamp = g * soon(t, Math.max(c.trust, c.use + 0.4) + 0.05, 0.5);
  dot(sx, sy, 27, { color: P.ground, alpha: rim });
  seal(sx, sy, 26, { color: P.evidence, alpha: rim, stamp, hollow: stamp < 0.5 });
  nameText(L("可信", "Trust"), sx + 26 + NAME_GAP, sy, { align: "left", alpha: rim });
}
var B2 = { x: 960, y: 505, rx: 400, ry: 245, card: [200, 128] };
var GAP = 0.09;
function ringArcs(upto, alpha) {
  if (alpha < 0.01 || upto <= 0) return;
  stroke(
    () => {
      for (let k = 0; k < 6; k++) {
        const q = Math.min(1, Math.max(0, upto * 6 - k));
        if (q <= 0) break;
        const a0 = -Math.PI / 2 + k * Math.PI / 3 + GAP, a1 = a0 + (Math.PI / 3 - 2 * GAP) * q;
        for (let j = 0; j <= 16; j++) {
          const a = a0 + (a1 - a0) * j / 16, x = B2.x + Math.cos(a) * B2.rx, y = B2.y + Math.sin(a) * B2.ry;
          if (j) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
      }
    },
    { color: P.line, alpha, width: 3.5 }
  );
}
function questionsStage(s, t, c, g) {
  const [cw, ch] = B2.card, top = B2.y - ch / 2;
  tableIcon(B2.x - cw / 2, top, cw, ch, { alpha: g });
  nameText(L("数据", "Data"), B2.x, top - NAME_GAP, { valign: "bottom", alpha: g });
  const six = g * early(t, c.sixClause, c.six);
  ringArcs(soon(t, c.sixClause - 0.2, 1.1), six);
  nameText(L("六个问题", "Six questions"), B2.x, top + ch + NAME_GAP, { valign: "top", alpha: six });
  const names = L(
    ["来源", "可用时间", "含义", "改动", "质量", "用途"],
    ["Origin", "Availability", "Meaning", "Changes", "Quality", "Use"]
  );
  c.asks.forEach((at2, i) => {
    const a = -Math.PI / 2 + i * Math.PI / 3, x = B2.x + Math.cos(a) * B2.rx, y = B2.y + Math.sin(a) * B2.ry, asked = g * ramp(t, at2 - 0.15, 0.4), lit = speaking(t, c.asks, i);
    dot(x, y, 13, { color: P.ground, alpha: asked });
    if (i === 1) {
      ring(x, y, 13, { color: P.evidence, alpha: asked, width: 2.5 });
      line(x, y, x, y - 8, { color: P.evidence, alpha: asked, width: 2.5 });
      line(x, y, x + 6, y + 3, { color: P.evidence, alpha: asked, width: 2.5 });
    } else dot(x, y, 12, { color: P.evidence, alpha: asked });
    if (lit > 0) ring(x, y, 22, { color: P.evidence, alpha: lit * 0.5 * g, width: 2 });
    radialName(names[i], B2.x, B2.y, B2.rx + 12, a, {
      ry: B2.ry + 12,
      alpha: g * listIn(t, c.asks, i),
      set: "questions"
    });
  });
}
var S = { w: 500, h: 285, card: [320, 160], inset: 18 };
var WORK2 = { below: 80, half: 20, icon: 56, toName: 62, gap: 64 };
var USES = () => L(["共享", "投产", "决策"], ["Shared", "Production", "Decision work"]);
function scopeTop() {
  const head = labelSize(LABEL) + NAME_GAP, first = S.h - head, whole = S.h + WORK2.below + WORK2.half - head;
  return 505 - (first + whole) / 4;
}
function workXs() {
  const widths = USES().map((v) => WORK2.icon / 2 + WORK2.toName + measure(v)), total = widths.reduce((a, b) => a + b, 0) + WORK2.gap * (widths.length - 1);
  let x = 960 - total / 2;
  return widths.map((w) => {
    const at2 = x + WORK2.icon / 2;
    x += w + WORK2.gap;
    return at2;
  });
}
function scopeStage(s, t, c, g) {
  const left = 960 - S.w / 2, top = scopeTop(), bottom = top + S.h, roam = g * soon(t, c.explore - 0.15, 0.6), dx = 26 * Math.sin(Math.PI * 2 * flowOf2(t, 0.22)) * roam, [cw, ch] = S.card, scope = g * early(t, c.scopeClause, c.scope);
  tableIcon(960 + dx - cw / 2, top + S.inset, cw, ch, { alpha: g, stroke: P.muted });
  const under = top + S.inset + ch + NAME_GAP, data = nameText(L("说不清这些的数据", "Data that cannot answer"), 960, under, {
    valign: "top",
    color: P.ink,
    alpha: g * named(t, c.first2b)
  });
  stroke(() => ctx.roundRect(left, top, S.w, S.h, 12), { color: P.line, alpha: g, width: 2.5 });
  nameText(L("授权范围", "Authorized scope"), left, top - NAME_GAP, {
    align: "left",
    valign: "bottom",
    alpha: scope
  });
  const out = g * ramp(t, c.staysOut - 0.15, 0.3);
  link(960, data.bottom + 10, 960, bottom - 4, {
    alpha: out,
    upto: soon(t, c.staysOut - 0.1, 0.6),
    end: false
  });
  bar2(960, bottom, { alpha: g * ramp(t, c.staysOut + 0.4, 0.3), length: 60 });
  nameText(L("证明适合", "Shown fit"), 960 + 30 + NAME_GAP, bottom + 10, {
    align: "left",
    valign: "top",
    alpha: g * named(t, c.fit2)
  });
  const uq = (i) => g * ramp(t, c.uses[i] - 0.15, 0.4), xs = workXs(), y = bottom + WORK2.below;
  person(xs[0] - 12, y + 10, { alpha: uq(0), size: 0.62 });
  person(xs[0] + 14, y + 10, { alpha: uq(0), size: 0.62, color: P.muted });
  tableIcon(xs[1] - 28, y - 20, 56, 40, { alpha: uq(1), rows: 3, cols: 2 });
  ring(xs[2], y, 16, { color: P.authority, alpha: uq(2), width: 3 });
  dot(xs[2], y, 5, { color: P.authority, alpha: uq(2) });
  USES().forEach(
    (v, i) => nameText(v, xs[i] + WORK2.toName, y, {
      align: "left",
      alpha: g * listIn(t, c.uses, i),
      set: "work"
    })
  );
}
var E2 = { card: [220, 130], top: 300, bus: 530, icon: 570, xs: [570, 830, 1090, 1350] };
function viewIcon(i, x, y, a) {
  if (i === 0) documentIcon(x - 34, y, 68, 88, { alpha: a, rows: 2 });
  else if (i === 1) {
    documentIcon(x - 34, y, 68, 88, { alpha: a, rows: 0 });
    stroke(
      () => {
        for (let k = 0; k < 4; k++) {
          ctx.moveTo(x - 20 + 4, y + 26 + k * 15);
          ctx.arc(x - 20, y + 26 + k * 15, 4, 0, Math.PI * 2);
          ctx.moveTo(x - 10, y + 26 + k * 15);
          ctx.lineTo(x + 20, y + 26 + k * 15);
        }
      },
      { color: P.muted, alpha: a, width: 2 }
    );
  } else if (i === 2) {
    stroke(
      () => {
        for (let k = 0; k < 3; k++) ctx.roundRect(x - 34, y + k * 30, 68, 24, 6);
      },
      { color: P.ink, alpha: a, width: 2.5 }
    );
  } else {
    documentIcon(x - 34, y + 12, 68, 76, { alpha: a, rows: 2 });
    diamond(x + 26, y + 10, 14, { color: P.evidence, alpha: a });
    dot(x + 26, y + 10, 3.5, { color: P.evidence, alpha: a });
  }
}
function viewsStage(s, t, c, g) {
  const [cw, ch] = E2.card, bottom = E2.top + ch, barY = bottom + 26, views = c.views, xs = E2.xs, reach = views.map((at2) => soon(t, at2 - 0.15, 0.6)), shown = views.map((at2) => g * ramp(t, at2 - 0.15, 0.4));
  tableIcon(960 - cw / 2, E2.top, cw, ch, { alpha: g });
  nameText(L("数据", "Data"), 960, E2.top - NAME_GAP, { valign: "bottom", alpha: g });
  stroke(
    () => {
      ctx.moveTo(960, bottom + 8);
      ctx.lineTo(960, E2.bus);
      ctx.moveTo(xs[0], E2.bus);
      ctx.lineTo(xs.at(-1), E2.bus);
      xs.forEach((x, i) => {
        const q = clamp((reach[i] - 0.5) * 2);
        if (q <= 0) return;
        ctx.moveTo(x, E2.bus);
        ctx.lineTo(x, mix(E2.bus, E2.icon - 2, q));
      });
    },
    { color: P.line, alpha: g, width: 2 }
  );
  xs.forEach((x, i) => {
    if (shown[i] > 0) viewIcon(i, x, E2.icon, shown[i]);
  });
  railNames(
    L(
      ["报告", "数据目录", "缓存", "智能体的摘要"],
      ["Report", "Catalog", "Cache", "Agent summary"]
    ),
    xs,
    E2.icon + 88,
    { gap: NAME_GAP, alpha: (i) => g * listIn(t, views, i), set: "views" }
  );
  bar2(960, barY, { alpha: g * ramp(t, c.become + 0.05, 0.3), length: 48 });
  runPoint(
    [
      [xs[3], E2.icon - 10],
      [xs[3], E2.bus],
      [960, E2.bus],
      [960, barY + 10]
    ],
    soon(t, c.become + 0.05, 1.4),
    { alpha: shown[3] }
  );
  const truth = g * named(t, c.truth), sx = 960 + cw / 2 + 48, sy = E2.top + ch / 2;
  seal(sx, sy, 26, { color: P.evidence, alpha: truth });
  nameText(L("权威来源", "Source of truth"), sx + 26 + NAME_GAP, sy, {
    align: "left",
    alpha: truth
  });
}

// picture/film/scenes/p05/night.js
var TEST = { gap: 30, h: 96 };
var TEST_ROOM = TEST.gap + TEST.h + NAME_GAP + labelSize(LABEL);
var CURVE = [0.25, 0.42, 0.34, 0.55, 0.47, 0.66, 0.58, 0.8, 0.72];
function nightNames(t, c) {
  return {
    card: { v: L("昨晚那份价格", "Last night's prices"), alpha: named(t, c.first3) },
    due: { v: L("平时", "Usual"), side: "left", alpha: named(t, c.usual) },
    arrival: { v: L("拿到的时间", "Arrival"), side: "right", alpha: named(t, c.measure) },
    late: { v: L("晚了两个小时", "Two hours later"), alpha: named(t, c.measure) }
  };
}
function backtest(t, c, g, m, top) {
  const x0 = m.at(-1), x1 = m.at(3), bottom = top + TEST.h, a = g * named(t, c.backtest), seen = soon(t, c.backtest - 0.1, 0.9), points = CURVE.map((v, i) => [
    x0 + (x1 - x0) * i / (CURVE.length - 1),
    bottom - 8 - v * (TEST.h - 16)
  ]);
  line(x0, bottom, x1, bottom, { color: P.line, alpha: a, width: 2 });
  path(points, { color: P.ink, alpha: a, width: 3, upto: seen });
  points.forEach(([x, y], i) => {
    const within = x > m.due + 1 && x < m.arrival - 1;
    dot(x, y, 6.5, {
      color: within ? P.unknown : P.evidence,
      alpha: a * ramp(seen, i / CURVE.length, 0.15)
    });
  });
  nameText(L("回测", "Backtest"), x0 - NAME_GAP, top + TEST.h / 2, { align: "right", alpha: a });
  const mark = g * named(t, c.later);
  line(m.arrival, top - 6, m.arrival, bottom, { color: P.authority, alpha: mark, width: 3 });
  nameText(L("晚到的时间", "That later time"), m.arrival, bottom + NAME_GAP, {
    valign: "top",
    alpha: mark
  });
}
function nightStage(s, t, c, g) {
  const names = nightNames(t, c), first = lastNightExtent(1, { card: 1, names: { card: names.card } }), e = lastNightExtent(1, { card: 1, due: 1, late: 1, names }), x = 960 - (e.left + e.right) / 2, y = 505 - (first.top + first.bottom + e.top + e.bottom + TEST_ROOM) / 4;
  const m = lastNight(x, y, 1, {
    alpha: g,
    card: soon(t, c.first3 - 0.15, 0.8),
    due: soon(t, c.usual - 0.1, 0.4),
    late: soon(t, c.measure + 0.05, 0.7),
    flow: t > c.later + 0.6 ? flowOf2(t, 0.25) : null,
    names
  });
  backtest(t, c, g, m, y + e.bottom + TEST.gap);
}
var D = { scale: 0.6, hours: [-2, 8], today: 8 };
function hindsightStage(s, t, c, g) {
  const research = L("历史研究", "Historical research"), names = {
    axis: { v: research, alpha: named(t, c.first4) },
    card: { v: L("当时", "Known then"), alpha: named(t, c.then) }
  }, later = L("事后", "Seen in hindsight"), series = L("修正后的数据", "Corrected series"), reach = Math.max(measure(later), measure(series)) / 2, e = lastNightExtent(D.scale, { card: 1, hours: D.hours, names }), x = 960 - (e.left + e.right + reach) / 2, y = 545;
  const m = lastNight(x, y, D.scale, {
    alpha: g,
    card: soon(t, c.then - 0.15, 0.8),
    hours: D.hours,
    flow: t < c.cannot ? flowOf2(t, 0.25) : null,
    names
  });
  dot(m.left, y, m.mark, { color: P.line, alpha: g });
  dot(m.right, y, m.mark, { color: P.line, alpha: g });
  const today = m.at(D.today), box2 = m.above(D.today), under = y + m.tick + NAME_GAP, midY = (m.card.top + m.card.bottom) / 2;
  const seen = g * named(t, c.hindsight);
  dot(today, y, m.mark, { color: P.ink, alpha: seen });
  nameText(later, today, under, { valign: "top", alpha: seen });
  const fix = g * named(t, c.corrected);
  link(m.card.right + 10, midY, box2.left - 10, midY, {
    alpha: fix,
    dash: [9, 9],
    upto: soon(t, c.corrected - 0.1, 0.9),
    color: P.muted
  });
  nameText(L("修正", "Corrected"), (m.card.right + box2.left) / 2, midY - NAME_GAP, {
    valign: "bottom",
    alpha: fix
  });
  const data = g * named(t, c.series);
  tableIcon(box2.left, box2.top, box2.right - box2.left, box2.bottom - box2.top, { alpha: data });
  nameText(series, today, box2.top - NAME_GAP, { valign: "bottom", alpha: data });
  const barX = m.arrival + HOUR * D.scale * 0.8, no = g * named(t, c.cannot);
  bar2(barX, y, { alpha: g * ramp(t, c.cannot + 0.35, 0.3), vertical: true, length: 44 });
  if (t > c.cannot) {
    const q = flowOf2(t, 0.5);
    flowDot(mix(today - 12, barX + 10, q), y, 6, q, { color: P.unknown, alpha: g });
  }
  rejectedName(L("证明不了", "Cannot show"), barX, under, {
    valign: "top",
    alpha: no,
    mark: ramp(t, c.cannot + 0.35, 0.3)
  });
}

// picture/film/scenes/p05/scene.js
function cuesOf5(s) {
  const c = {
    first1: cue(s, "说数据能用", "Calling data usable"),
    evidence: cue(s, "证据", "evidence"),
    nonProofs: cues(s, [
      ["能打开的文件", "A file that opens"],
      ["好看的图", "a chart that looks good"],
      ["看起来有效的模型信号", "a promising model signal"]
    ]),
    refuse: cue(s, "本身都证明不了", "none of them alone"),
    unknowns: cues(s, [
      ["含义", "meaning"],
      ["质量", "quality"],
      ["使用权限", "permission"],
      ["复现", "reproducibility"]
    ]),
    first1b: cue(s, "数据要先证明适合", "Data earns trust"),
    fit: cue(s, "证明适合", "shown fit"),
    use: cue(s, "具体用途", "a specific use"),
    trust: cue(s, "可信", "earns trust"),
    first2: cue(s, "用之前", "So before relying"),
    sixClause: cue(s, "先问六个问题", "So before relying"),
    six: cue(s, "六个问题", "six questions"),
    asks: cues(s, [
      ["它从哪里来", "Where did it come from"],
      ["最早什么时候能拿到", "When did it become available"],
      ["是什么意思", "What does it mean"],
      ["被什么改过", "What changed it"],
      ["质量怎么样", "How good is it"],
      ["能用在哪里", "And how may it be used"]
    ]),
    first2b: cue(s, "说不清这些的数据", "Data that cannot answer"),
    explore: cue(s, "探索", "explored"),
    scopeClause: cue(s, "可以在授权范围里探索", "Data that cannot answer"),
    scope: cue(s, "授权范围", "authorized scope"),
    staysOut: cue(s, "可要拿去", "but stays out"),
    uses: cues(s, [
      ["共享", "shared"],
      ["投产", "production"],
      ["做决策", "decision work"]
    ]),
    first3: cue(s, "昨晚那份价格", "Last night's prices"),
    measure: cue(s, "比平时", "two hours later"),
    usual: cue(s, "平时", "usual"),
    backtest: cue(s, "回测", "backtest"),
    later: cue(s, "晚到的时间", "that later time"),
    first4: cue(s, "做历史研究", "In historical research"),
    then: cue(s, "当时能知道什么", "what could have been known"),
    hindsight: cue(s, "事后看到了什么", "seen in hindsight"),
    corrected: cue(s, "修正过价格", "corrected its prices"),
    series: cue(s, "修正后的数据", "corrected series"),
    cannot: cue(s, "就证明不了", "cannot show"),
    first5: cue(s, "报告", "No report"),
    views: cues(s, [
      ["报告", "report"],
      ["数据目录", "catalog"],
      ["缓存", "cache"],
      ["智能体的摘要", "Agent summary"]
    ]),
    become: cue(s, "不能悄悄变成", "may quietly become"),
    truth: cue(s, "权威来源", "source of truth")
  };
  c.fit2 = cueFrom(s, "证明它适合", "shown fit", c.first2b);
  return c;
}
scenes["05"] = function(s, t) {
  const c = cuesOf5(s);
  const A5 = stageOut(t, c.first1b), A23 = stageIn(t, c.first1b) * stageOut(t, c.first2), B6 = stageIn(t, c.first2) * stageOut(t, c.first2b), B22 = stageIn(t, c.first2b) * stageOut(t, c.first3), C4 = stageIn(t, c.first3) * stageOut(t, c.first4), D3 = stageIn(t, c.first4) * stageOut(t, c.first5), E4 = stageIn(t, c.first5);
  if (A5 > 0) evidenceStage(s, t, c, A5);
  if (A23 > 0) fitStage(s, t, c, A23);
  if (B6 > 0) questionsStage(s, t, c, B6);
  if (B22 > 0) scopeStage(s, t, c, B22);
  if (C4 > 0) nightStage(s, t, c, C4);
  if (D3 > 0) hindsightStage(s, t, c, D3);
  if (E4 > 0) viewsStage(s, t, c, E4);
  illustrative(C4 + D3);
};

// picture/film/scenes/p06/claims.js
var C2 = { y: 690, pitch: 180, icon: 634 };
function stationMark(i, x, y, a) {
  if (i === 0) person(x, y + 12, { alpha: a, color: P.authority, size: 0.8 });
  else if (i === 1) {
    stroke(
      () => {
        ctx.moveTo(x - 24, y - 14);
        ctx.lineTo(x - 30, y - 14);
        ctx.lineTo(x - 30, y + 14);
        ctx.lineTo(x - 24, y + 14);
        ctx.moveTo(x + 24, y - 14);
        ctx.lineTo(x + 30, y - 14);
        ctx.lineTo(x + 30, y + 14);
        ctx.lineTo(x + 24, y + 14);
      },
      { color: P.authority, alpha: a, width: 3 }
    );
    dot(x, y, 6, { color: P.ink, alpha: a });
  } else if (i === 2) {
    ring(x, y, 15, { color: P.ink, alpha: a, width: 3 });
    dot(x, y, 6, { color: P.ink, alpha: a });
  } else if (i === 3) {
    [-18, 0, 18].forEach((dx) => dot(x + dx, y + 8, 5, { color: P.ink, alpha: a }));
    check(x, y - 12, 18, { alpha: a });
  } else if (i === 4) {
    box(x - 24, y - 17, 48, 34, { fill: P.row, stroke: P.ink, alpha: a, radius: 5, width: 2.5 });
    line(x - 14, y - 4, x + 14, y - 4, { color: P.muted, alpha: a, width: 2 });
    line(x - 14, y + 6, x + 6, y + 6, { color: P.muted, alpha: a, width: 2 });
  } else if (i === 5) {
    ring(x, y, 17, { color: P.evidence, alpha: a, width: 2.5 });
    check(x, y + 1, 18, { alpha: a });
  } else recoverIcon(x, y, 15, { alpha: a, color: P.evidence });
}
function chainStage(s, t, c, g) {
  lastNight(960, 250, 0.75, {
    alpha: g,
    lateBy: -0.6,
    arrival: 1,
    flow: flowOf2(t, 0.25),
    names: {
      arrival: { v: L("任务提前启动", "An earlier start"), alpha: early(t, c.first3, c.approved) }
    }
  });
  const ats = c.stations, n = ats.length, x0 = 960 - (n - 1) * C2.pitch / 2, xs = ats.map((_, i) => x0 + i * C2.pitch), slim = soon(t, c.lighter + 0.05, 0.8);
  const reach = ats.reduce(
    (v, at2, i) => i ? mix(v, xs[i], soon(t, at2 - 0.15, 0.5)) : xs[0],
    xs[0]
  );
  line(xs[0] - 30, C2.y, xs[n - 1] + 30, C2.y, {
    color: P.line,
    alpha: g * ramp(t, ats[0] - 0.15, 0.4),
    width: 2.5
  });
  line(xs[0] - 30, C2.y, reach + 30, C2.y, {
    color: P.ink,
    alpha: g * 0.9,
    width: mix(5, 2.5, slim)
  });
  if (t > ats[n - 1] + 0.6) {
    const q = flowOf2(t, 0.2);
    flowDot(mix(xs[0], xs[n - 1], q), C2.y, 6, q, { color: P.evidence, alpha: g });
  }
  xs.forEach((x, i) => {
    const a = g * ramp(t, ats[i] - 0.15, 0.4), lit = speaking(t, ats, i);
    dot(x, C2.y, 6, { color: P.ink, alpha: a });
    stationMark(i, x, C2.icon, a);
    if (lit > 0) ring(x, C2.icon, 32, { color: P.ink, alpha: g * lit * 0.4, width: 2 });
  });
  const stations = L(
    ["决策负责人", "范围", "改动", "当前的运行", "说法", "验收", "学习"],
    ["Decision owner", "Limits", "Change", "Current runs", "The claim", "Acceptance", "Learning"]
  );
  railNames(stations, xs, C2.y, {
    gap: NAME_GAP,
    alpha: (i) => g * listIn(t, ats, i),
    set: "chain"
  });
  const reachOut = (v) => Math.max(30, measure(v) / 2);
  nameText(L("信任链", "Chain of trust"), xs[0] - reachOut(stations[0]) - NAME_GAP, C2.y, {
    align: "right",
    alpha: g * named(t, c.chain)
  });
  nameText(L("手续变轻", "Less process"), xs[n - 1] + reachOut(stations[n - 1]) + NAME_GAP, C2.y, {
    align: "left",
    alpha: g * named(t, c.lighter)
  });
  const skip = g * named(t, c.skip), wy = C2.icon - 70, run = soon(t, c.skip - 0.1, 0.8);
  stroke(
    () => {
      ctx.moveTo(xs[2], C2.icon - 24);
      ctx.lineTo(xs[2], wy);
      ctx.lineTo(mix(xs[2], xs[3] - 10, run), wy);
    },
    { color: P.line, alpha: skip, width: 2.5 }
  );
  bar2(xs[3], wy, { alpha: g * ramp(t, c.skip + 0.45, 0.3), vertical: true, length: 40 });
  rejectedName(L("少一环", "A skipped link"), xs[3], wy - 20 - NAME_GAP, {
    valign: "bottom",
    alpha: skip,
    mark: ramp(t, c.skip + 0.45, 0.3)
  });
}
var E1 = { y: 505, x0: 540, x1: 1380, at: 3, page: [88, 110], effort: 116 };
function stateStage(s, t, c, g) {
  const xs = [0, 1, 2, 3, 4].map((k) => mix(E1.x0, E1.x1, k / 4)), reached = xs[E1.at], [pw, ph] = E1.page, pageTop = E1.y - 18 - ph, state = g * early(t, c.stateClause, c.state);
  stroke(
    () => {
      ctx.moveTo(E1.x0, E1.y);
      ctx.lineTo(E1.x1, E1.y);
      xs.forEach((x) => {
        ctx.moveTo(x, E1.y - 7);
        ctx.lineTo(x, E1.y + 7);
      });
    },
    { color: P.line, alpha: g, width: 3 }
  );
  line(E1.x0, E1.y, reached, E1.y, { color: P.ink, alpha: g, width: 4 });
  documentIcon(reached - pw / 2, pageTop, pw, ph, { alpha: g, rows: 2 });
  line(reached, pageTop + ph, reached, E1.y - 6, { color: P.line, alpha: g, width: 2 });
  nameText(L("汇报", "Report"), reached, pageTop - NAME_GAP, {
    valign: "bottom",
    alpha: g * named(t, c.first5)
  });
  nameText(L("哪一步", "The state"), reached, E1.y + 7 + NAME_GAP, { valign: "top", alpha: state });
  const effort = g * named(t, c.effort), ey = E1.y + E1.effort;
  box(E1.x0, ey - 14, E1.x1 - E1.x0, 28, { stroke: P.line, alpha: effort, radius: 6, width: 2 });
  box(E1.x0 + 4, ey - 10, (E1.x1 - E1.x0 - 8) * 0.9 * soon(t, c.effort, 0.8), 20, {
    fill: P.muted,
    alpha: effort * 0.55,
    radius: 4
  });
  rejectedName(L("力气", "The effort"), (E1.x0 + E1.x1) / 2, ey + 14 + NAME_GAP, {
    valign: "top",
    alpha: effort,
    mark: ramp(t, c.effort + 0.4, 0.3)
  });
}
var V = {
  w: 560,
  h: 280,
  y: 456,
  fy: 760,
  fw: 150,
  fh: 104,
  pubX: 680,
  useX: 1040,
  eyeX: 1250
};
var BOUNDS = () => L(["对象", "版本", "环境", "限度"], ["Subject", "Version", "Environment", "Limit"]);
function verifiedStage(s, t, c, g) {
  const cy = V.y, x0 = 960 - V.w / 2, x1 = 960 + V.w / 2, y0 = cy - V.h / 2, y1 = cy + V.h / 2, sides = [
    [x0 + 14, y0, x1 - 14, y0],
    [x1, y0 + 14, x1, y1 - 14],
    [x0 + 14, y1, x1 - 14, y1],
    [x0, y0 + 14, x0, y1 - 14]
  ];
  stroke(
    () => sides.forEach(([ax, ay, bx, by]) => {
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
    }),
    { color: P.line, alpha: g, width: 3.5 }
  );
  ring(960, cy - 14, 30, { color: P.evidence, alpha: g, width: 3 });
  check(960, cy - 13, 32, { alpha: g, upto: soon(t, c.first5b, 0.4) });
  nameText(L("核验通过", "Verified"), 960, cy + 16 + NAME_GAP, { valign: "top", alpha: g });
  const at2 = c.bounds;
  sides.forEach(
    ([ax, ay, bx, by], i) => line(ax, ay, bx, by, { color: P.ink, alpha: g * ramp(t, at2[i] - 0.15, 0.4), width: 4 })
  );
  const place = [
    [960, y0 - NAME_GAP, "center", "bottom"],
    [x1 + NAME_GAP, cy, "left", "middle"],
    [960, y1 + NAME_GAP, "center", "top"],
    [x0 - NAME_GAP, cy, "right", "middle"]
  ];
  BOUNDS().forEach(
    (v, i) => nameText(v, place[i][0], place[i][1], {
      align: place[i][2],
      valign: place[i][3],
      alpha: g * listIn(t, at2, i),
      set: "bounds"
    })
  );
  const pub = g * named(t, c.published), inUse = g * named(t, c.inUse), { fy, fw, fh, pubX, useX, eyeX } = V, under = fy + fh / 2 + NAME_GAP;
  box(pubX - fw / 2, fy - fh / 2, fw, fh, { stroke: P.ink, alpha: pub, radius: 10, width: 2.5 });
  box(pubX - 22, fy - 17, 44, 34, {
    fill: P.row,
    stroke: P.ink,
    alpha: pub,
    radius: 5,
    width: 2.5
  });
  nameText(L("约定的地方", "Agreed destination"), pubX, under, { valign: "top", alpha: pub });
  box(useX - fw / 2, fy - fh / 2, fw, fh, {
    stroke: P.line,
    alpha: inUse,
    radius: 10,
    width: 2.5,
    dash: [8, 8]
  });
  person(useX, fy + 8, { alpha: inUse, size: 0.85, color: P.muted });
  nameText(L("在用", "In use"), useX, under, { valign: "top", alpha: inUse });
  const way = soon(t, c.published + 0.3, 0.7);
  line(pubX + fw / 2 + 10, fy, mix(pubX + fw / 2 + 10, useX - fw / 2 - 30, way), fy, {
    color: P.line,
    alpha: pub,
    width: 2.5
  });
  bar2(useX - fw / 2 - 24, fy, {
    alpha: g * ramp(t, c.notMean + 0.05, 0.3),
    vertical: true,
    length: 44
  });
  const seen = g * named(t, c.observed);
  line(useX + fw / 2 + 8, fy, eyeX - 40, fy, { color: P.line, alpha: seen, width: 2.5 });
  if (t > c.observed + 0.4) {
    const q = flowOf2(t, 0.5);
    flowDot(mix(eyeX - 40, useX + fw / 2 + 8, q), fy, 4.5, q, { color: P.evidence, alpha: seen });
  }
  stroke(
    () => {
      ctx.moveTo(eyeX - 30, fy);
      ctx.quadraticCurveTo(eyeX, fy - 26, eyeX + 30, fy);
      ctx.quadraticCurveTo(eyeX, fy + 26, eyeX - 30, fy);
    },
    { color: P.evidence, alpha: seen, width: 3 }
  );
  dot(eyeX, fy, 7, { color: P.evidence, alpha: seen });
  nameText(L("实际看到的", "Actually observed"), eyeX, under, { valign: "top", alpha: seen });
}
var F2 = { y: 450, w: 600, h: 200, narrow: 380 };
var SUBJECT = () => L("哪个对象、哪个版本", "Subject and version");
var SIGNED = () => L("谁、什么时候、什么方法", "When, by whom, how");
function claimStage(s, t, c, g) {
  const tagX = F2.w / 2 + NAME_GAP + Math.max(35, measure(SUBJECT()) / 2), signX = F2.w / 2 + NAME_GAP + Math.max(18, measure(SIGNED()) / 2), right = tagX + Math.max(35, measure(SUBJECT()) / 2), left = -signX - Math.max(18, measure(SIGNED()) / 2), shifts = [
    [18 - signX, tagX - 35],
    [18 - signX, right],
    [left, right]
  ].map(([l, r]) => centring(960 + l, 960 + r)), x = 960 + (Math.max(...shifts) + Math.min(...shifts)) / 2, narrowed = soon(t, c.narrow + 0.05, 0.8), w = mix(F2.w, F2.narrow, narrowed), cl = x - F2.w / 2, top = F2.y - F2.h / 2, under = F2.y + 34 + NAME_GAP;
  line(x - signX + 18, F2.y, x + tagX - 35, F2.y, { color: P.line, alpha: g, width: 2 });
  if (narrowed > 0)
    box(cl, top, F2.w, F2.h, {
      stroke: P.line,
      alpha: g * narrowed,
      radius: 10,
      width: 2,
      dash: [8, 8]
    });
  box(cl, top, w, F2.h, { fill: P.row, stroke: P.ink, alpha: g, radius: 10, width: 2.5 });
  const asked = ramp(t, c.what - 0.15, 0.4);
  stroke(
    () => [0, 1, 2, 3].forEach((k) => {
      ctx.moveTo(cl + 36, top + 44 + k * 38);
      ctx.lineTo(cl + w - 40 - k % 2 * 60, top + 44 + k * 38);
    }),
    { color: P.muted, alpha: g * 0.8, width: 2.5 }
  );
  line(cl + 36, top + 44, cl + w - 40, top + 44, { color: P.ink, alpha: g * asked, width: 4 });
  beats(t, cl + w / 2, F2.y, 60, [c.answers], { alpha: g });
  nameText(L("说完成", "Completion claim"), cl + F2.w / 2, top - NAME_GAP, {
    valign: "bottom",
    alpha: g * early(t, c.first6, c.claim)
  });
  const pin = g * named(t, c.subject), tx = x + tagX;
  if (t > c.subject + 0.5) {
    const q = flowOf2(t, 0.5);
    flowDot(mix(cl + w + 4, tx - 35, q), F2.y, 4, q, { color: P.ink, alpha: pin });
  }
  tagIcon(tx - 35, F2.y, 70, 34, { alpha: pin, color: P.ink });
  nameText(SUBJECT(), tx, under, { valign: "top", alpha: pin });
  const sign = g * named(t, c.signed), sx = x - signX;
  ring(sx, F2.y, 18, { color: P.evidence, alpha: sign, width: 2.5 });
  check(sx, F2.y + 1, 18, { alpha: sign });
  nameText(SIGNED(), sx, under, { valign: "top", alpha: sign });
  const cy = top + F2.h + 40, split = cl + F2.narrow, covered = g * named(t, c.covering), unproved = g * named(t, c.unproved), one = (cl + split) / 2, two = (split + cl + F2.w) / 2, row1 = cy + 12 + NAME_GAP, row2 = row1 + 29 + 16;
  box(cl, cy - 12, split - cl, 24, { fill: P.evidence, alpha: covered * 0.85, radius: 4 });
  box(split + 6, cy - 12, cl + F2.w - split - 6, 24, {
    stroke: P.unknown,
    alpha: unproved,
    radius: 4,
    width: 2.5,
    dash: [6, 6]
  });
  nameText(L("覆盖了什么", "Covering what"), one, row1, { valign: "top", alpha: covered });
  nameText(L("没证明", "Unproved"), two, row1, { valign: "top", alpha: unproved });
  nameText(L("收窄说法", "A narrower claim"), one, row2, {
    valign: "top",
    alpha: g * named(t, c.narrow)
  });
  const shut = g * named(t, c.inflate);
  bar2(split + 3, F2.y, { alpha: shut, vertical: true, length: F2.h - 40 });
  rejectedName(L("把话说大", "Inflated wording"), two, row2, {
    valign: "top",
    alpha: shut,
    mark: ramp(t, c.inflate + 0.3, 0.3)
  });
}
function pairsStage(s, t, c, g) {
  const rows = [
    {
      y: 370,
      at: c.test,
      to: c.acceptance,
      from: L("测试通过", "A passing test"),
      not: L("已经验收", "Acceptance")
    },
    {
      y: 640,
      at: c.agentSays,
      to: c.complete,
      from: L("智能体说完成了", "An Agent reporting completion"),
      not: L("完成了", "Complete")
    }
  ];
  const r = 56, reachLeft = Math.max(50, ...rows.map((row) => measure(row.from) / 2)), reachRight = Math.max(r, ...rows.map((row) => measure(row.not) / 2)), lx = 600 + centring(600 - reachLeft, 1320 + reachRight), rx = lx + 720;
  rows.forEach((row, i) => {
    const a = g * (i ? named(t, row.at) : early(t, c.first7, row.at)), b = g * named(t, row.to), wayAt = i ? row.at : c.first7;
    if (i === 0) {
      documentIcon(lx - 50, row.y - 66, 100, 132, { alpha: a, rows: 3 });
      dot(lx + 40, row.y + 46, 24, { color: P.ground, alpha: a });
      ring(lx + 40, row.y + 46, 24, { color: P.evidence, alpha: a, width: 3 });
      check(lx + 40, row.y + 47, 26, { alpha: a });
    } else {
      agent(lx, row.y, { alpha: a, size: 2 });
      bubble(lx + 74, row.y - 52, 20, { alpha: a, color: P.ink });
    }
    line(lx + 80, row.y, mix(lx + 80, rx - r - 34, soon(t, wayAt + 0.2, 0.9)), row.y, {
      color: P.line,
      alpha: a,
      width: 3
    });
    bar2(rx - r - 26, row.y, { alpha: b, vertical: true, length: 100 });
    openMark2(rx, row.y, r, { alpha: b });
    nameText(row.from, lx, row.y + 70 + NAME_GAP, { valign: "top", alpha: a });
    nameText(row.not, rx, row.y + 70 + NAME_GAP, { valign: "top", alpha: b });
  });
}

// picture/film/scenes/p06/night.js
function shieldMark(x, y, s, { alpha = 1, color = P.evidence, width = 3 } = {}) {
  if (alpha < 0.01) return;
  stroke(
    () => {
      ctx.moveTo(x, y - s * 0.55);
      ctx.lineTo(x + s * 0.45, y - s * 0.38);
      ctx.lineTo(x + s * 0.42, y + s * 0.08);
      ctx.quadraticCurveTo(x + s * 0.32, y + s * 0.4, x, y + s * 0.58);
      ctx.quadraticCurveTo(x - s * 0.32, y + s * 0.4, x - s * 0.42, y + s * 0.08);
      ctx.lineTo(x - s * 0.45, y - s * 0.38);
      ctx.closePath();
    },
    { color, alpha, width }
  );
}
function nightNames2(t, c) {
  return {
    axis: { v: L("昨晚", "Last night"), alpha: early(t, c.first1, c.night) },
    late: { v: L("任务启动晚了", "Late start"), alpha: named(t, c.lateJob) }
  };
}
function backStage(s, t, c, g) {
  const names = nightNames2(t, c), e = lastNightExtent(1, { late: 1, names }), pageTop = 551 - 36 - 110 - NAME_GAP - 30, x = 960 - (e.left + e.right) / 2, y = 505 - (Math.min(e.top, pageTop - 551) + e.bottom) / 2;
  const m = lastNight(x, y, 1, {
    alpha: g,
    late: soon(t, c.lateJob - 0.15, 0.7),
    arrival: { upto: ramp(t, c.log + 0.35, 0.2), alpha: 1 },
    flow: flowOf2(t, 0.25),
    names
  });
  const page = (h, shown, at2, rows) => {
    const b = m.above(h), a = g * shown(t), reach = soon(t, at2 + 0.1, 0.5), cx = (b.left + b.right) / 2;
    documentIcon(b.left + 20, b.top, b.right - b.left - 40, b.bottom - b.top, { alpha: a, rows });
    line(cx, b.bottom, cx, mix(b.bottom, m.y, reach), { color: P.line, alpha: a, width: 2 });
    return b;
  };
  const pubIn = (v) => early(v, c.checked, c.publication), logIn = (v) => named(v, c.log), pub = page(0, pubIn, Math.max(c.checked - 0.2, c.publication - 1.35), 2), log = page(2, logIn, c.log, 2);
  nameText(L("发布时间", "Publication time"), m.due, pub.top - NAME_GAP, {
    valign: "bottom",
    alpha: g * pubIn(t)
  });
  nameText(L("任务日志", "Job log"), m.arrival, log.top - NAME_GAP, {
    valign: "bottom",
    alpha: g * logIn(t)
  });
  const on = g * named(t, c.onTime), sx = pub.right - 20, sy = pub.bottom - 18;
  dot(sx, sy, 17, { color: P.ground, alpha: on });
  dot(sx, sy, 17, { color: P.evidence, alpha: on, hollow: true, width: 2.5 });
  check(sx, sy + 1, 18, { alpha: on, upto: soon(t, c.onTime + 0.05, 0.4) });
  nameText(L("按时发布", "On time"), sx + 17 + NAME_GAP, sy, { align: "left", alpha: on });
}
var B3 = {
  scale: 0.75,
  x: 960,
  y: 250,
  spine: 642,
  slab: [680, 1060],
  ys: [458, 588, 718],
  h: 84
};
var THREE2 = () => L("三层", "Three layers");
var LAYERS = () => L(["控制影响", "修复", "防止再发生"], ["Containment", "Repair", "Prevention"]);
var REFUSED = () => L("从根上修好", "A systemic fix");
function layersStage(s, t, c, g) {
  const move = soon(t, c.earlier + 0.45, 0.9), names = {
    axis: { v: L("昨晚", "Last night"), side: "left", alpha: 1 },
    late: { v: L("任务启动晚了", "Late start"), alpha: 1 - ramp(t, c.earlier + 0.05, 0.4) }
  };
  const m = lastNight(B3.x + (measure(names.axis.v) + NAME_GAP) / 2, B3.y, B3.scale, {
    alpha: g,
    late: { upto: 1, alpha: 1 - move },
    lateBy: mix(2, -0.6, move),
    arrival: 1,
    flow: flowOf2(t, 0.25),
    names
  });
  const place = m.above(0), missing = g * named(t, Math.min(c.missing, c.fill)), patched = g * ramp(t, Math.max(c.missing, c.fill) + 0.2, 0.4);
  missingPage(place.left + 14, place.top, place.right - place.left - 28, place.bottom - place.top, {
    alpha: missing
  });
  documentIcon(
    place.left + 14,
    place.top,
    place.right - place.left - 28,
    place.bottom - place.top,
    {
      alpha: patched,
      rows: 0
    }
  );
  patchMark2((place.left + place.right) / 2, place.bottom - 22, 22, { alpha: patched });
  line(m.due, place.bottom, m.due, m.y - m.tick, { color: P.line, alpha: missing, width: 2 });
  nameText(
    L("缺的数据", "The missing data"),
    place.right + NAME_GAP - 14,
    (place.top + place.bottom) / 2,
    {
      align: "left",
      alpha: missing
    }
  );
  [
    [-1.3, c.asks[1]],
    [0.6, c.asks[2]]
  ].forEach(([h, at2]) => openMark2(m.at(h), m.y, 7, { alpha: g * ramp(t, at2 - 0.15, 0.4) }));
  const guard = g * named(t, c.safeguard);
  dot(m.due, m.y, 15, { color: P.ground, alpha: guard });
  shieldMark(m.due, m.y, 26, { alpha: guard });
  nameText(L("刚好够用的防护", "The lightest safeguard"), m.due, m.y + 15 + NAME_GAP, {
    valign: "top",
    alpha: guard
  });
  const refusedAt = Math.max(c.notFix - 0.2, c.systemic - 1.35), toBracket = B3.slab[1] + NAME_GAP + L(170, 190), left = B3.spine - NAME_GAP - measure(THREE2()), reach = toBracket + NAME_GAP + measure(REFUSED()) + 42, shift = centring(left, reach), spine = B3.spine + shift, [x0, x1] = B3.slab.map((x) => x + shift), ats = c.layers, top = B3.ys[0] - B3.h / 2, bottom = B3.ys[2] + B3.h / 2, count = g * early(t, c.first2, c.three);
  line(spine, top, spine, mix(top, bottom, soon(t, c.three - 0.1, 0.8)), {
    color: P.ink,
    alpha: count,
    width: 3
  });
  nameText(THREE2(), spine - NAME_GAP, (top + bottom) / 2, {
    align: "right",
    alpha: count
  });
  const done = g * ramp(t, c.firstTwo - 0.1, 0.4);
  B3.ys.forEach((y, i) => {
    const q = g * ramp(t, ats[i] - 0.15, 0.4), lit = g * speaking(t, ats, i);
    line(spine, y, x0, y, { color: P.line, alpha: q, width: 2 });
    box(x0, y - B3.h / 2, x1 - x0, B3.h, {
      fill: P.row,
      stroke: P.line,
      alpha: q,
      radius: 10,
      width: 2.5
    });
    box(x0, y - B3.h / 2, x1 - x0, B3.h, { stroke: P.ink, alpha: q * lit, radius: 10, width: 3 });
    if (i < 2) check(x0 + 190, y, 30, { alpha: done, upto: soon(t, c.firstTwo + i * 0.2, 0.4) });
    else openMark2(x0 + 190, y, 17, { alpha: g * ramp(t, c.asks[0] + 0.05, 0.4) });
    if (i === 0) patchMark2(x0 + 60, y, 30, { alpha: q });
    if (i === 1) {
      dot(x0 + 60, y, 17, { color: P.ink, alpha: q, hollow: true, width: 2.5 });
      line(x0 + 60, y, x0 + 60, y - 10, { color: P.ink, alpha: q, width: 2.5 });
      line(x0 + 60, y, x0 + 52, y - 4, { color: P.ink, alpha: q, width: 2.5 });
    }
    if (i === 2) shieldMark(x0 + 60, y, 34, { alpha: q, color: P.ink });
    nameText(LAYERS()[i], x1 + NAME_GAP, y, {
      align: "left",
      alpha: g * listIn(t, ats, i),
      set: "layers"
    });
  });
  const bx = toBracket + shift, a = g * named(t, refusedAt - 0.4), ty = B3.ys[0] - B3.h / 2 + 6, by = B3.ys[1] + B3.h / 2 - 6;
  stroke(
    () => {
      ctx.moveTo(bx - 14, ty);
      ctx.lineTo(bx, ty);
      ctx.lineTo(bx, mix(ty, by, soon(t, refusedAt - 0.4, 0.6)));
      if (soon(t, refusedAt - 0.4, 0.6) > 0.98) ctx.lineTo(bx - 14, by);
    },
    { color: P.ink, alpha: a, width: 2.5 }
  );
  rejectedName(REFUSED(), bx + NAME_GAP, (ty + by) / 2, {
    align: "left",
    alpha: g * named(t, refusedAt),
    mark: ramp(t, c.notFix + 0.05, 0.4)
  });
}

// picture/film/scenes/p06/scene.js
function cuesOf6(s) {
  const c = {
    first1: cue(s, "回到昨晚", "Back to last night"),
    night: cue(s, "昨晚", "last night"),
    checked: cue(s, "查过发布时间", "The publication time"),
    publication: cue(s, "发布时间", "publication time"),
    log: cue(s, "任务日志", "job log"),
    onTime: cue(s, "按时发布", "was on time"),
    lateJob: cue(s, "任务启动晚了", "job started late"),
    first2: cue(s, "这件事要分三层处理", "The fix has three layers"),
    three: cue(s, "三层", "three layers"),
    layers: cues(s, [
      ["先把缺的数据补上", "First, fill in"],
      ["再把任务提前启动", "Then start the job earlier"],
      ["最后是防止它再发生", "Last, stop it happening again"]
    ]),
    missing: cue(s, "缺的数据", "the missing data"),
    fill: cue(s, "补上", "fill in"),
    earlier: cue(s, "提前启动", "start the job earlier"),
    safeguard: cue(s, "刚好够用的防护", "lightest safeguard"),
    firstTwo: cue(s, "只做前两层", "Doing only the first two"),
    notFix: cue(s, "不算从根上修好", "Doing only the first two"),
    systemic: cue(s, "从根上修好", "systemic fix"),
    asks: cues(s, [
      ["弄清现有的系统", "work out why"],
      ["防住", "prevent"],
      ["发现", "catch"]
    ]),
    first3: cue(s, "决策负责人批准", "The decision owner approves"),
    stations: cues(s, [
      ["决策负责人批准", "The decision owner approves"],
      ["也划定了范围", "and sets its limits"],
      ["改动只在这个范围里做", "The job is changed"],
      ["当前的运行", "Current runs"],
      ["话只说到", "The claim stays"],
      ["最后验收", "Then come acceptance"],
      ["从中学习", "and learning"]
    ]),
    chainClause: cue(s, "这是一条信任链", "This is a chain of trust"),
    chain: cue(s, "信任链", "chain of trust"),
    lighter: cue(s, "手续可以随风险变轻", "lower risk means less process"),
    skip: cue(s, "但一环都不能少", "but the chain cannot skip"),
    first5: cue(s, "汇报时", "Report the state"),
    stateClause: cue(s, "说做到哪一步", "Report the state"),
    state: cue(s, "做到哪一步", "the state"),
    effort: cue(s, "不说花了多少力气", "not the effort"),
    first5b: cue(s, "核验通过了", "Verified means"),
    bounds: cues(s, [
      ["对象", "subject"],
      ["版本", "version"],
      ["环境", "environment"],
      ["限度", "limit"]
    ]),
    published: cue(s, "发布到了约定的地方", "Published at the agreed destination"),
    notMean: cue(s, "不代表有人在用", "does not mean anyone uses it"),
    inUse: cue(s, "有人在用", "anyone uses it"),
    observed: cue(s, "实际看到了什么", "actually observed"),
    first6: cue(s, "每次说完成", "Every completion claim"),
    claim: cue(s, "说完成", "completion claim"),
    answers: cue(s, "都要答得上来", "answers the same questions"),
    what: cue(s, "说的是什么", "What is claimed"),
    subject: cue(s, "针对哪个对象", "which subject and version"),
    signed: cue(s, "谁在什么时候", "Verified when"),
    covering: cue(s, "覆盖了什么", "Covering what"),
    unproved: cue(s, "还有什么没证明", "leaving what unproved"),
    narrow: cue(s, "就收窄说法", "narrow the claim"),
    inflate: cue(s, "别把话说大", "rather than inflate the wording"),
    first7: cue(s, "测试通过", "A passing test"),
    test: cue(s, "测试通过", "A passing test"),
    acceptance: cue(s, "不等于已经验收", "is not acceptance"),
    agentSays: cue(s, "智能体说完成了", "And an Agent reporting completion"),
    complete: cueFrom(s, "也不等于完成了", "does not make the work complete", 0)
  };
  c.approved = cueFrom(s, "任务提前启动", "an earlier start", c.first3);
  c.bounds[3] = cueFrom(s, "限度", "limit", c.first5b);
  return c;
}
scenes["06"] = function(s, t) {
  const c = cuesOf6(s);
  const A5 = stageOut(t, c.first2), B6 = stageIn(t, c.first2) * stageOut(t, c.first3), C4 = stageIn(t, c.first3) * stageOut(t, c.first5), E12 = stageIn(t, c.first5) * stageOut(t, c.first5b), E22 = stageIn(t, c.first5b) * stageOut(t, c.first6), F3 = stageIn(t, c.first6) * stageOut(t, c.first7), G2 = stageIn(t, c.first7);
  if (A5 > 0) backStage(s, t, c, A5);
  if (B6 > 0) layersStage(s, t, c, B6);
  if (C4 > 0) chainStage(s, t, c, C4);
  if (E12 > 0) stateStage(s, t, c, E12);
  if (E22 > 0) verifiedStage(s, t, c, E22);
  if (F3 > 0) claimStage(s, t, c, F3);
  if (G2 > 0) pairsStage(s, t, c, G2);
  illustrative(A5 + B6);
};

// picture/film/scenes/p07/delegation.js
function fork(x, y, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  path(
    [
      [x - 34, y],
      [x - 6, y],
      [x + 26, y - 18]
    ],
    { color: P.authority, alpha, width: 3 }
  );
  path(
    [
      [x - 6, y],
      [x + 26, y + 18]
    ],
    { color: P.muted, alpha, width: 3 }
  );
  dot(x - 34, y, 4.5, { color: P.ink, alpha });
}
var D2 = {
  top: 280,
  bottom: 700,
  half: 380,
  rows: [340, 400],
  rail: 530,
  sources: 600,
  scale: 0.7,
  out: 120
};
function delegationStage(s, t, c, g) {
  const reach = Math.max(
    D2.half + NAME_GAP + measure(L("停下来问我", "Stop and ask")),
    D2.half + D2.out + Math.max(22, measure(L("调度", "Schedule")) / 2)
  ), x = (centring(-D2.half, D2.half) + centring(-D2.half, reach)) / 2, x0 = x - D2.half, x1 = x + D2.half;
  stroke(
    () => [
      [x0 + 16, D2.top, x1 - 16, D2.top],
      [x1, D2.top + 16, x1, D2.bottom - 16],
      [x0 + 16, D2.bottom, x1 - 16, D2.bottom],
      [x0, D2.top + 16, x0, D2.bottom - 16]
    ].forEach(([ax, ay, bx, by]) => {
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
    }),
    { color: P.line, alpha: g, width: 3.5 }
  );
  agent(x1 - 70, D2.top + 56, { alpha: g, size: 1.2 });
  nameText(L("委托", "A delegation"), x0, D2.top - NAME_GAP, {
    align: "left",
    valign: "bottom",
    alpha: g * early(t, c.first4, c.delegation)
  });
  const purpose = g * early(t, c.purposeClause, c.purpose), purposeName = L("要不要换供应商", "Whether to change vendors"), pw = measure(purposeName) + 70;
  fork(x - pw / 2 + 34, D2.rows[0], { alpha: purpose });
  nameText(purposeName, x - pw / 2 + 70, D2.rows[0], { align: "left", alpha: purpose });
  const ro = g * named(t, c.readOnly), rw = measure(L("只查不改", "Read-only")) + 60;
  lock(x - rw / 2 + 17, D2.rows[1], { alpha: ro, size: 0.9 });
  nameText(L("只查不改", "Read-only"), x - rw / 2 + 60, D2.rows[1], { align: "left", alpha: ro });
  const tl = g * ramp(t, c.find - 0.15, 0.4), m = lastNight(x, D2.rail, D2.scale, {
    alpha: tl,
    hours: [-1, 3],
    flow: t > c.find + 0.6 ? flowOf2(t, 0.25) : null
  });
  const times = [m.due, m.arrival];
  times.forEach(
    (tx, i) => openMark2(tx, D2.rail, 11, { alpha: g * ramp(t, c.times[i] - 0.15, 0.4) })
  );
  L(["发布时间", "任务启动时间"], ["Publication time", "Job start time"]).forEach(
    (v, i) => nameText(v, times[i], D2.rail - 11 - NAME_GAP, {
      valign: "bottom",
      alpha: g * listIn(t, c.times, i),
      set: "times"
    })
  );
  const src = g * named(t, c.source);
  stroke(
    () => times.forEach((tx) => {
      ctx.moveTo(tx, D2.rail + 14);
      ctx.lineTo(tx, D2.sources - 20);
      ctx.moveTo(tx - 14, D2.sources - 20);
      ctx.lineTo(tx + 14, D2.sources - 20);
      ctx.lineTo(tx + 14, D2.sources + 16);
      ctx.lineTo(tx - 14, D2.sources + 16);
      ctx.closePath();
    }),
    { color: P.ink, alpha: src, width: 2.5 }
  );
  nameText(L("从哪里查到的", "Where each came from"), x, D2.sources + 16 + NAME_GAP, {
    valign: "top",
    alpha: src
  });
  const ux = x + D2.half - 100, unv = g * named(t, c.unverified);
  openMark2(ux, D2.sources, 18, { alpha: unv });
  nameText(L("没法核实", "Unverified"), ux, D2.sources + 16 + NAME_GAP, {
    valign: "top",
    alpha: unv
  });
  const sx = x1 + D2.out, shown = g * soon(t, c.schedule - 0.15, 0.5);
  clock(sx, D2.rail, 22, { alpha: shown, hand: 0.15 });
  nameText(L("调度", "Schedule"), sx, D2.rail + 22 + NAME_GAP, { valign: "top", alpha: shown });
  line(m.arrival + 14, D2.rail, x1 - 8, D2.rail, {
    color: P.line,
    alpha: g * named(t, c.stopWay),
    width: 2.5
  });
  line(x1 + 8, D2.rail, sx - 30, D2.rail, { color: P.line, alpha: shown, width: 2.5 });
  const stop = g * named(t, c.stop);
  bar2(x1, D2.rail, { alpha: stop, vertical: true, length: 48 });
  nameText(L("停下来问我", "Stop and ask"), x1 + NAME_GAP, D2.rail - 48, {
    align: "left",
    valign: "bottom",
    alpha: stop
  });
}
var E3 = { y: 410, caller: 540, agent: 1380 };
function callerStage(s, t, c, g) {
  const endTop = rowNameTop([E3.y + 56, E3.y + 53]);
  person(E3.caller, E3.y + 14, { alpha: g, size: 1.7 });
  nameText(L("调用智能体的人", "The caller"), E3.caller, endTop, { valign: "top", alpha: g });
  agent(E3.agent, E3.y, { alpha: g, size: 2.4 });
  nameText(L("智能体", "Agent"), E3.agent, endTop, {
    valign: "top",
    alpha: g * named(t, c.agent5)
  });
  const ownNames = L(
    ["信息", "权限", "核验", "结果"],
    ["Context", "Permissions", "Verification", "Result"]
  ), pitch = L(170, 196), xs = [-1.5, -0.5, 0.5, 1.5].map((k) => 960 + k * pitch), ats = c.owns;
  line(E3.caller + 50, E3.y, E3.agent - 50, E3.y, { color: P.line, alpha: g, width: 2.5 });
  xs.forEach((x, i) => {
    const a = g * ramp(t, ats[i] - 0.15, 0.4);
    dot(x, E3.y, 10, { color: P.ground, alpha: a });
    dot(x, E3.y, 10, { color: P.authority, alpha: a, hollow: true, width: 3 });
    dot(x, E3.y, 4, { color: P.authority, alpha: a });
  });
  railNames(ownNames, xs, E3.y, {
    gap: 10 + NAME_GAP,
    alpha: (i) => g * listIn(t, ats, i),
    set: "owns"
  });
  const sub = g * named(t, c.submit), wx = mix(E3.caller, xs[0], soon(t, c.submit, 0.8)), wy = E3.y + 200;
  box(wx - 40, wy - 30, 80, 60, { fill: P.row, stroke: P.ink, alpha: sub, radius: 6, width: 2.5 });
  line(wx - 24, wy - 8, wx + 24, wy - 8, { color: P.muted, alpha: sub, width: 2 });
  line(wx - 24, wy + 8, wx + 10, wy + 8, { color: P.muted, alpha: sub, width: 2 });
  const rowTop = rowNameTop([wy + 30, wy + 12]);
  nameText(L("提交", "Submitting"), xs[0], rowTop, { valign: "top", alpha: sub });
  const vx = xs.slice(1), vats = c.vouch;
  vx.forEach((x, i) => check(x, wy, 30, { alpha: g * ramp(t, vats[i] - 0.15, 0.4) }));
  railNames(
    L(["看懂了", "检查过", "为后果负责"], ["Understood", "Checked", "Responsibility"]),
    vx,
    wy,
    {
      gap: rowTop - wy,
      alpha: (i) => g * listIn(t, vats, i),
      set: "vouch"
    }
  );
}

// picture/film/scenes/p07/people.js
function people3(points, { alpha = 1, color = P.ink, size = 1 } = {}) {
  if (alpha < 0.01) return;
  const r = 15 * size;
  fill(
    () => points.forEach(([x, y]) => {
      ctx.moveTo(x + r, y - r * 1.15);
      ctx.arc(x, y - r * 1.15, r, 0, Math.PI * 2);
    }),
    { color, alpha }
  );
  stroke(
    () => points.forEach(([x, y]) => {
      const a0 = Math.PI * 1.08, cy = y + r * 1.9;
      ctx.moveTo(x + r * 1.55 * Math.cos(a0), cy + r * 1.55 * Math.sin(a0));
      ctx.arc(x, cy, r * 1.55, a0, Math.PI * 1.92);
    }),
    { color, alpha, width: 3 * size }
  );
}
function boundary(x0, y0, x1, y1, { alpha = 1, color = P.line, width = 2.5 } = {}) {
  if (alpha < 0.01) return;
  stroke(() => ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 14), { color, alpha, width });
}
var A3 = { y: 410, px: 560, ax: 1260 };
var GROUP = [
  [-62, -34],
  [0, -40],
  [62, -34],
  [-31, 34],
  [31, 34]
];
function collaborationStage(s, t, c, g) {
  const term = L("调查、推理和动手", "Investigation, reasoning, action"), wide = Math.max(measure(term) / 2 + 34, L(150, 230)), grow = soon(t, c.extend - 0.6, 0.45), deep = soon(t, c.refusals[0] - 0.6, 0.45), halfW = mix(110, wide, grow), y = A3.y, ax = A3.ax, px = A3.px;
  people3(
    GROUP.map(([dx, dy]) => [px + dx, y + dy]),
    { alpha: g, size: 1.05 }
  );
  nameText(L("人", "Humans"), px, y + 96 + NAME_GAP, {
    valign: "top",
    alpha: g * named(t, c.people)
  });
  const agentIn = g * (en ? early(t, c.first1, c.agent) : named(t, c.agent));
  agent(ax, y, { alpha: g, size: 2 });
  nameText(L("智能体", "Agents"), ax, y + 44 + NAME_GAP, { valign: "top", alpha: agentIn });
  const left = px + 110, outEnd = ax - wide - 2 * NAME_GAP, collab = g * (en ? named(t, c.agent - 0.05) : early(t, c.first1, c.collab));
  link(left, y, ax - 56, y, { alpha: g, flow: flowOf2(t, 0.3), width: 2.5 });
  nameText(L("人与人工智能的协作", "Human–AI collaboration"), (left + outEnd) / 2, y - NAME_GAP, {
    valign: "bottom",
    alpha: collab
  });
  const top = y - 76, bottom = mix(y + 104, mix(y + 160, y + 270, deep), grow), inBoundary = g * early(t, c.boundaryClause, c.boundary);
  boundary(ax - halfW, top, ax + halfW, bottom, { alpha: inBoundary });
  nameText(L("委托范围", "A delegated boundary"), ax, top - NAME_GAP, {
    valign: "bottom",
    alpha: inBoundary
  });
  nameText(term, ax, y + 128, { alpha: g * named(t, c.extend) });
  L(["组织的授权", "承诺"], ["Organizational authorization", "Commitments"]).forEach(
    (v, i) => rejectedName(v, ax, y + 180 + i * 48, {
      alpha: g * listIn(t, c.refusals, i),
      mark: ramp(t, c.refusals[i] + 0.3, 0.3),
      set: "refusals"
    })
  );
  const ats = c.stays, open = soon(t, c.stay - 0.1, 1.3), ys = [0, 1, 2, 3].map((k) => y + 196 + k * 44), m = mix(8, 30, open);
  if (open > 0.01)
    fill(
      () => ctx.roundRect(px - 100 - m, ys[0] - 15 - m, 200 + 2 * m, ys[3] - ys[0] + 30 + 2 * m, 14),
      {
        color: P.row,
        alpha: g * Math.min(1, open * 3)
      }
    );
  L(
    ["方向", "授权", "决定", "后果的责任"],
    ["Direction", "Authorization", "Decisions", "Responsibility"]
  ).forEach((v, i) => nameText(v, px, ys[i], { alpha: g * listIn(t, ats, i), set: "stays" }));
}
var B4 = { y: 530, decision: 200 };
var PAGE2 = [190, 250];
function stack(x, y, pages, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  const n = Math.round(pages), [w, h] = PAGE2;
  stroke(
    () => {
      for (let k = n - 1; k >= 1; k--) {
        const ox = x + k * 7, oy = y - k * 7;
        ctx.moveTo(ox + w, oy - h + 7);
        ctx.lineTo(ox + w, oy - h);
        ctx.lineTo(ox + 7, oy - h);
      }
    },
    { color: P.muted, alpha, width: 2 }
  );
  documentIcon(x, y - h, w, h, { alpha, rows: 4 });
}
function pagesStage(s, t, c, g) {
  const decided = g * named(t, c.decision), x = 960 + (266 - 166) / 2, pages = g * early(t, c.first2, c.pages), climbed = 4 + 6 * soon(t, c.first2, 3.6);
  agent(x - 200, B4.y, { alpha: pages, size: 3 });
  stack(x - 87, B4.y + 125, climbed, { alpha: pages });
  nameText(L("十页分析", "The ten pages"), x + 40, B4.y + 125 + NAME_GAP, {
    valign: "top",
    alpha: pages
  });
  const dx = x - 200, dy = B4.y - B4.decision;
  ring(dx, dy, 52, { color: P.authority, alpha: decided, width: 3.5 });
  dot(dx, dy, 12, { color: P.authority, alpha: decided });
  nameText(L("哪个决定", "Which decision"), dx, dy - 52 - NAME_GAP, {
    valign: "bottom",
    alpha: decided
  });
  link(dx, dy + 60, dx, B4.y - 78, {
    alpha: decided,
    upto: soon(t, c.decision, 0.7),
    flow: t > c.decision + 0.8 ? flowOf2(t, 0.4) : null
  });
}
var C3 = { y: 425, pile: 170, clear: 34 };
var PILE = () => L("一堆背景材料", "A pile of context");
function boundaryStage(s, t, c, g) {
  const ats = c.five, items = L(
    ["目的和范围", "交什么", "限制和权限", "怎么验收", "什么时候停"],
    ["Purpose and scope", "Deliverable", "Limits and permissions", "Acceptance", "When to stop"]
  ), half = Math.max(...items.map((v) => measure(v) / 2 + 36)), name = L("边界", "A clear boundary"), room = L(105, 72), pileHalf = Math.max(60, (measure(PILE()) + 42) / 2), toPile = half + C3.clear + pileHalf, nameLeft = -half - NAME_GAP - measure(name), x = (centring(nameLeft, half) + centring(Math.min(nameLeft, -toPile - pileHalf), half)) / 2, grown = ats.reduce((v, at2) => v + soon(t, at2 - 0.6, 0.45), 0), y = C3.y, top = y - room, bottom = mix(y + room, y + 161, Math.min(1, grown)) + 52 * Math.max(0, grown - 1);
  agent(x, y, { alpha: g, size: 2 });
  boundary(x - half, top, x + half, bottom, { alpha: g, width: 3.5 });
  nameText(name, x - half - NAME_GAP, top, {
    align: "right",
    alpha: g * early(t, c.first3, c.clear)
  });
  items.forEach(
    (v, i) => nameText(v, x, y + 120 + i * 52, { alpha: g * listIn(t, ats, i), set: "five" })
  );
  const pile = g * named(t, c.pile), px = x - toPile, py = y + C3.pile;
  stroke(
    () => {
      for (let k = 0; k < 5; k++)
        ctx.roundRect(px - 60 + k % 2 * 14, py + 10 - k * 16, 110, 12, 3);
    },
    { color: P.muted, alpha: pile, width: 2.5 }
  );
  rejectedName(PILE(), px, py + 40 + NAME_GAP, {
    valign: "top",
    alpha: pile,
    mark: pile
  });
}

// picture/film/scenes/p07/scene.js
function cuesOf7(s) {
  const c = {
    first1: cue(s, "在人与人工智能的协作里", "In human–AI collaboration"),
    collab: cue(s, "人与人工智能的协作", "human–AI collaboration"),
    people: cue(s, "人", "In human–AI collaboration"),
    boundaryClause: cue(s, "智能体在委托的范围内", "In human–AI collaboration"),
    agent: cue(s, "智能体", "Agents"),
    boundary: cue(s, "委托的范围", "a delegated boundary"),
    extend: cue(s, "调查、推理和动手", "investigate"),
    refusals: cues(s, [
      ["组织的授权", "organizational authorization"],
      ["承诺", "commitments"]
    ]),
    stay: cue(s, "始终留在人手里", "stay with people"),
    first2: cue(s, "开头那十页分析", "Before the ten pages"),
    pages: cue(s, "十页分析", "the ten pages"),
    decision: cue(s, "哪个决定", "which decision"),
    first3: cue(s, "委托时要划清边界", "So delegate with a clear boundary"),
    clear: cue(s, "边界", "a clear boundary"),
    pile: cue(s, "别丢过去", "not a pile of context"),
    important: cue(s, "重要的委托", "A consequential delegation"),
    five: cues(s, [
      ["目的和范围", "purpose and scope"],
      ["交什么", "the deliverable"],
      ["限制和权限", "the limits and permissions"],
      ["怎么验收", "how the result will be accepted"],
      ["什么时候必须停", "when to stop"]
    ]),
    first4: cue(s, "比如这样委托", "A delegation for last night"),
    delegation: cue(s, "这样委托", "A delegation for last night"),
    purposeClause: cue(s, "为了决定要不要换供应商", "To help decide whether to change vendors"),
    purpose: cue(s, "要不要换供应商", "whether to change vendors"),
    readOnly: cue(s, "只查不改", "Work read-only"),
    find: cue(s, "昨晚的发布时间", "find last night's"),
    times: cues(s, [
      ["发布时间", "publication time"],
      ["任务启动时间", "the time our job started"]
    ]),
    source: cue(s, "从哪里查到的", "where each time came from"),
    unverified: cue(s, "没法核实", "could not verify"),
    schedule: cue(s, "调度", "the schedule"),
    stop: cue(s, "停下来问我", "Stop and ask"),
    stopWay: cue(s, "要改调度", "Stop and ask"),
    first5: cue(s, "调用智能体的人", "The person who calls an Agent"),
    submit: cue(s, "提交", "Submitting"),
    vouch: cues(s, [
      ["看懂了", "understood"],
      ["检查过", "checked"],
      ["为后果负责", "accept responsibility"]
    ])
  };
  const from = (zh, en2, at2) => cueFrom(s, zh, en2, at2);
  c.stays = [
    from("方向", "Direction", c.refusals[1]),
    from("授权", "authorization", c.refusals[1]),
    from("决定", "decisions", c.refusals[1]),
    from("后果的责任", "for consequences", c.refusals[1])
  ];
  c.agent5 = from("智能体", "an Agent", c.first5);
  c.owns = [
    from("信息", "context", c.first5),
    from("权限", "permissions", c.first5),
    from("核验", "verification", c.first5),
    from("结果", "result", c.first5)
  ];
  return c;
}
scenes["07"] = function(s, t) {
  const c = cuesOf7(s);
  const A5 = stageOut(t, c.first2), B6 = stageIn(t, c.first2) * stageOut(t, c.first3), C4 = stageIn(t, c.first3) * stageOut(t, c.first4), D3 = stageIn(t, c.first4) * stageOut(t, c.first5), E4 = stageIn(t, c.first5);
  if (A5 > 0) collaborationStage(s, t, c, A5);
  if (B6 > 0) pagesStage(s, t, c, B6);
  if (C4 > 0) boundaryStage(s, t, c, C4);
  if (D3 > 0) delegationStage(s, t, c, D3);
  if (E4 > 0) callerStage(s, t, c, E4);
  illustrative(B6 + D3);
};

// picture/film/scenes/p08/lanes.js
var A4 = { x: 940, up: 380, low: 600, scale: 0.8, stamp: 1470 };
function lanesStage(s, t, c, g0) {
  const g = g0 * clearOfTitle(s, t, 248), upper = lastNight(A4.x, A4.up, A4.scale, {
    alpha: g,
    due: 1,
    arrival: 1,
    lit: soon(t, c.first1 - 0.1, 0.8),
    names: {
      late: {
        v: L("这种延迟", "This kind of delay"),
        side: "top",
        alpha: early(t, c.first1, c.first1)
      }
    }
  });
  const recur = g * named(t, c.recur);
  lastNight(A4.x, A4.low, A4.scale, {
    alpha: recur,
    due: 1,
    lit: { upto: soon(t, c.recur, 0.8), dash: true },
    flow: t > c.warns ? flowOf2(t, 0.3) : null,
    names: {
      late: { v: L("还会出现", "Recurrence"), side: "top", alpha: 1 },
      axis: { v: L("调度", "The schedule"), side: "left", alpha: named(t, c.schedule) }
    }
  });
  const agreed = g * named(t, c.agreed), dx = upper.due;
  stroke(
    () => {
      ctx.moveTo(dx, A4.up - 64);
      ctx.lineTo(dx, A4.up - 18);
      ctx.moveTo(dx, A4.up + 18);
      ctx.lineTo(dx, A4.low - 22);
    },
    { color: P.authority, alpha: agreed, width: 2.5 }
  );
  nameText(L("约定时间", "The agreed time"), dx, A4.up - 64 - NAME_GAP, {
    valign: "bottom",
    alpha: agreed
  });
  const monitor = g * named(t, c.monitor);
  ring(dx, A4.low, 17, { color: P.evidence, alpha: monitor, width: 3 });
  beats(t, dx, A4.low, 26, [c.warns, c.warns + 0.6], { color: P.unknown, alpha: g });
  nameText(L("监控", "A monitor"), dx, A4.low + 17 + NAME_GAP, { valign: "top", alpha: monitor });
  nameText(L("告警", "Warning"), dx, A4.low + 17 + NAME_GAP + 46, {
    valign: "top",
    alpha: g * named(t, c.warns)
  });
  const fixed = g * named(t, c.fixed), stamped = soon(t, c.monitor + 0.2, 0.5), sy = (A4.up + A4.low) / 2;
  seal(A4.stamp, sy, 40, {
    color: P.evidence,
    alpha: fixed,
    stamp: fixed * stamped,
    hollow: stamped < 0.5
  });
  nameText(L("修好了", "Fixed"), A4.stamp, sy + 40 + NAME_GAP, { valign: "top", alpha: fixed });
}
var G = { x0: 700, x1: 1220, ys: [360, 480, 600] };
function aimStage(s, t, c, g) {
  const ats = c.gains, [y0, y1, y2] = G.ys, mid = (G.x0 + G.x1) / 2;
  nameText(L("学习的目的", "The aim of learning"), mid, y0 - 34 - NAME_GAP, {
    valign: "bottom",
    alpha: g * early(t, c.first1b, c.aim)
  });
  stroke(
    () => G.ys.forEach((y) => {
      ctx.moveTo(G.x0, y);
      ctx.lineTo(G.x1, y);
    }),
    { color: P.line, alpha: g, width: 3.5 }
  );
  const q = flowOf2(t, 0.3);
  dot(mix(G.x0, G.x1, q), y0, 5 * Math.min(1, q * 8, (1 - q) * 8), { color: P.ink, alpha: g });
  const f = g * ramp(t, ats[0] - 0.15, 0.4), early0 = soon(t, ats[0] + 0.2, 0.9);
  dot(1020, y0, 8, { color: P.unknown, alpha: f });
  ring(1110, y0, 14, { color: P.muted, alpha: f * early0 * 0.6, width: 2 });
  ring(mix(1110, 800, early0), y0, 14, { color: P.evidence, alpha: f, width: 3 });
  const j = g * ramp(t, ats[1] - 0.15, 0.4), clear = soon(t, ats[1] + 0.2, 0.6);
  diamond(mid, y1, 20, { color: P.authority, alpha: j, solid: clear > 0.5 });
  openMark2(mid, y1, 28, { alpha: j * (1 - clear) });
  const r = g * ramp(t, ats[2] - 0.15, 0.4), shrink = soon(t, ats[2] + 0.2, 1.2);
  stroke(
    () => {
      ctx.moveTo(G.x0 + 30, y2);
      ctx.lineTo(mix(G.x1 - 30, G.x0 + 140, shrink), y2);
    },
    { color: P.muted, alpha: r, width: 12, cap: "butt" }
  );
  L(
    ["更早被发现", "更容易判断", "更少靠人工抢救"],
    ["Earlier detection", "Easier judgment", "Less manual rescue"]
  ).forEach(
    (v, i) => nameText(v, mid, G.ys[i] + 30 + NAME_GAP, {
      valign: "top",
      alpha: g * listIn(t, ats, i),
      set: "gains"
    })
  );
  const files = g * named(t, c.files), fy = y2 + 160, label = L("文件变多", "The file count"), fx = mid - (60 + NAME_GAP + measure(label) + 42) / 2;
  stroke(
    () => {
      for (let k = 0; k < 4; k++) {
        const x = fx + 30 + k * 9, y = fy - 26 - k * 9;
        ctx.moveTo(x, y + 52);
        ctx.lineTo(x, y);
        ctx.lineTo(x + 40, y);
      }
    },
    { color: P.muted, alpha: files, width: 2 }
  );
  documentIcon(fx, fy - 26, 44, 56, { alpha: files, rows: 2 });
  rejectedName(label, fx + 60 + NAME_GAP, fy, {
    align: "left",
    alpha: files,
    mark: ramp(t, c.notFiles + 0.05, 0.4)
  });
}
var B5 = { y: 480, xs: [500, 760, 1020, 1280], late: [0, 0.4, 0, 0.35], guard: 1470, card: 64 };
var SAFEGUARD = () => L("该有的防护", "A needed safeguard");
function signsStage(s, t, c, g) {
  const right = B5.guard + measure(SAFEGUARD()) / 2, left = B5.xs[0] - 108 - NAME_GAP - measure(L("晚几分钟", "A few minutes late")), rowStart = B5.xs[0] - 108, rowEnd = B5.xs[3] + 108, states = [
    [rowStart, rowEnd],
    [left, rowEnd],
    [left, right]
  ].map(([l, r]) => centring(l, r)), shift = (Math.max(...states) + Math.min(...states)) / 2, xs = B5.xs.map((x) => x + shift), cardTop = B5.y - 34 - B5.card, lateIn = g * named(t, c.minutes);
  nights(xs, B5.y, 0.3, { alpha: g, arrival: 1, lit: lateIn, lateBy: B5.late });
  stroke(
    () => xs.forEach((x) => {
      ctx.moveTo(x - 30, B5.y - 34);
      ctx.lineTo(x + 30, B5.y - 34);
      ctx.lineTo(x + 30, cardTop);
      ctx.lineTo(x - 30, cardTop);
      ctx.closePath();
      ctx.moveTo(x, B5.y - 34);
      ctx.lineTo(x, B5.y - 10);
    }),
    { color: P.ink, alpha: g, width: 2.5 }
  );
  const signs = Math.max(c.signsClause - 0.2, c.signs - 1.35);
  growName(
    t,
    L(["出事之前", "的苗头"], ["Early signs"]),
    L([c.first2, signs], [signs]),
    (xs[0] + xs[3]) / 2,
    cardTop - NAME_GAP,
    { valign: "bottom", align: "center", build: true, alpha: g }
  );
  nameText(L("晚几分钟", "A few minutes late"), xs[0] - 108 - NAME_GAP, B5.y, {
    align: "right",
    alpha: lateIn
  });
  const rescue = g * named(t, c.rescue);
  stroke(
    () => xs.forEach((x, i) => {
      if (!B5.late[i]) return;
      ctx.moveTo(x + 14, B5.y + 40);
      ctx.arc(x, B5.y + 40, 14, 0, Math.PI * 2);
    }),
    { color: P.authority, alpha: rescue, width: 3 }
  );
  beats(t, xs[1], B5.y + 40, 20, [c.changes], { color: P.authority, alpha: g });
  beats(t, xs[3], B5.y + 40, 20, [c.changes], { color: P.authority, alpha: g });
  if (t > c.guard + 1) {
    const q = flowOf2(t, 0.3);
    dot(mix(xs[0] - 108, xs[3] + 108, q), B5.y, 4 * Math.min(1, q * 8, (1 - q) * 8), {
      color: P.ink,
      alpha: g
    });
  }
  nameText(L("临时救场", "Stepping in again and again"), (xs[1] + xs[3]) / 2, B5.y + 54 + NAME_GAP, {
    valign: "top",
    alpha: rescue
  });
  const checks = c.look;
  [0, 1].forEach((i) => {
    const x = mix(xs[0], xs[3], i ? 0.72 : 0.28), a = g * ramp(t, checks[i] - 0.15, 0.4);
    ring(x, B5.y + 160, 18, { color: P.evidence, alpha: a, width: 2.5 });
    dot(x, B5.y + 160, 5, { color: P.evidence, alpha: a });
  });
  L(["规律", "影响"], ["Pattern", "Impact"]).forEach(
    (v, i) => nameText(v, mix(xs[0], xs[3], i ? 0.72 : 0.28), B5.y + 178 + NAME_GAP, {
      valign: "top",
      alpha: g * listIn(t, checks, i),
      set: "look"
    })
  );
  const guard = g * named(t, c.guard), gx = B5.guard + shift;
  stroke(
    () => {
      ctx.moveTo(gx, B5.y - 34);
      ctx.lineTo(gx + 27, B5.y - 23);
      ctx.lineTo(gx + 25, B5.y + 5);
      ctx.quadraticCurveTo(gx + 19, B5.y + 24, gx, B5.y + 35);
      ctx.quadraticCurveTo(gx - 19, B5.y + 24, gx - 25, B5.y + 5);
      ctx.lineTo(gx - 27, B5.y - 23);
      ctx.closePath();
    },
    { color: P.evidence, alpha: guard, width: 3, dash: [7, 6] }
  );
  nameText(SAFEGUARD(), gx, B5.y - 34 - NAME_GAP, {
    valign: "bottom",
    alpha: guard
  });
  rejectedName(L("出了事", "An incident"), gx, B5.y + 70, {
    alpha: g * named(t, c.wait),
    mark: ramp(t, c.wait + 0.3, 0.3)
  });
}

// picture/film/scenes/p08/rules.js
function rulePage(x, y, { alpha = 1, w = 90, h = 116, sealAt = 0.22 } = {}) {
  if (alpha < 0.01) return;
  documentIcon(x - w / 2, y - h / 2, w, h, { alpha, rows: 2 });
  seal(x, y + h * sealAt, Math.min(18, w * 0.2), { alpha });
}
var M = { x: 960, y: 540, scale: 0.8 };
function monitorStage(s, t, c, g) {
  const m = lastNight(M.x, M.y, M.scale, { alpha: g, due: 1, flow: flowOf2(t, 0.3) });
  ring(m.due, M.y, 17, { color: P.evidence, alpha: g, width: 3 });
  line(m.due, M.y - 17, m.due, M.y - 60, { color: P.line, alpha: g, width: 2.5 });
  stroke(() => ctx.roundRect(m.due - 60, M.y - 150, 120, 90, 10), {
    color: P.evidence,
    alpha: g,
    width: 3
  });
  stroke(
    () => {
      ctx.moveTo(m.due - 44, M.y - 105);
      ctx.lineTo(m.due - 14, M.y - 105);
      ctx.lineTo(m.due - 4, M.y - 128);
      ctx.lineTo(m.due + 8, M.y - 84);
      ctx.lineTo(m.due + 18, M.y - 105);
      ctx.lineTo(m.due + 44, M.y - 105);
    },
    { color: P.evidence, alpha: g, width: 2.5 }
  );
  nameText(L("监控", "The monitor"), m.due, M.y - 150 - NAME_GAP, {
    valign: "bottom",
    alpha: g * early(t, c.first3, c.monitor3)
  });
  const owner = g * named(t, c.owner);
  link(m.due, M.y + 26, m.due, M.y + 120, {
    alpha: owner,
    upto: soon(t, c.owner, 0.5),
    end: false
  });
  person(m.due, M.y + 160, { alpha: owner, size: 1.1 });
  nameText(L("有人负责", "An owner"), m.due, M.y + 210 + NAME_GAP, { valign: "top", alpha: owner });
  const look = g * named(t, c.look3), lx = m.arrival + 120;
  recoverIcon(lx, M.y + 150, 26, { alpha: look, color: P.evidence, upto: soon(t, c.look3, 0.8) });
  line(lx, M.y + 150, lx, M.y + 134, { color: P.evidence, alpha: look, width: 3 });
  line(lx, M.y + 150, lx + 11, M.y + 156, { color: P.evidence, alpha: look, width: 3 });
  nameText(L("回头看看", "A later look"), lx, M.y + 176 + NAME_GAP, { valign: "top", alpha: look });
  const asks = g * named(t, c.earlier);
  openMark2(m.arrival, M.y - 60, 18, { alpha: asks });
  nameText(L("更早发现问题", "Problems caught earlier"), m.arrival + 18 + NAME_GAP, M.y - 60, {
    align: "left",
    alpha: asks
  });
}
var R = { x: 960, y: 420, rail: 640, half: 520, pitch: 300 };
function retireStage(s, t, c, g) {
  const page = g * mix(1, 0.45, soon(t, c.lift, 0.7)), xs = [-1.5, -0.5, 0.5, 1.5].map((k) => R.x + k * R.pitch), ats = c.retire;
  rulePage(R.x, R.y, { alpha: page, w: 120, h: 156, sealAt: -0.34 });
  nameText(L("规矩", "A rule"), R.x, R.y - 78 - NAME_GAP, {
    valign: "bottom",
    alpha: g * early(t, c.first3b, c.rule3)
  });
  nameText(L("撤掉", "Retire"), R.x + 60 + NAME_GAP, R.y, {
    align: "left",
    alpha: g * named(t, c.retired)
  });
  line(R.x, R.y + 78, R.x, R.rail, { color: P.line, alpha: page, width: 2 });
  line(R.x - R.half, R.rail, R.x + R.half, R.rail, { color: P.line, alpha: g, width: 3.5 });
  [-1, 1].forEach((side) => dot(R.x + side * R.half, R.rail, 6, { color: P.line, alpha: g }));
  xs.forEach((x, i) => openMark2(x, R.rail, 16, { alpha: g * ramp(t, ats[i] - 0.15, 0.4) }));
  railNames(
    L(
      ["对象没了", "没人用", "与权威来源重复", "得不偿失"],
      ["No subject", "No user", "Duplicate", "Net cost"]
    ),
    xs,
    R.rail,
    { gap: 16 + NAME_GAP, alpha: (i) => g * listIn(t, ats, i), set: "retire" }
  );
}
function nextUserStage(s, t, c, g) {
  const names = { card: { v: L("那份数据", "The price data"), alpha: early(t, c.first4, c.data) } }, e = lastNightExtent(1, { card: 1, names }), userName = L("下一位", "Next user"), reach = e.right + 90 + Math.max(28, measure(userName) / 2), x = (centring(e.left, e.right) + centring(e.left, reach)) / 2, y = 551;
  const m = lastNight(x, y, 1, {
    alpha: g,
    card: 1,
    flow: t > c.user + 0.6 ? flowOf2(t, 0.25) : null,
    names
  });
  const user = g * named(t, c.user), ux = m.right + 90;
  link(m.right + 6, y, ux - 30, y, { alpha: user, upto: soon(t, c.user, 0.6) });
  person(ux, y + 4, { alpha: user, size: 1.2 });
  nameText(userName, ux, y + 64 + NAME_GAP, { valign: "top", alpha: user });
  const needs = c.needs, cx = (m.card.right + ux) / 2 + 20;
  L(
    ["清楚的含义", "当时能拿到的事实", "对得上的证据", "获准、有边界的用途"],
    ["Clear meaning", "Facts available then", "Matching evidence", "A permitted, bounded use"]
  ).forEach(
    (v, i) => nameText(v, cx, 262 + i * 48, { alpha: g * listIn(t, needs, i), set: "needs" })
  );
}
function aimsStage(s, t, c, g) {
  const xs = [760, 960, 1160], y = 520, ats = c.aims, px = 520, ox = 1420, judged = g * early(t, c.first4b, c.first4b), other = g * named(t, c.other);
  documentIcon(px - 55, y - 70, 110, 140, { alpha: judged, rows: 3 });
  nameText(L("讲给别人的判断", "Conveying a judgment"), px, y - 70 - NAME_GAP, {
    valign: "bottom",
    alpha: judged
  });
  line(px + 62, y, ox - 40, y, { color: P.line, alpha: judged, width: 3 });
  person(ox, y + 6, { alpha: other, size: 1.2 });
  nameText(L("别人", "Someone else"), ox, y + 62 + NAME_GAP, { valign: "top", alpha: other });
  const reach = ats.reduce((v, at2, i) => mix(v, xs[i], soon(t, at2 - 0.1, 0.6)), px + 62);
  if (t > ats[0] - 0.1) line(px + 62, y, reach, y, { color: P.evidence, alpha: g, width: 3.5 });
  xs.forEach((x, i) => {
    const a = g * ramp(t, ats[i] - 0.15, 0.4);
    dot(x, y, 34, { color: P.ground, alpha: a });
    ring(x, y, 34, { color: P.evidence, alpha: a, width: 3.5 });
    dot(x, y, 9, { color: P.evidence, alpha: a });
  });
  L(["信", "达", "雅"], ["Faithful", "Clear", "Elegant"]).forEach(
    (v, i) => nameText(v, xs[i], y + 34 + NAME_GAP, {
      valign: "top",
      alpha: g * listIn(t, ats, i),
      set: "aims"
    })
  );
  if (t > ats[2] + 0.5) {
    const q = flowOf2(t, 0.35);
    dot(mix(px + 62, ox - 40, q), y, 6 * Math.min(1, q * 8, (1 - q) * 8), {
      color: P.ink,
      alpha: g
    });
  }
}

// picture/film/scenes/p08/scene.js
function cuesOf8(s) {
  const c = {
    first1: cue(s, "这种延迟", "This kind of delay"),
    recur: cue(s, "还会出现", "can recur"),
    fixed: cue(s, "修好了", "fixed"),
    schedule: cue(s, "调度", "the schedule"),
    monitor: cue(s, "监控", "a monitor"),
    agreed: cue(s, "约定时间", "the agreed time"),
    warns: cue(s, "告警", "warns"),
    first1b: cue(s, "学习的目的", "The aim of learning"),
    aim: cue(s, "学习的目的", "The aim of learning"),
    gains: cues(s, [
      ["更早被发现", "find the next failure earlier"],
      ["更容易判断", "judge it more easily"],
      ["更少靠人工抢救", "need less manual rescue"]
    ]),
    notFiles: cue(s, "不是让", "not to increase"),
    files: cue(s, "文件变多", "the file count"),
    first2: cue(s, "出事之前", "There may have been early signs"),
    signsClause: cue(s, "可能早有苗头", "There may have been early signs"),
    signs: cue(s, "苗头", "early signs"),
    changes: cue(s, "这些小变化", "to rescue the run"),
    minutes: cue(s, "偶尔晚几分钟", "a few minutes late"),
    rescue: cue(s, "一再临时救场", "stepping in again and again"),
    look: cues(s, [
      ["规律", "pattern"],
      ["影响", "impact"]
    ]),
    guard: cue(s, "该有的防护", "a safeguard that is needed"),
    wait: cue(s, "等出了事", "wait for an incident"),
    first3: cue(s, "那个监控", "The monitor needs"),
    look3: cue(s, "回头看看", "a later look"),
    earlier: cue(s, "更早发现了问题", "caught problems earlier"),
    first3b: cue(s, "一条规矩", "Retire a rule"),
    rule3: cue(s, "一条规矩", "a rule"),
    retire: cues(s, [
      ["对象没了", "lost its subject"],
      ["没人在用", "has no user"],
      ["跟权威来源重复", "duplicates"],
      ["得不偿失", "costs more"]
    ]),
    retired: cue(s, "撤掉", "Retire"),
    lift: cue(s, "就该撤掉", "costs more"),
    first4: cue(s, "回到开头那份数据", "Back to the price data"),
    data: cue(s, "那份数据", "the price data"),
    user: cue(s, "下一位用它的人", "Its next user"),
    needs: cues(s, [
      ["清楚的含义", "clear meaning"],
      ["当时能拿到的事实", "the facts available"],
      ["对得上说法的证据", "evidence that matches"],
      ["获准的", "a permitted"]
    ]),
    first4b: cue(s, "把判断讲给别人", "And when you convey a judgment"),
    other: cue(s, "别人", "someone else"),
    aims: cues(s, [
      ["先求信", "be faithful first"],
      ["再求达", "then clear"],
      ["再求雅", "then elegant"]
    ])
  };
  c.monitor3 = cueFrom(s, "监控", "The monitor", c.first3);
  c.owner = cueFrom(s, "有人负责", "an owner", c.first3);
  return c;
}
scenes["08"] = function(s, t) {
  const c = cuesOf8(s);
  const A5 = stageOut(t, c.first1b), A23 = stageIn(t, c.first1b) * stageOut(t, c.first2), B6 = stageIn(t, c.first2) * stageOut(t, c.first3), C4 = stageIn(t, c.first3) * stageOut(t, c.first3b), D3 = stageIn(t, c.first3b) * stageOut(t, c.first4), E12 = stageIn(t, c.first4) * stageOut(t, c.first4b), E22 = stageIn(t, c.first4b);
  if (A5 > 0) lanesStage(s, t, c, A5);
  if (A23 > 0) aimStage(s, t, c, A23);
  if (B6 > 0) signsStage(s, t, c, B6);
  if (C4 > 0) monitorStage(s, t, c, C4);
  if (D3 > 0) retireStage(s, t, c, D3);
  if (E12 > 0) nextUserStage(s, t, c, E12);
  if (E22 > 0) aimsStage(s, t, c, E22);
  illustrative(A5 + B6 + C4 + E12);
};

// picture/film/playback.js
var CUT_LAG = 0.6;
var continues = (i) => i > 0 && film.segments[i - 1].chapter === film.segments[i].chapter;
var firstTexts = /* @__PURE__ */ new Map();
function firstTextOf(s) {
  if (firstTexts.has(s.id)) return firstTexts.get(s.id);
  const saved = { ctx, layout, sceneFade, wordFade, measuring }, scene = window.__sceneId;
  const meter = measuringContext();
  let found = Infinity;
  setDrawing({ measuring: true, ctx: meter });
  try {
    for (let t = s.voice_start - 0.3; t <= s.voice_start + CUT_LAG + 0.2; t += 1 / 60) {
      setDrawing({ layout: { texts: [], scene: s.id }, sceneFade: 1, wordFade: 1 });
      meter.setTransform(1, 0, 0, 1, 0, 0);
      meter.save();
      push(s, t);
      scenes[s.id](s, t);
      meter.restore();
      if (layout.texts.some((v) => contrastOf(v.color, v.alpha) >= 4.5)) {
        found = t;
        break;
      }
    }
  } finally {
    setDrawing(saved);
    window.__sceneId = scene;
  }
  firstTexts.set(s.id, found);
  return found;
}
var cutAt = (v) => {
  const voice = Math.max(v.start, v.voice_start, v.words?.[0]?.start ?? -Infinity);
  return scenes[v.id]?.carries ? voice : Math.min(voice + CUT_LAG, Math.max(voice, firstTextOf(v)));
};
var visualStart = (i) => continues(i) ? cutAt(film.segments[i]) : film.segments[i].start;
function drawScene(s, t, fade, words = fade) {
  const scene = scenes[s.id];
  if (!scene) throw Error(`Unimplemented scene ${s.id}`);
  layout.scene = s.id;
  setDrawing({ sceneFade: fade, wordFade: words });
  window.__sceneId = s.id;
  ctx.save();
  push(s, t);
  scene(s, t);
  ctx.restore();
  layout.scene = null;
  setDrawing({ sceneFade: 1, wordFade: 1 });
  window.__sceneId = null;
}
function drawAt(t) {
  setDrawing({ layout: { texts: [], scene: null, time: t } });
  ctx.setTransform(resolution, 0, 0, resolution, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = P.ground;
  ctx.fillRect(0, 0, 1920, 1080);
  const creditStart = film.duration - film.credits_duration;
  if (t >= creditStart) {
    credits(t);
    publish(t);
    return;
  }
  const index = Math.max(
    0,
    film.segments.findLastIndex((v2) => v2.start <= t)
  );
  const s = film.segments[index];
  const next = film.segments[index + 1], prev = film.segments[index - 1];
  let shown = index;
  while (shown > 0 && continues(shown) && t < visualStart(shown)) shown--;
  if (next && continues(index + 1) && t >= visualStart(index + 1)) shown = index + 1;
  const fadeIn = index === 0 || prev && prev.chapter === s.chapter ? 1 : ramp(t, s.start, 0.6);
  const fadeOut = next && next.chapter === s.chapter ? 1 : 1 - ramp(t, s.end - 0.5, 0.5);
  const keep = Math.min(fadeIn, fadeOut);
  const v = film.segments[shown];
  drawScene(v, t, keep);
  chapterCard(next && opensChapter(next) && t >= next.start - 0.15 ? next : s, t);
  runningHead(s, t);
  partHead(v, t);
  caption(t);
  publish(t);
}
function publish(t) {
  window.__filmLayout = { time: t, texts: layout.texts };
}
window.renderFrame = (t) => drawAt(t + (film.render_offset || 0));
window.renderCover = () => {
  setDrawing({ layout: { texts: [] } });
  ctx.setTransform(resolution, 0, 0, resolution, 0, 0);
  ctx.fillStyle = P.ground;
  ctx.fillRect(0, 0, 1920, 1080);
  titleSignature(1);
};
window.__filmScenes = scenes;
window.renderFrame(0);
