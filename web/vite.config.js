import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// Inyecta una Content-Security-Policy solo en el build de producción.
// En desarrollo se omite para no romper el HMR de Vite / plugin-react.
const cspPlugin = () => ({
  name: 'inject-csp',
  apply: 'build',
  transformIndexHtml(html) {
    const csp = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https: http://localhost:3000",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');
    return html.replace(
      '</head>',
      `  <meta http-equiv="Content-Security-Policy" content="${csp}" />\n  </head>`
    );
  },
});

export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
    cspPlugin(),
  ],
  base: '/',
  server: {
    https: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  }
});
