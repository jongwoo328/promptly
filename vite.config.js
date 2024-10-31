import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      'primevue': path.resolve(__dirname, 'node_modules/primevue'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        contentScript: 'src/content-script/index.js',
      },
      output: {
        entryFileNames: (chunk) => {
          console.log(chunk)
          if (chunk.name === 'contentScript') {
            return 'content-script/index.js';
          }
          return 'assets/[name].js'
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['primevue'],
  },
});
