<script lang="ts" setup>
import * as locales from '@nuxt/ui/locale'

const props = defineProps<{
	close?: () => void
}>()

const appConfig = useAppConfig()
const { settings } = useSettings()

const items = [
	{ label: 'General', icon: 'i-ph-gear-fine', slot: 'general' },
	{ label: 'Appearance', icon: 'i-ph-palette', slot: 'appearance' },
	{ label: 'About', icon: 'i-ph-info', slot: 'about' },
]
</script>

<template>
	<UTabs
		:items="items"
		color="neutral"
		variant="link"
		:ui="{ content: 'mt-4 flex flex-col gap-1' }"
	>
		<template #general>
			<SettingsItem label="Language" icon="i-ph-globe-simple">
				<ULocaleSelect v-model="settings.locale" :locales="Object.values(locales)" class="flex-1" />
			</SettingsItem>
			<SettingsItem label="Auto Start" icon="i-ph-power" description="Todo.">
				<USwitch v-model="settings.autoStart" />
			</SettingsItem>
		</template>

		<template #appearance>
			<SettingsItem label="Color Mode" icon="i-ph-circle-half">
				<UColorModeSelect v-model="settings.colorMode" class="flex-1" />
			</SettingsItem>
		</template>

		<template #about>
			<div class="flex flex-col items-center justify-center gap-2">
				<p class="text-lg">
					{{ appConfig.app.name }}
				</p>
				<span class="text-sm text-muted">© {{ new Date().getFullYear() }}</span>
			</div>
		</template>

		<template #list-trailing>
			<UButton
				v-if="props.close"
				icon="i-ph-x"
				color="neutral"
				variant="ghost"
				class="ml-auto"
				@click="props.close"
			/>
		</template>
	</UTabs>
</template>
