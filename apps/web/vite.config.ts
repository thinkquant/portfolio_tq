import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

export default defineConfig(() => {
  const proxyTarget =
    process.env.VITE_DEV_API_PROXY_TARGET ?? 'http://127.0.0.1:8080';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@portfolio-tq/config': path.resolve(
          repoRoot,
          'packages/config/src/index.ts',
        ),
        '@portfolio-tq/types': path.resolve(
          repoRoot,
          'packages/types/src/index.ts',
        ),
        '@portfolio-tq/ui': path.resolve(repoRoot, 'packages/ui/src/index.ts'),
      },
    },
  };
});
