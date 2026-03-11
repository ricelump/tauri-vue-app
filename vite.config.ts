import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'
import path from 'path'

const host = process.env.TAURI_DEV_HOST

export default defineConfig({
	plugins: [
		vue(),
		ui({
			ui: {
				colors: {
					primary: 'green',
					neutral: 'neutral',
				},
			},
		}),
	],
	clearScreen: false,
	server: {
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: 'ws',
					host,
					port: 1421,
				}
			: undefined,
		watch: {
			ignored: ['**/src-tauri/**'],
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
})
