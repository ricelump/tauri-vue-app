<script lang="ts" setup>
const props = defineProps<{
	activeTab?: string
}>()

const { settings, $reset } = useSettings()

const activeTab = ref(props.activeTab || 'general')

const items = [
	{ label: $t('settings.general.label'), icon: 'i-ph-gear-fine', value: 'general' },
	{ label: $t('settings.appearance.label'), icon: 'i-ph-palette', value: 'appearance' },
	{ label: $t('bucket.label'), icon: 'i-ph-hard-drives', value: 'buckets' },
	{ label: $t('preset.label'), icon: 'i-ph-faders-horizontal', value: 'presets' },
	// { label: $t('settings.shortcuts.label'), icon: 'i-ph-command', value: 'shortcuts' },
	{ label: $t('settings.about.label'), icon: 'i-ph-info', value: 'about' },
]
</script>

<template>
	<ResponsiveModal :closeIcon="true">
		<template #header="{ close }">
			<UTabs
				v-model="activeTab"
				:items="items"
				:content="false"
				color="neutral"
				:ui="{
					list: 'bg-muted',
					indicator: 'bg-accented',
					trigger: 'data-[state=active]:text-highlighted',
				}"
			/>
			<UButton
				icon="i-ph-x"
				color="neutral"
				variant="ghost"
				class="absolute inset-e-4 top-4 hidden md:flex"
				@click="close"
			/>
		</template>
		<template #body>
			<div class="flex flex-col gap-1">
				<template v-if="activeTab === 'general'">
					<SettingsItem :label="$t('settings.general.language')" icon="i-ph-globe-simple-duotone">
						<SettingsLocaleSelect v-model="settings.locale" />
					</SettingsItem>
					<template v-if="isTauri">
						<SettingsItem :label="$t('settings.general.autoStart')" icon="i-ph-power-duotone">
							<USwitch v-model="settings.autoStart" />
						</SettingsItem>
						<SettingsItem
							:label="$t('settings.general.closeToHide.label')"
							icon="i-ph-x-circle-duotone"
							:description="$t('settings.general.closeToHide.description')"
						>
							<USwitch v-model="settings.closeToHide" />
						</SettingsItem>
					</template>
					<SettingsItem :label="$t('settings.general.reset.label')" icon="i-ph-eraser-duotone">
						<UButton
							:label="$t('settings.general.reset.button')"
							color="error"
							variant="subtle"
							@click="$reset"
						/>
					</SettingsItem>
				</template>

				<template v-if="activeTab === 'appearance'">
					<SettingsItem
						:label="$t('settings.appearance.colorMode.label')"
						icon="i-ph-circle-half-duotone"
					>
						<SettingsColorModeTabs v-model="settings.colorMode" />
					</SettingsItem>
					<SettingsItem
						:label="$t('settings.appearance.accentColor.label')"
						icon="i-ph-swatches-duotone"
					>
						<SettingsAccentColorSelect v-model="settings.accentColor" />
					</SettingsItem>
				</template>

				<template v-if="activeTab === 'buckets'">
					<BucketList />
				</template>

				<template v-if="activeTab === 'presets'">
					<PresetList />
				</template>

				<template v-if="activeTab === 'shortcuts'">
					<SettingsItem
						v-if="isTauri"
						:label="$t('settings.shortcuts.toggleWindow')"
						icon="i-ph-app-window-duotone"
					>
						<SettingsShortcutButton />
					</SettingsItem>
					<UEmpty v-else :title="$t('settings.shortcuts.unavailable')" icon="i-ph-command-bold" />
				</template>

				<template v-if="activeTab === 'about'">
					<SettingsAbout />
				</template>
			</div>
			<!--
			<template #list-trailing>
				<UButton icon="i-ph-x" color="neutral" variant="ghost" class="ml-auto" @click="close" />
			</template> -->
		</template>
	</ResponsiveModal>
</template>
