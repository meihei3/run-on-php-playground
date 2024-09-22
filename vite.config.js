import {defineConfig} from 'vite';
import linaria from '@wyw-in-js/vite';

export default defineConfig(_ => ({
	root: 'src',
	build: {
		outDir: '../dist',
		rollupOptions: {
			input: {
				content: 'src/content.ts',
			},
			output: {
				entryFileNames: '[name].js',
				assetFileNames: 'styles.css',
			},
		},
	},
	plugins: [linaria()],
}));
