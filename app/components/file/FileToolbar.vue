<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{
	currentPath: string
	breadcrumbs: string[]
	hasSelection: boolean
	selectionCount: number
	totalCount: number
}>()

const emit = defineEmits<{
	navigateUp: []
	navigateTo: [index: number]
	upload: []
	refresh: []
	clearSelection: []
	deleteAll: []
	createFolder: []
}>()

const bulkActions: DropdownMenuItem[][] = [
	[
		{
			label: $t('file.deleteAll.label'),
			icon: 'i-ph-trash',
			color: 'error',
			onSelect: () => emit('deleteAll'),
		},
	],
	[
		{
			label: $t('file.selection.clear'),
			icon: 'i-ph-selection-slash',
			onSelect: () => emit('clearSelection'),
		},
	],
]
</script>

<template>
	<div
		class="sticky top-(--ui-header-height) z-50 flex max-h-(--ui-header-height) items-center justify-between gap-2 overflow-x-auto border-y bg-default/75 px-2 py-1 backdrop-blur-sm"
	>
		<div class="flex items-center gap-3">
			<UTooltip :text="$t('file.navigation.up')">
				<UButton
					icon="i-ph-arrow-left"
					color="neutral"
					variant="ghost"
					:disabled="!currentPath"
					@click="$emit('navigateUp')"
				/>
			</UTooltip>

			<UBreadcrumb
				:items="[
					{ icon: 'i-ph-house', onClick: () => $emit('navigateTo', -1) },
					...breadcrumbs.map((crumb, index) => ({
						label: crumb,
						onClick: () => $emit('navigateTo', index),
					})),
				]"
			/>
		</div>
		<div class="flex items-center gap-0.5">
			<UDropdownMenu v-if="hasSelection" :items="bulkActions">
				<UButton
					:label="$t('file.selection.count', { count: selectionCount, total: totalCount })"
					color="primary"
					variant="soft"
					trailing-icon="i-ph-caret-down"
				/>
			</UDropdownMenu>
			<UButton
				:label="$t('file.upload.label')"
				icon="i-ph-upload-simple"
				color="neutral"
				variant="ghost"
				@click="$emit('upload')"
			/>
			<PresetSelectDropdownMenu />
			<UTooltip :text="$t('file.createFolder.label')">
				<UButton
					icon="i-ph-folder-simple-plus"
					color="neutral"
					variant="ghost"
					@click="$emit('createFolder')"
				/>
			</UTooltip>
			<UTooltip :text="$t('file.navigation.refresh')">
				<UButton
					icon="i-ph-arrows-clockwise"
					color="neutral"
					variant="ghost"
					@click="$emit('refresh')"
				/>
			</UTooltip>
		</div>
	</div>
</template>
