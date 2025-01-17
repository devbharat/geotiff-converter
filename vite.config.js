import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './src', // Set the root directory for your source files
  base: './',
  build: {
    outDir: '../public', // Output the build to the public folder
    emptyOutDir: true,  // Clear the output directory before building
  },
  publicDir: '../public',
  plugins: [react()],
});

