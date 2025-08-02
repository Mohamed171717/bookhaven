# Fonts Directory

This directory contains the Playwrite Magyarország font files.

## Required Font Files

To use the Playwrite Magyarország font, you need to add the following files to this directory:

1. `PlaywriteMagyar.woff2` - Regular weight (400)
2. `PlaywriteMagyar-Bold.woff2` - Bold weight (700)

## How to Add Font Files

1. Download the Playwrite Magyarország font files
2. Convert them to WOFF2 format for optimal web performance
3. Place the files in this directory with the exact names:
   - `PlaywriteMagyar.woff2`
   - `PlaywriteMagyar-Bold.woff2`

## Font Conversion

If you have TTF or OTF files, you can convert them to WOFF2 using online tools like:
- https://convertio.co/ttf-woff2/
- https://cloudconvert.com/ttf-to-woff2

## Alternative Font Names

If the font files have different names, update the paths in `src/app/[locale]/layout.tsx`:

```typescript
const playwriteMagyar = localFont({
  src: [
    {
      path: '../../fonts/YOUR_FONT_FILE_NAME.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/YOUR_BOLD_FONT_FILE_NAME.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-playwrite-magyar',
  display: 'swap',
});
``` 