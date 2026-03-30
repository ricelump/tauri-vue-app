export default defineNuxtPlugin(async () => {
	if (!isTauri) return

	const store = await useTauriStoreLoad('settings.json')
	const colorMode = useColorMode()

	const savedTheme = await store.get('colorMode')
	if (savedTheme) colorMode.preference = savedTheme as string
})
