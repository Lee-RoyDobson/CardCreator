# CardCreator

A browser-based studio for designing and printing physical card-game prototypes. Includes a card library, live editor, artwork uploads, three shared layouts, quantities, JSON project backups, and A4 print sheets at 63 × 88 mm.

## Develop

Use Node.js 20.19+ (tested with Node 24).

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
```

Projects save in this browser's local storage. Export JSON backups to move between devices or preserve work. Images are resized to 1,000 pixels and included in backups. No account or backend is required. Browser storage has a quota; the app reports when saving fails.

## Print

Choose Print deck and print or save as PDF on A4, at 100% scale, with background graphics on and headers/footers off. Pages contain up to nine cards including configured copies. The safe-area overlay is an editing guide. Output includes cut outlines, but no commercial bleed, card backs, or duplex alignment. Keep text within the card; long text can exceed the fixed frame.

This initial version uses preset layouts. Arbitrary drag-and-drop layers, CSV data binding, cloud collaboration, commercial print export, and undo history are future work.

## Browser verification

With the development server running on port 5173, run `npm run test:browser`. The smoke check uses `/usr/bin/chromium`; set `CHROMIUM_PATH` to another installed Chromium executable if needed. It exercises editing, persistence, duplication, artwork, JSON import/export, print pagination and physical dimensions, and mobile overflow. It uses an isolated browser context and writes screenshots and a PDF under `/tmp`.
