// PDF.js Standard Font Data Configuration
// Auto-generated on 2025-03-01 21:38:17.98

/**
 * Configure PDF.js to handle standard fonts correctly
 * To be used in the _app.js or similar startup file
 */
export default function configureStandardFonts() {
  if (typeof window !== 'undefined') {
    // Standard fonts path for our application
    window.STANDARD_FONTS_PATH = '/standard_fonts/';

    // Copy standard fonts to public folder at build time
    // This is done by the build script
    // node_modules/pdfjs-dist/standard_fonts/ -> public/standard_fonts/
  }
}