import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  const moduleRoot = `src/modules/${mode}`;
  return {
    plugins: [vue(), vueJsx(), vueDevTools()],
    root: moduleRoot,
    publicDir: resolve(__dirname, 'public'),
    build: {
      rollupOptions: {
        input: {
          [mode]: resolve(__dirname, `${moduleRoot}/index.html`),
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name]-[hash].js',
          assetFileNames: '[name].[ext]',
        },
      },
      outDir: `../../../dist/${mode}`,
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@admin': fileURLToPath(new URL('./src/modules', import.meta.url)),
        // Ajuste os aliases conforme a nova estrutura se necessário
      },
    },
    server: {
      port:
        {
          responsavel: 5173,
          aluno: 5174,
          admin: 5175,
        }[mode] || 5173,
    },
  }
})
