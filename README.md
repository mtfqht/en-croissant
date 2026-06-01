<br />
<div align="center">
  <a href="https://github.com/franciscoBSalgueiro/en-croissant">
    <img width="115" height="115" src="https://github.com/franciscoBSalgueiro/en-croissant/blob/master/src-tauri/icons/icon.png" alt="Logo">
  </a>

<h3 align="center">En Croissant (Custom Fork)</h3>

  <p align="center">
    The Ultimate Chess Toolkit
    <br />
    <a href="https://www.encroissant.org"><strong>encroissant.org</strong></a>
    <br />
    <br />
    <a href="https://discord.gg/tdYzfDbSSW">Discord Server</a>
    ·
    <a href="https://www.encroissant.org/download">Download</a>
    .
    <a href="https://www.encroissant.org/docs">Explore the docs</a>
  </p>
</div>

> Note: This is a customized fork of the original [En Croissant](https://github.com/franciscoBSalgueiro/en-croissant) repository.

## What's New in This Fork

Localization & RTL Support
- Arabic Language Support: Added a complete Arabic translation (ar-SA).
- Dynamic RTL Layout: Integrated DirectionProvider to automatically switch the UI between Left-to-Right (LTR) and Right-to-Left (RTL) based on the selected language.
- Translated Core Elements: Enabled translations for Opening board states and Game Report annotations (Blunder, Mistake, Brilliant, etc.).

Polyglot Opening Book Integration
- Local .bin Support: You can now load local Polyglot opening books directly into the Analysis Panel.
- UI Settings: Added dedicated settings under the "Repertoire" tab to easily browse, select, and toggle the opening book file.
- Performance Optimization (Rust): Implemented backend caching and non-blocking I/O threading to prevent UI freezing when reading large .bin files.

Database & Tables Enhancements
- Column Sorting: Added full sorting capabilities to the Database Games Table (sort by Player Names, Date, Result, and Ply Count).
- Result Filtering: Expanded the local database search options to allow filtering by game results (White Won, Black Won, Draw, or Any).

UI/UX & Bug Fixes
- Better Tablebase Formatting: Fixed UI clipping issues for Tablebase outcome badges and improved DTM formatting.
- Stats Bug Fix: Fixed an edge-case bug in the game statistics calculation when analyzing an empty board.

---

## Original Features

- Store and analyze your games from [lichess.org](https://lichess.org) and [chess.com](https://chess.com)
- Multi-engine analysis. Supports all UCI engines
- Prepare a repertoire and train it with spaced repetition
- Simple engine and database installation and management
- Absolute or partial position search in the database

<img src="https://github.com/franciscoBSalgueiro/encroisssant-site/blob/master/public/showcase.webp" />

## Building from source

Refer to the [Tauri documentation](https://tauri.app/start/prerequisites/) for the requirements on your platform.

En-Croissant uses pnpm as the package manager for dependencies. Refer to the [pnpm install instructions](https://pnpm.io/installation) for how to install it on your platform.

```bash
git clone https://github.com/franciscoBSalgueiro/en-croissant
cd en-croissant
pnpm install
pnpm build
```

The built app can be found at `src-tauri/target/release`

## Donate

If you wish to support the development of this GUI, you can do so [here](https://encroissant.org/support). All donations are greatly appreciated!

## Contributing

For contributing to this project please refer to the [Contributing guide](./CONTRIBUTING.md).

## License

This software is licensed under GPL-3.0 License.