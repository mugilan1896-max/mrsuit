import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        stores: resolve(__dirname, 'stores/index.html'),
        customization: resolve(__dirname, 'customization/index.html'),
        aboutUs: resolve(__dirname, 'about-us/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        enquiry: resolve(__dirname, 'enquiry/index.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
