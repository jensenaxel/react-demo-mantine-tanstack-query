import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        include: ['scichart'],
    },
    resolve: {
        alias: {
            // scichart Wasm files loading
            './scichart2d.wasm': path.resolve(__dirname, 'node_modules/scichart/_wasm/scichart2d.wasm'),
            './scichart2d.data': path.resolve(__dirname, 'node_modules/scichart/_wasm/scichart2d.data'),
            './scichart3d.wasm': path.resolve(__dirname, 'node_modules/scichart/_wasm/scichart3d.wasm'),
            './scichart3d.data': path.resolve(__dirname, 'node_modules/scichart/_wasm/scichart3d.data'),
            './scichart2d.js': path.resolve(__dirname, 'node_modules/scichart/_wasm/scichart2d.js'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
    },
});
