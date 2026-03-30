<script setup lang="ts">
import type { Settings } from '~/types/settings'
import * as locales from '@nuxt/ui/locale'

const { locale, setLocale } = useI18n()

if (isTauri) {
	const initApp = async () => {
		const store = await useTauriStoreLoad('settings.json')
		const colorMode = useColorMode()

		const savedLang = await store.get('language')
		const savedTheme = await store.get('colorMode')

		if (savedLang) setLocale(savedLang as Settings['locale'])
		if (savedTheme) colorMode.preference = savedTheme as string
	}

	initApp()
}
</script>

<template>
	<UApp :locale="locales[locale]">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>
