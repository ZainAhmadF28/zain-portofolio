import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - React & friends
          'react-vendor': ['react', 'react-dom'],
          
          // Animation libraries
          'motion-vendor': ['framer-motion', 'motion', 'gsap'],
          
          // Three.js core
          'three-core': ['three'],
          
          // React Three Fiber ecosystem (sangat berat!)
          'r3f-vendor': [
            '@react-three/fiber',
            '@react-three/drei',
            '@react-three/rapier',
          ],
          
          // Spline (berat juga!)
          'spline-vendor': [
            '@splinetool/react-spline',
            '@splinetool/runtime',
          ],
          
          // Icons & UI
          'ui-vendor': [
            'react-icons',
            'lucide-react',
            'clsx',
            'tailwind-merge',
          ],
          
          // Mesh utilities
          'mesh-vendor': ['meshline'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Optimize minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log di production
        drop_debugger: true,
      },
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'three',
    ],
    exclude: [
      '@splinetool/runtime', // Exclude heavy runtime
    ],
  },
})
