import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function protectLegacyInlineScriptTags() {
  return {
    name: 'protect-legacy-inline-script-tags',
    transformIndexHtml(html, ctx) {
      if (!ctx.path.endsWith('/legacy.html') && ctx.filename !== 'legacy.html') {
        return html
      }

      return html.replace(
        '/* Loaded via dynamic import() (not a static <script type=module> import) so that a',
        '/* Loaded via dynamic import() (not a static script-module tag) so that a'
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), protectLegacyInlineScriptTags()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        legacy: 'legacy.html',
      },
    },
  },
})
