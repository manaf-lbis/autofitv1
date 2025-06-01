import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path-browserify';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.lottie"],
  resolve: {
    alias: {
      '@': path.resolve('src'),
    },
  },
});


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path-browserify';

// export default defineConfig({
//   plugins: [react()],
//   assetsInclude: ["**/*.lottie"],
//   resolve: {
//     alias: {
//       '@': path.resolve('src'),
//     },
//   },
//    server: {
//     host: '192.168.60.242',
//     port: 5173, 
//   },
// });
