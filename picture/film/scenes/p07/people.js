/* Part 07, stages A, B and C: human-AI collaboration. A: people and an Agent joined by one relationship, named as the
 * whole; the Agent works inside a delegated boundary that grows with what it holds, extends what people can do, gives
 * no organizational authorization and makes no commitments; what stays with people builds under them. B: the ten pages
 * return, and the decision they should have served comes before them. C: a clear boundary, not a pile of context; the
 * five things a consequential delegation states build inside it. */

import { ctx } from "../../canvas.js";
import { link } from "../../drawing/links.js";
import { dot, fill, measure, ring, stroke } from "../../drawing/strokes.js";
import { agent, documentIcon } from "../../drawing/symbols.js";
import { listIn, named } from "../../naming/lists.js";
import { NAME_GAP, nameText, rejectedName } from "../../naming/names.js";
import { P } from "../../palette.js";
import { en, L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { centring, early, flowOf } from "../p05/kit.js";

/* People drawn as one mark: their heads one fill and their shoulders one stroke, so a group named once does not read
 * as members that each wait for a name. Each person is [x, y]. */
export function people(points, { alpha = 1, color = P.ink, size = 1 } = {}) {
  if (alpha < 0.01) return;
  const r = 15 * size;
  fill(
    () =>
      points.forEach(([x, y]) => {
        ctx.moveTo(x + r, y - r * 1.15);
        ctx.arc(x, y - r * 1.15, r, 0, Math.PI * 2);
      }),
    { color, alpha },
  );
  stroke(
    () =>
      points.forEach(([x, y]) => {
        const a0 = Math.PI * 1.08,
          cy = y + r * 1.9;
        ctx.moveTo(x + r * 1.55 * Math.cos(a0), cy + r * 1.55 * Math.sin(a0));
        ctx.arc(x, cy, r * 1.55, a0, Math.PI * 1.92);
      }),
    { color, alpha, width: 3 * size },
  );
}
/* A boundary that grows with what it holds: a thin solid rounded outline, the edge of a valid scope. */
export function boundary(x0, y0, x1, y1, { alpha = 1, color = P.line, width = 2.5 } = {}) {
  if (alpha < 0.01) return;
  stroke(() => ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 14), { color, alpha, width });
}

/* A: the relationship. A group of people at the left and the Agent at the right on one line, joined by a link that
 * carries the delegation and is named over its middle as the whole relationship. The Agent's boundary closes round it,
 * the link running in through its side, and grows just before each thing it holds is said: what it extends, then what
 * it cannot give. It grows about the Agent from a top edge that stays, so its name, centred over that edge, and the
 * link's name, over the part of the link the grown boundary leaves outside, never move. Under the people, what stays
 * with them builds as one list, and a tinted field gathers it when it is said to stay. */
