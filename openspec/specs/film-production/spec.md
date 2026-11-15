# film-production Specification

## Purpose

Explain the essentials of the Data Department Work Guidelines, as their documents state them at one pinned release, through two independently understandable ten-minute films in Chinese and English, built on `filmkit` with verified media, explicit review limits and governed delivery.

## Requirements

### Requirement: The films explain the guidelines' essentials as their pinned documents state them

The production SHALL explain the guidelines as the cited sections of their documents state them at the commit the source manifest pins: the four failures one made-up incident invites, what the guidelines are and what data work is worth, the two kinds of authority, the four boundaries, data qualified for a use, evidence that limits a claim, human–AI collaboration, and what makes the next attempt better. What the guidelines are for and why they hold SHALL come before how to follow them.

#### Scenario: A viewer follows the whole argument

- **WHEN** a viewer watches either edition once
- **THEN** the incident and its failures are stated before the guidelines' answers, and what the guidelines are for before how to follow them
- **AND** each of the opening's four failures meets its answer later in the film
- **AND** each term is explained before it is relied on, and the ending returns to the data the next person uses

#### Scenario: Each sentence is faithful, clear on first hearing and idiomatic

- **WHEN** an independent language review reads every thought and label of both editions against its cited sections and the concept contract
- **THEN** fidelity, concept fidelity, first-hearing clarity and idiom each score at least 95, with no material finding
- **AND** each concept keeps one term across an edition and is explained the first time it is heard
- **AND** the Chinese reads as spoken Chinese, not as a translation of the English

### Requirement: Claims keep the scope of their sources

Every claim SHALL keep the conditions, modality and scope of its cited sections. The late price data and the example delegation SHALL be stated as illustrations, and the narration SHALL say that the incident is made up.

#### Scenario: Each part follows its cited sections

- **WHEN** a reviewer reads each part of either edition against the sections its script cites at the pinned commit
- **THEN** every claim is found there with its conditions, modality and scope
- **AND** the incident and the delegation are heard as illustrations, not as recorded events

### Requirement: The sources are pinned

The source manifest SHALL record the guidelines' repository, the one commit the scripts were checked against and the SHA-256 of each cited document at that commit. Every part of each script SHALL name the document sections it states.

#### Scenario: A cited document that differs refuses

- **WHEN** the pinned sources are verified against a clone of the guidelines' repository
- **THEN** each cited document at the pinned commit has the recorded SHA-256
- **AND** a document that differs, or a part that names no cited section, refuses and is named

### Requirement: Concepts keep their source definitions

The film SHALL keep the DDWG films' concept contract, which binds each guideline concept the narration, captions or picture name to its passage at the pinned commit, its essence and one approved rendering in each edition. Both editions SHALL be composed from that contract, not translated from each other. Each segment SHALL declare the concepts it states, the same in both editions, and an edition SHALL name a concept only by its approved rendering.

#### Scenario: A rendering that departs from the contract refuses

- **WHEN** the scripts and the picture are checked before narration
- **THEN** each concept a segment declares appears in that segment by its approved rendering
- **AND** a counterexample the contract records for a concept, or a concept declared in one edition of a segment only, refuses and is named

#### Scenario: A rendering changes in the DDWG films' contract first

- **WHEN** a rendering is to change
- **THEN** the user approves it in the DDWG films' contract before this film's copy changes
- **AND** this film's copy names the commit it was copied from

#### Scenario: A quotation that no longer matches its source refuses

- **WHEN** the contract is verified against a clone of the guidelines' repository
- **THEN** each quoted passage is found verbatim in its document at the pinned commit
- **AND** a passage that is not found refuses and is named

### Requirement: Each edition meets the media contract

Each edition SHALL be exactly 600 seconds at native progressive 60 fps, in four chapters, as a UHD master and a 1080p viewing film, each with captions and without them, with 48 kHz stereo narration only, no music and purposeful 2D motion. Each film SHALL carry the release metadata its script declares, small single-line captions where it is captioned, a designed cover with the author Yang HENG, a transcript, chapters and a player.

#### Scenario: A packaged edition reads back its contract

- **WHEN** an edition is packaged
- **THEN** whole-file decoding, the exact duration and frame count, the chapters, the caption bounds and the release metadata read back as its script declares them
- **AND** the cover is 16:9 and names the title and Yang HENG

### Requirement: The runtime is fitted with designed pauses

Each edition SHALL be spoken at the narrator's native articulation, keeping the natural pauses inside each take, and its runtime SHALL be fitted only through the designed pauses between thoughts and between parts. Speech SHALL NOT be time-stretched, and necessary punctuation SHALL NOT be removed to fit the runtime.

#### Scenario: Speech that does not fit refuses

- **WHEN** an edition's recorded speech and its designed pauses cannot fill exactly 600 seconds within the bounds of its pace
- **THEN** the assembly refuses before output, and the text or, by the user's decision, the runtime changes before the next assembly

### Requirement: The pauses keep the approved samples' pace

The pauses between thoughts SHALL lie between four fifths and four thirds of the pauses between paragraphs in the samples the user approved, about 1.7 seconds in Chinese and 2.2 seconds in English, and each pause between parts SHALL be longer than them and at most 5 seconds.

#### Scenario: A qualified narration meets its pace

- **WHEN** an edition's assembled narration is measured
- **THEN** its median pause between thoughts lies within those bounds of the edition's approved value, and each pause between parts is longer than that median and at most 5 seconds
- **AND** every selected take is native model output without a tempo transform

### Requirement: Both editions speak with one narrator

