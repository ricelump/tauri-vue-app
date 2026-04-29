export default defineNuxtConfig({
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	modules: ['@nuxt/ui'],
	ssr: false,
	nitro: {
		preset: 'static',
	},
})