const A = { y: 410, px: 560, ax: 1260 };
const GROUP = [
  [-62, -34],
  [0, -40],
  [62, -34],
  [-31, 34],
  [31, 34],
];
export function collaborationStage(s, t, c, g) {
  const term = L("调查、推理和动手", "Investigation, reasoning, action"),
    wide = Math.max(measure(term) / 2 + 34, L(150, 230)),
    grow = soon(t, c.extend - 0.6, 0.45),
    deep = soon(t, c.refusals[0] - 0.6, 0.45),
    halfW = mix(110, wide, grow),
    y = A.y,
    ax = A.ax,
    px = A.px;
  people(
    GROUP.map(([dx, dy]) => [px + dx, y + dy]),
    { alpha: g, size: 1.05 },
  );
  nameText(L("人", "Humans"), px, y + 96 + NAME_GAP, {
    valign: "top",
    alpha: g * named(t, c.people),
  });
  // The Agent's name may lead its words within its clause: in English the clause opens the thought.
  const agentIn = g * (en ? early(t, c.first1, c.agent) : named(t, c.agent));
  agent(ax, y, { alpha: g, size: 2 });
  nameText(L("智能体", "Agents"), ax, y + 44 + NAME_GAP, { valign: "top", alpha: agentIn });
  // The relationship, named over its middle: the English waits for its caption line to pass, so the name does not
  // repeat the line that says it. The link reaches the Agent across the boundary's side; its name centres on the part
  // that stays outside the grown boundary, two gaps clear of the side.
  const left = px + 110,
    outEnd = ax - wide - 2 * NAME_GAP,
    collab = g * (en ? named(t, c.agent - 0.05) : early(t, c.first1, c.collab));
  link(left, y, ax - 56, y, { alpha: g, flow: flowOf(t, 0.3), width: 2.5 });
  nameText(L("人与人工智能的协作", "Human–AI collaboration"), (left + outEnd) / 2, y - NAME_GAP, {
    valign: "bottom",
    alpha: collab,
  });
  // The delegated boundary round the Agent, growing as it holds more.
  const top = y - 76,
    bottom = mix(y + 104, mix(y + 160, y + 270, deep), grow),
    inBoundary = g * early(t, c.boundaryClause, c.boundary);
  boundary(ax - halfW, top, ax + halfW, bottom, { alpha: inBoundary });
  nameText(L("委托范围", "A delegated boundary"), ax, top - NAME_GAP, {
    valign: "bottom",
    alpha: inBoundary,
  });
  nameText(term, ax, y + 128, { alpha: g * named(t, c.extend) });
  L(["组织的授权", "承诺"], ["Organizational authorization", "Commitments"]).forEach((v, i) =>
    rejectedName(v, ax, y + 180 + i * 48, {
      alpha: g * listIn(t, c.refusals, i),
      mark: ramp(t, c.refusals[i] + 0.3, 0.3),
      set: "refusals",
    }),
  );
  // What stays with people: a column under them, gathered in a tinted field that opens as they are said to stay.
  // The field opens from just round the names to its full margin, so its edges never cross them and it is still
  // settling as the thought ends.
  const ats = c.stays,
    open = soon(t, c.stay - 0.1, 1.3),
    ys = [0, 1, 2, 3].map((k) => y + 196 + k * 44),
    m = mix(8, 30, open);
  if (open > 0.01)
    fill(
      () =>
        ctx.roundRect(px - 100 - m, ys[0] - 15 - m, 200 + 2 * m, ys[3] - ys[0] + 30 + 2 * m, 14),
      {
        color: P.row,
        alpha: g * Math.min(1, open * 3),
      },
    );
  L(
    ["方向", "授权", "决定", "后果的责任"],
    ["Direction", "Authorization", "Decisions", "Responsibility"],
  ).forEach((v, i) => nameText(v, px, ys[i], { alpha: g * listIn(t, ats, i), set: "stays" }));
}

/* B: the ten pages return, an Agent beside its stack, which climbs a page at a time as the thought begins; the stage
 * stands centred on them. The decision they should have served arrives over the Agent, a ring with its point named
 * over it, inside the extent the Agent and its pages already hold, so the stage never moves; its link runs down to the
 * Agent, the decision first. */
