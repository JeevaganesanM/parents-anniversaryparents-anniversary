# Parents' Vintage Anniversary Website

A responsive React + TypeScript scrapbook-style anniversary website for R Minnal Kodi (Vathiyar) and G Kayathri (Thaai Kizhavi).

## Run locally

```powershell
npm install
npm run dev
```

## Production build

```powershell
npm run build
npm run preview
```

## Add your family photos

Replace the placeholder filenames in `public/images/` with your own images:
- `parents-hero.jpg`
- `wedding-day.jpg`
- `memory-01.jpg`
- `memory-02.jpg`
- `memory-03.jpg`

Do not change the filenames unless you also update `src/data.ts` and `src/App.tsx`.

## Customize the content

Edit `src/data.ts` for names, wedding date, and memory captions. Edit the story and letter copy in `src/App.tsx`.

## Anniversary date

The current date is set to `2026-11-10`. The page shows a live day countdown. On or after the date it displays zero; change the date in `src/data.ts` for future anniversaries.

## Music

The music toggle currently displays a reminder because no song has been supplied. Add a licensed or family-owned MP3 to `public/music/anniversary-song.mp3`, then wire it to an HTML audio element in `src/App.tsx`.

## Deploy

Push the project to GitHub, import it into Vercel, and use:
- Build command: `npm run build`
- Output directory: `dist`
