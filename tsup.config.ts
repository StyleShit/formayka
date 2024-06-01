import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts', 'src/react/index.ts', 'src/core/index.ts'],
	format: ['cjs', 'esm'],
	dts: true,
	splitting: true,
	clean: true,
	outDir: 'dist',
});
