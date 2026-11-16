## ADDED Requirements

### Requirement: Marks keep the film's pace

The film SHALL declare its pace limit of 450 px/s at 1080p, and no glide or flow SHALL move faster outside a stage cut. No chapter title SHALL travel: a chapter card dissolves where it stands, and the running head and the part's name fade in at their own places. In edition 1.0.2 one mark is excepted by name: the turned-down end of 01.3's rail, which travels with the rail's drawing end at the draw pace of 820 px/s as the row opens.

#### Scenario: The picture gate holds the pace limit

- **WHEN** the staged film's motion is audited for each edition
- **THEN** no stretch moves faster than the declared pace limit

#### Scenario: A chapter opens without a travelling title

- **WHEN** the composition is traced through each chapter opening of each edition
- **THEN** the chapter card's title and the running head keep their places while they fade
