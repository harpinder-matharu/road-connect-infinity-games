# Road Connect

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Add New Level](#addNewLevel)
4. [Gameplay](#gameplay)
   - [Controls](#controls)
   - [Objectives](#objectives)
   - [Support](#support)
5. [Coding Practices](#CodingPractices)
6. [Credits](#credits)
7. [License](#license)

## Introduction

Welcome to **ROAD CONNECT**! You'll dive into a challenging and addictive puzzle experience where your goal is to create seamless roads by rotating different shapes. Each level presents a jumbled array of road segments in various shapes and angles, and it's up to you to rotate these segments correctly to form a continuous path that connects all points..

## Installation

### Prerequisites

- Cocos creator 3.8.0.
- VS code.

### Steps

1. **Change Scene** Select lobby scene from the dropdown.
2. **Play** Click Play Button.

## Add New Level

Steps to create new Level

1. **Run Scene:** Select the LevelCreator scene from the dropdown.
2. **Drag & Drop:** Drag and drop a road from the menu onto the grid.
3. **Change Angle:** Change the angle of the road by clicking on it.
4. **Undo Single Grid:** Drag and drop the last empty road to clear a particular block.
5. **Clear Grid:** Click the "Clear" button to clear the grid.
6. **Save Level:** Click the "Save" button to download the file. Rename the file with the appropriate level number and add it to the resources > Levels folder, e.g., level11.json.
7. **Change Max Level:** Change the value of the "MAX_LEVELS" variable to the maximum number of levels in the constant.ts file.

## Gameplay

### Links

1. **Game** [https://roadconnect-harpinder.netlify.app/].
2. **Game Locked** [https://roadconnect-harpinder-locked.netlify.app/]
3. **Level creator** [https://level-creator-harpinder.netlify.app/].

### Controls

- **Touch/Mouse:**

  - Rotate: Click

### Objectives

completing levels, solving puzzles.

### Support

For further assistance, please contact our support team at [harpinder541@gmail.com].

## Coding Practices

### Initial Scene: Lobby

Responsible for:

- Logo animation
- Resource loading
- Persistnode integration
- UI creation
- Level selection interface

### Persistnode

- Integrated to ensure that attached components, such as the music/sound manager, continue to function across scenes.

### Localization Support

- Integrated Cocos extension i18n.
- Supported languages: English, French, Portuguese.

### Multi-Resolution Support

- Utilizes the `ScreenAdapter.ts` class for multi-resolution handling.
- Attached to the canvas.
- Adjusts resolution based on screen ratio to fit height or width on resize.
- Widget is used, it can automatically align the current node to any position in the parent node's bounding box, or constrain the size, making game easily adaptable to different resolutions.

### Gameplay

- Creates a map (roadTypeKeyPair) of road segment prefabs to avoid iteration.
- Loads levels and checks if a level is already loaded. If not in cache, loads it from resources.
- Creates levels and updates properties of each road segment.
- Checks game progress by comparing the resultant angle of each segment with the current angle.
- Loads the next level upon completion; if it is the last level, reloads the first level.

## Credits

List the team members and their roles:

- **Game Designer:** Infinity Games
- **Lead Developer:** Harpinder
- **Artists:** Infinity Games
- **Music Composer:** Infinity Games
