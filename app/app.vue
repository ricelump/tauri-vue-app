<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()

onMounted(async () => {
	if (isTauri) {
		if (!isTauri) return

		const appConfig = useAppConfig()
		const colorMode = useColorMode()
		const { setLocale } = useI18n()
		const { settings } = useSettings()

		if (settings.locale) setLocale(settings.locale)
		if (settings.colorMode) colorMode.preference = settings.colorMode
		if (settings.accentColor) appConfig.ui.colors.primary = settings.accentColor
		await useTray()
	}
})
</script>

<template>
	<UApp :locale="locales[locale]">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>
