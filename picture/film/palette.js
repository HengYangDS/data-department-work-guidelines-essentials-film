/* The film's colours and its two label sizes: the DDWG palette. Every mark and label is ink on the ground; lines, rails
 * and inactive marks are the line tone, and secondary text is the muted tone. Evidence, authority and unknown keep their
 * colours: evidence (facts, records, checks) is blue, authority (a basis for action, a decision) gold, and an unknown or a
 * refusal clay, each beside its name, never as the only carrier of meaning. They colour marks, not names.
 *
 * Text reads at 5:1 over the ground at full ink and at a list's second level (0.64): ink 15.0:1 and 6.7:1, the muted
 * tone 11.3:1 and 5.3:1. The muted tone is the DDWG palette's #9BA8B1 at the same hue and saturation, raised just far
 * enough for 4.5:1 at the first second level, 0.58: #9BA8B1 itself falls to 3.3:1 there and to 4.3:1 under a refusal's
 * dim. The second level rose to 0.64 when the reviews measured 4.5:1 with no margin once antialiased. The keys stay the
 * DDWG keys, at 8.4:1, 10.4:1 and 5.5:1 at full ink but 3.6:1, 4.2:1 and 2.6:1 at the first second level, so no list
 * name takes them. Nor does a key mark rest below the ink that holds it at 4.5:1: a refusal's cross keeps full ink while
 * its name steps to a list's second level, a seal's inner ring stands at 0.75 of its stamp, a false page's rows take its
 * outline's full ink, and a retired rule's seal leaves as its page fades. The line tone (3.9:1) carries no text. */

export const P = {
  ground: "#0F1519",
  row: "#1E2932",
  line: "#63758B",
  ink: "#ECE8DF",
  muted: "#C4CCD1",
  accent: "#C9785C",
  evidence: "#7DB7D8",
  authority: "#E0BF78",
  unknown: "#C9785C",
};
/* One label size for both editions: the film's labels read at one size, 29 px after the label scale below. */
export const LABEL = 26;
/* Scene labels are drawn this much larger than their layout size so they stay legible on small screens; captions,
 * chapter cards and title cards keep their own sizes. */
export const TYPE = 1.12;
