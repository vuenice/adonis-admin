import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/providers/crud_provider.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'build',
  external: [
    '@adonisjs/core',
    '@adonisjs/inertia',
    '@adonisjs/lucid',
    '@adonisjs/session',
  ],
})
