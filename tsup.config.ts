import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/extension.ts'],
  outDir: 'out',
  format: ['cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  external: ['vscode'], 
});
