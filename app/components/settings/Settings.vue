<script lang="ts" setup>
const props = defineProps<{
	close?: () => void
}>()

const appConfig = useAppConfig()
const { settings } = useSettings()

const items = [
	{ label: $t('settings.tabs.general'), icon: 'i-ph-gear-fine', slot: 'general' },
	{ label: $t('settings.tabs.appearance'), icon: 'i-ph-palette', slot: 'appearance' },
	{ label: $t('settings.tabs.about'), icon: 'i-ph-info', slot: 'about' },
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
			<SettingsItem :label="$t('settings.items.language')" icon="i-ph-globe-simple">
				<SettingsLocaleSelect v-model="settings.locale" />
			</SettingsItem>
			<SettingsItem :label="$t('settings.items.autoStart')" icon="i-ph-power">
				<USwitch v-model="settings.autoStart" />
			</SettingsItem>
		</template>

		<template #appearance>
			<SettingsItem :label="$t('settings.items.colorMode.label')" icon="i-ph-circle-half">
				<SettingsColorModeTabs v-model="settings.colorMode" />
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
