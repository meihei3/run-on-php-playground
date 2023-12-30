import {resolve} from 'node:path'
import {defineConfig} from 'vite'

export default defineConfig((opt) => {
    return {
        root: 'src',
        build: {
            outDir: '../dist',
            rollupOptions: {
                input: {
                    content: resolve(__dirname, 'src/content.ts'),
                },
                output: {
                    entryFileNames: '[name].js',
                },
            },
        },
    }
})
