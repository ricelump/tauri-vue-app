<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale, setLocale } = useI18n()
const { settings } = useSettings()

const appConfig = useAppConfig()
const colorMode = useColorMode()

watch(
	() => settings.locale,
	(newLocale) => {
		if (newLocale) setLocale(newLocale)
	},
	{ immediate: true },
)

watch(
	() => settings.colorMode,
	(val) => {
		if (val) colorMode.preference = val
	},
	{ immediate: true },
)

watch(
	() => settings.accentColor,
	(val) => {
		if (val) appConfig.ui.colors.primary = val
	},
	{ immediate: true },
)

onMounted(async () => {
	if (isTauri) createTray()
})
</script>

<template>
	<UApp :locale="locales[locale]" :toaster="{ position: 'top-center' }">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>
