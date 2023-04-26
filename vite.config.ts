import * as path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/guide/build.html#library-mode
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/styles/classes.css";
        `,
      },
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/library.ts'),
      name: 'vue-contextual-transition',
      // formats: ['es'], // adding 'umd' requires globals set to every external module
      fileName: (format) => `vue-contextual-transition.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
      },
    },
  },
});
