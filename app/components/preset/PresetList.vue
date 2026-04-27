<script setup lang="ts">
import { LazyPresetConfigFormModal } from '#components'
import type { ImagePreset, Preset } from '~/types/preset'

const { imagePresets, removeImagePreset } = usePreset()
const toast = useToast()
const overlay = useOverlay()
const editImageModal = overlay.create(LazyPresetConfigFormModal)

function handleAddImage() {
	editImageModal.open({ type: 'image' })
}

function handleEditImage(preset: Preset<ImagePreset>) {
	editImageModal.open({ type: 'image', preset })
}

async function handleDeleteImage(preset: Preset<ImagePreset>) {
	const confirmed = await openConfirmDialog({
		title: $t('preset.delete.title', { name: preset.name }),
		description: $t('preset.delete.description'),
		destructive: true,
	})
	if (!confirmed) return

	removeImagePreset(preset.id)
	toast.add({ title: 'Preset removed', color: 'success' })
}
</script>

<template>
	<div>
		<div class="mb-2 flex items-center justify-between">
			<span class="text-sm font-medium">{{ $t('preset.image') }}</span>
			<UButton icon="i-ph-plus" color="neutral" variant="ghost" size="xs" @click="handleAddImage" />
		</div>
		<div class="flex flex-col gap-1">
			<SettingsItem v-for="preset in imagePresets" :key="preset.id" :label="preset.name">
				<div class="flex gap-0.5">
					<UTooltip :text="$t('preset.edit')">
						<UButton
							icon="i-ph-pencil-simple"
							color="neutral"
							variant="ghost"
							@click="handleEditImage(preset)"
						/>
					</UTooltip>
					<UTooltip :text="$t('preset.delete')">
						<UButton
							icon="i-ph-trash"
							color="error"
							variant="ghost"
							@click="handleDeleteImage(preset)"
						/>
					</UTooltip>
				</div>
			</SettingsItem>
		</div>
		<div v-if="imagePresets.length === 0" class="text-sm text-muted">
			{{ $t('preset.noImagePresets') }}
		</div>
	</div>
</template>
