<script lang="ts" setup>
const props = defineProps<{
	activeTab?: string
}>()

const { settings, $reset } = useSettings()

const activeTab = ref(props.activeTab || 'general')

const items = [
	{
		label: $t('settings.general.label'),
		icon: 'i-ph-gear-fine',
		value: 'general',
		slot: 'general',
	},
	{
		label: $t('settings.appearance.label'),
		icon: 'i-ph-palette',
		value: 'appearance',
		slot: 'appearance',
	},
	{ label: $t('bucket.label'), icon: 'i-ph-hard-drives', value: 'buckets', slot: 'buckets' },
	{
		label: $t('settings.shortcuts.label'),
		icon: 'i-ph-command',
		value: 'shortcuts',
		slot: 'shortcuts',
	},
	{ label: $t('settings.about.label'), icon: 'i-ph-info', value: 'about', slot: 'about' },
]
</script>

<template>
	<ResponsiveModal>
		<template #body="{ close }">
			<UTabs
				v-model="activeTab"
				:items="items"
				color="neutral"
				variant="link"
				:ui="{ content: 'mt-4 flex flex-col gap-1' }"
			>
				<template #general>
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

				<template #appearance>
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

				<template #buckets>
					<BucketList />
				</template>

				<template #shortcuts>
					<SettingsItem
						v-if="isTauri"
						:label="$t('settings.shortcuts.toggleWindow')"
						icon="i-ph-app-window-duotone"
					>
						<SettingsShortcutButton />
					</SettingsItem>
					<UEmpty v-else :title="$t('settings.shortcuts.unavailable')" icon="i-ph-command-bold" />
				</template>

				<template #about>
					<SettingsAbout />
				</template>

				<template #list-trailing>
					<UButton icon="i-ph-x" color="neutral" variant="ghost" class="ml-auto" @click="close" />
				</template>
			</UTabs>
		</template>
	</ResponsiveModal>
</template>