Both editions SHALL use the narrator that the DDWG and ETHOS films share: the Chinese cast speaks from a reference derived from the identity root in recorded steps, and the English cast from the unmodified English reference, each with the qualified model revision, temperature 0.46 and an in-context repetition penalty of 1.05.

#### Scenario: The narrator's identity is bound

- **WHEN** a cast is checked
- **THEN** each reference recording has its recorded SHA-256
- **AND** a derived reference records its derivation from the identity root, with every step's mode, text, seed and settings

### Requirement: Each take is complete and read in context

Each selected take SHALL end on its own and SHALL read each context-dependent word as its context requires. Every Chinese character whose dictionary reading is ambiguous SHALL have its reading in context declared, and every name SHALL have one declared spoken form. The assembled soundtrack SHALL bring every thought to quiet before the silence that follows it, so that no thought's voice is faded out while it is still heard.

#### Scenario: An undeclared ambiguous reading refuses

- **WHEN** the Chinese script is checked before narration
- **THEN** every character with more than one dictionary reading has a declared reading for its context
- **AND** an occurrence without one, or a declared reading the narration never says, refuses and is named

#### Scenario: Declared readings and names are heard as declared

- **WHEN** an edition's narration is qualified
- **THEN** each declared name and reading was auditioned before full narration, and each of its occurrences was heard as declared, by recognition, by comparison with takes of its homophones or by the user's ear
- **AND** a misreading is retaken before the user listens to the narration
- **AND** every selected take's last syllable is complete and dies away inside the take

#### Scenario: The assembled soundtrack releases no thought

- **WHEN** an edition's soundtrack is assembled
- **THEN** the last 10 ms of each thought before the silence that follows it lie at or below -55 dBFS before the program gain
- **AND** the assembly record shows no released tail for any thought

### Requirement: The user's listening precedes the picture

The user SHALL listen to both qualified narrations before the picture is planned, and the picture SHALL follow only narration the user accepted. A text or narration change after that acceptance SHALL reopen the narration and every later acceptance.

#### Scenario: The picture follows accepted narration

- **WHEN** picture planning starts
- **THEN** a recorded decision of the user accepts each edition's current narration
- **AND** a later text or narration change invalidates that decision and every acceptance after it

### Requirement: The picture follows the DDWG visual system

The composition SHALL keep every name with its mark, placed by a primitive; build and remove lists whole, never as a sliding window; use two text sizes, without pills or dot joins; draw relations as orthogonal links with end dots; hold at most twelve names in a thought, balanced on the content centre, and grow a list that builds over one thought about that centre; never give a concept the emphasis of a person; and change the picture on the words that name its subject.

#### Scenario: Names and lists keep the visual system

- **WHEN** the composition tests and the frame audit run for each edition
- **THEN** every drawn name has its mark, every list enters and leaves whole, and no thought shows more than twelve names
- **AND** a list that builds over one thought keeps its lit box within the balance bound of the content centre

### Requirement: A render waits for the picture audits

The staged film SHALL pass the engine's geometry, still, motion and sync audits, and a render SHALL start only when no audit of the current composition and timeline reports a gated finding.

#### Scenario: The staged film passes the picture audits

- **WHEN** the staged film is audited
- **THEN** the real-browser geometry check finds no overlap, safe-area overflow or label collision
- **AND** the still, motion and sync audits report no empty picture under speech, ghost, residue, stall, off-balance thought, or label that appears early or late against its words

#### Scenario: A gated finding holds the render

- **WHEN** a frame audit of the current composition and timeline reports a gated finding
- **THEN** the render does not start, whatever the audit's exit status

### Requirement: Text is drawn in fonts that cover it

Text with a Chinese character SHALL be drawn in Noto Sans CJK SC subset to the characters the film draws, and Latin-only text in unmodified IBM Plex Sans. Each font SHALL map every character drawn with it.

#### Scenario: A drawn character missing from its font refuses

- **WHEN** a script or the composition draws a character that its font does not map
- **THEN** the font test fails and names the character and the font

### Requirement: The final films earn an evidence-bound review

The final films SHALL meet the review contract the declaration states: every declared dimension, each stating what an excellent film shows, at least 95, and the overall score, their mean, at least 95, scored against the exact final files. The reviewer SHALL check every pattern the owner has rejected in an earlier film. The review SHALL keep observed modalities apart from unassessed ones, and human listening SHALL be reported as recorded, never inferred from model review or measurements.

#### Scenario: A review that binds the final films qualifies

- **WHEN** the production review of both editions is verified
- **THEN** it names both editions' movie hashes, the current scripts, the concept contract and the composition
- **AND** a missing dimension, a mismatched mean, a score below its floor or a material finding refuses

#### Scenario: Each quality is scored on its own

- **WHEN** the review contract is read
- **THEN** it scores faithfulness, concept fidelity, narrative clarity, language quality, voice quality, narration performance, pronunciation, visual explanation, typography, visual aesthetics and colour, sound-picture continuity, and credits and delivery craft as separate dimensions
- **AND** voice quality states the measured clarity a narration must reach

#### Scenario: A rejected pattern cannot pass

- **WHEN** a reviewer finds in either edition a pattern the owner has rejected, such as a hoarse voice, a swallowed phrase tail, a ground with a colour cast or an opening without its title card
- **THEN** the finding is material and the review refuses

### Requirement: The delivery reads back from Documents

Both qualified editions SHALL be delivered as whole files to `~/Documents/ddwg-essentials-film/` and read back. The delivery SHALL NOT touch the folder of the 25-minute DDWG films.

#### Scenario: A delivery reads back

- **WHEN** both editions are delivered
- **THEN** every delivered file's SHA-256 equals its packaged file's, and both players open in a real browser
- **AND** `~/Documents/ddwg-introduction-film/` is unchanged
