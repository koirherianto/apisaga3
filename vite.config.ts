import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import adonisjs from '@adonisjs/vite/client'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.ts' } }),
    svelte({
      compilerOptions: { hydratable: true },
      preprocess: [vitePreprocess({ script: true })], // Tambahkan preprocess di sini
    }),
    adonisjs({ entrypoints: ['inertia/app/app.ts'], reload: ['resources/views/**/*.edge'] }),
  ],

  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },
})
