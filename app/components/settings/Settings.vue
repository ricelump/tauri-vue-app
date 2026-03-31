<script lang="ts" setup>
const props = defineProps<{
	close?: () => void
}>()

const { settings } = useSettings()

const items = [
	{ label: $t('settings.tabs.general'), icon: 'i-ph-gear-fine-bold', slot: 'general' },
	{ label: $t('settings.tabs.appearance'), icon: 'i-ph-palette-bold', slot: 'appearance' },
	{ label: $t('settings.tabs.about'), icon: 'i-ph-info-bold', slot: 'about' },
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
			<SettingsItem :label="$t('settings.items.language')" icon="i-ph-globe-simple-duotone">
				<SettingsLocaleSelect v-model="settings.locale" />
			</SettingsItem>
			<template v-if="isTauri">
				<SettingsItem :label="$t('settings.items.autoStart')" icon="i-ph-power-duotone">
					<USwitch v-model="settings.autoStart" />
				</SettingsItem>
				<SettingsItem
					:label="$t('settings.items.closeToHide.label')"
					icon="i-ph-x-circle-duotone"
					:description="$t('settings.items.closeToHide.description')"
				>
					<USwitch v-model="settings.closeToHide" />
				</SettingsItem>
			</template>
		</template>

		<template #appearance>
			<SettingsItem :label="$t('settings.items.colorMode.label')" icon="i-ph-circle-half-duotone">
				<SettingsColorModeTabs v-model="settings.colorMode" />
			</SettingsItem>
			<SettingsItem :label="$t('settings.items.accentColor.label')" icon="i-ph-swatches-duotone">
				<SettingsAccentColorSelect v-model="settings.accentColor" />
			</SettingsItem>
		</template>

		<template #about>
			<SettingsAbout />
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
