# CardCreator

A browser-based studio for designing and printing physical card-game prototypes. Includes a card library, live editor, artwork uploads, three shared layouts, draggable text/shape/image layers, shared card backs, quantities, JSON project backups, and print/PDF output at 63 × 88 mm.

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

Projects save in this browser's local storage. Export JSON backups to move between devices or preserve work. Front artwork is resized to 1,000 pixels; layer and back artwork to 1,600 pixels and included in backups. No account or backend is required. Browser storage has a quota; the app reports when saving fails.

## Layers and backs

Open Layers to add text, rectangle, or image layers over the selected card. Drag layers on the canvas or edit X/Y/width/height as percentages. Text size and colors are editable; Move up/down changes stacking order. Layers are constrained to the card, with up to 50 per side. Delete removes the selected layer. Duplicating a card creates independent layers.

Use the Front/Back switch to edit the shared back. Its title, background color, artwork, and custom layers apply to the whole deck. Older project files automatically receive defaults for these features. JSON exports include all layers and the shared back.

## Print and PDF export

Select the Print tab to choose the output, then click Print deck:

- **A4 fronts:** nine cards per sheet, honoring copy quantities.
- **A4 duplex:** alternating front/back sheets. Long-edge flip mirrors columns; short-edge flip mirrors rows. Blank positions remain aligned, and the grid is centered on A4. Test one sheet at 100% scale before printing a full deck; physical printers may need alignment adjustments.
- **Individual bleed pages:** a front and back for each unique card (copy quantities are ignored). Each 75 × 100 mm page contains a 63 × 88 mm trim area, 3 mm bleed on each edge, and crop marks outside the bleed. The card accent/background color extends into bleed; artwork is not extended beyond trim.

Use background graphics, disable headers/footers, and print at 100%. To export PDF, choose Save as PDF and preserve the document page size. Keep important content 3 mm inside the trim edge. Long text can exceed its fixed layer or card frame.

PDF output uses browser RGB and does not include PDF/X, CMYK conversion, or explicit PDF trim/bleed box metadata. Confirm acceptance with your printer. The exported bleed geometry is available now; printer-specific prepress remains a separate step.

CSV data binding, cloud collaboration, undo history, rotation, and fully replacing the preset card frame remain future work.

## Browser verification

With the development server running on port 5173, run `npm run test:browser`. The smoke check uses `/usr/bin/chromium`; set `CHROMIUM_PATH` to another installed Chromium executable if needed. It exercises editing, persistence, duplication, artwork, JSON import/export, print pagination and physical dimensions, mobile overflow, layer dragging, independent duplicated layers, back persistence, duplex pagination, and bleed dimensions. It uses an isolated browser context and writes screenshots and PDFs under `/tmp`.
