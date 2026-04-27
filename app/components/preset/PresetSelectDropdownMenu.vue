<script setup lang="ts">
import { LazyPresetConfigFormModal, LazySettingsModal } from '#components'
import type { DropdownMenuItem } from '@nuxt/ui'

const { imagePresets, currentImagePreset, selectImagePreset } = usePreset()
const overlay = useOverlay()
const addPresetModal = overlay.create(LazyPresetConfigFormModal)
const settingsModal = overlay.create(LazySettingsModal)

const imageItems = computed<DropdownMenuItem[]>(() => [
	...imagePresets.value.map((preset) => ({
		label: preset.name,
		type: 'checkbox' as const,
		checked: preset.id === currentImagePreset.value?.id,
		onUpdateChecked() {
			selectImagePreset(preset.id)
		},
		onSelect(e: Event) {
			e.preventDefault()
		},
	})),
	{
		type: 'separator',
	},
	{
		label: $t('preset.none'),
		icon: 'i-ph-prohibit',
		onClick: () => selectImagePreset(null),
	},
	{
		label: $t('preset.add'),
		icon: 'i-ph-plus',
		onClick: () => addPresetModal.open({ type: 'image' }),
	},
	{
		label: $t('preset.manage'),
		icon: 'i-ph-faders-horizontal',
		onClick: () => settingsModal.open({ activeTab: 'presets' }),
	},
])
</script>

<template>
	<UDropdownMenu :items="imageItems">
		<UTooltip :text="$t('preset.label')">
			<UButton icon="i-ph-blueprint" color="neutral" variant="ghost" />
		</UTooltip>
	</UDropdownMenu>
</template>
