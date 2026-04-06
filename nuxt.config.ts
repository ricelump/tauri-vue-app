export default defineNuxtConfig({
	modules: ['@vueuse/nuxt', '@nuxt/ui', '@nuxtjs/i18n'],
	app: {
		head: {
			title: 'Prebucket',
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1',
			meta: [
				{ name: 'format-detection', content: 'no' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
			],
		},
		pageTransition: {
			name: 'page',
			mode: 'out-in',
		},
		layoutTransition: {
			name: 'layout',
			mode: 'out-in',
		},
	},
	i18n: {
		strategy: 'no_prefix',
		locales: [
			{
				code: 'en',
				name: 'English',
				file: 'en.json',
			},
			{
				code: 'es',
				name: 'Español',
				file: 'es.json',
			},
			{
				code: 'fr',
				name: 'Français',
				file: 'fr.json',
			},
			{
				code: 'ja',
				name: '日本語',
				file: 'ja.json',
			},
			{
				code: 'zh_cn',
				name: '简体中文',
				file: 'zh-cn.json',
			},
			{
				code: 'zh_tw',
				name: '繁體中文',
				file: 'zh-tw.json',
			},
		],
	},
	css: ['@/assets/css/main.css'],
	ssr: false,
	vite: {
		clearScreen: false,
		envPrefix: ['VITE_', 'TAURI_'],
		server: {
			strictPort: true,
			hmr: {
				protocol: 'ws',
				host: '0.0.0.0',
				port: 1421,
			},
			watch: {
				ignored: ['**/src-tauri/**'],
			},
		},
	},
	devServer: {
		port: 1420,
	},
	dir: {
		modules: 'app/modules',
	},
	icon: {
		clientBundle: {
			scan: true,
		},
	},
	ui: {
		fonts: false,
	},
	router: {
		options: {
			scrollBehaviorType: 'smooth',
		},
	},
	nitro: {
		preset: 'static',
	},
	devtools: {
		enabled: false,
	},
	experimental: {
		typedPages: true,
	},
	compatibilityDate: '2026-01-01',
})
