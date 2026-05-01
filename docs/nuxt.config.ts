export default defineNuxtConfig({
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	modules: ['@nuxt/ui'],
	ssr: false,
	nitro: {
		preset: 'static',
	},
	ui: {
		fonts: false,
		prose: true,
	},
	icon: {
		mode: 'svg',
		customCollections: [
			{
				prefix: 'logo',
				dir: './app/assets/logos',
			},
			{
				prefix: 'icon',
				dir: './app/assets/icons',
			},
		],
	},
})