const B = { y: 530, decision: 200 };
const PAGE = [190, 250];
function stack(x, y, pages, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  const n = Math.round(pages),
    [w, h] = PAGE;
  stroke(
    () => {
      for (let k = n - 1; k >= 1; k--) {
        const ox = x + k * 7,
          oy = y - k * 7;
        ctx.moveTo(ox + w, oy - h + 7);
        ctx.lineTo(ox + w, oy - h);
        ctx.lineTo(ox + 7, oy - h);
      }
    },
    { color: P.muted, alpha, width: 2 },
  );
  documentIcon(x, y - h, w, h, { alpha, rows: 4 });
}
export function pagesStage(s, t, c, g) {
  const decided = g * named(t, c.decision),
    // Extents from x: the Agent's left at -266 and the stack's right at +166.
    x = 960 + (266 - 166) / 2,
    pages = g * early(t, c.first2, c.pages),
    climbed = 4 + 6 * soon(t, c.first2, 3.6);
  agent(x - 200, B.y, { alpha: pages, size: 3 });
  stack(x - 87, B.y + 125, climbed, { alpha: pages });
  nameText(L("十页分析", "The ten pages"), x + 40, B.y + 125 + NAME_GAP, {
    valign: "top",
    alpha: pages,
  });
  const dx = x - 200,
    dy = B.y - B.decision;
  ring(dx, dy, 52, { color: P.authority, alpha: decided, width: 3.5 });
  dot(dx, dy, 12, { color: P.authority, alpha: decided });
  nameText(L("哪个决定", "Which decision"), dx, dy - 52 - NAME_GAP, {
    valign: "bottom",
    alpha: decided,
  });
  link(dx, dy + 60, dx, B.y - 78, {
    alpha: decided,
    upto: soon(t, c.decision, 0.7),
    flow: t > c.decision + 0.8 ? flowOf(t, 0.4) : null,
  });
}

/* C: a clear boundary round the Agent, as wide from the first as the five things it will hold need, with even room
 * above and below the Agent, and named at the left of its top edge; the pile of context at its left, lower, by where
 * the list builds, refused; and the five things a consequential delegation states build as one list in a column inside
 * the boundary, which deepens just before each is said, down from a top edge that stays. The stage stands once at the
 * midpoint of the places that centre the boundary alone and the boundary with the pile: the boundary's name already
 * reaches toward where the pile comes. */
const C = { y: 425, pile: 170, clear: 34 };
const PILE = () => L("一堆背景材料", "A pile of context");
export function boundaryStage(s, t, c, g) {
  const ats = c.five,
    items = L(
      ["目的和范围", "交什么", "限制和权限", "怎么验收", "什么时候停"],
      ["Purpose and scope", "Deliverable", "Limits and permissions", "Acceptance", "When to stop"],
    ),
    half = Math.max(...items.map((v) => measure(v) / 2 + 36)),
    name = L("边界", "A clear boundary"),
    // The Chinese boundary, narrower as its names are, takes more room round the Agent, so its first picture is not a
    // sliver; the English one stays smaller than a frame that holds a group, which must be half filled.
    room = L(105, 72),
    // The pile's words and their cross centre under it, `C.clear` from the boundary's side.
    pileHalf = Math.max(60, (measure(PILE()) + 42) / 2),
    toPile = half + C.clear + pileHalf,
    nameLeft = -half - NAME_GAP - measure(name),
    x = (centring(nameLeft, half) + centring(Math.min(nameLeft, -toPile - pileHalf), half)) / 2,
    grown = ats.reduce((v, at) => v + soon(t, at - 0.6, 0.45), 0),
    y = C.y,
    top = y - room,
    // The first thing said takes the bottom from the Agent's room to under the first row (y + 161), each further one a
    // row lower.
    bottom = mix(y + room, y + 161, Math.min(1, grown)) + 52 * Math.max(0, grown - 1);
  agent(x, y, { alpha: g, size: 2 });
  boundary(x - half, top, x + half, bottom, { alpha: g, width: 3.5 });
  nameText(name, x - half - NAME_GAP, top, {
    align: "right",
    alpha: g * early(t, c.first3, c.clear),
  });
  items.forEach((v, i) =>
    nameText(v, x, y + 120 + i * 52, { alpha: g * listIn(t, ats, i), set: "five" }),
  );
  // The pile of context, refused.
  const pile = g * named(t, c.pile),
    px = x - toPile,
    py = y + C.pile;
  stroke(
    () => {
      for (let k = 0; k < 5; k++)
        ctx.roundRect(px - 60 + (k % 2) * 14, py + 10 - k * 16, 110, 12, 3);
    },
    { color: P.muted, alpha: pile, width: 2.5 },
  );
  rejectedName(PILE(), px, py + 40 + NAME_GAP, {
    valign: "top",
    alpha: pile,
    mark: pile,
  });
}
