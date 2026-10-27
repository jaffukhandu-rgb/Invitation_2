# Invitation 2 — React + Vite

Converted from the original single-file HTML invitation.

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Assets

The original HTML references files such as:

- `assets/medallion.png`
- `assets/monogram.jpg`
- `assets/hero-video.mp4`
- `assets/music.mp3`

Copy your existing `assets` folder into:

```text
public/assets/
```

The React version keeps those original asset paths.

## Notes

The existing visual CSS and DOM-driven JavaScript were preserved rather than redesigning the invitation. The React app mounts the original markup and starts the existing interaction script after mount.
