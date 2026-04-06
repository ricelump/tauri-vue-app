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
}>()

const bulkActions: DropdownMenuItem[][] = [
	[
		{
			label: 'Delete All',
			icon: 'i-ph-trash',
			color: 'error',
			onSelect: () => emit('deleteAll'),
		},
	],
	[
		{
			label: 'Clear Selection',
			icon: 'i-ph-selection-slash',
			onSelect: () => emit('clearSelection'),
		},
	],
]
</script>

<template>
	<div
		class="flex items-center justify-between gap-2 overflow-x-auto border-b border-default px-2 py-1.5"
	>
		<div class="flex items-center gap-3">
			<UButton
				icon="i-ph-arrow-left"
				color="neutral"
				variant="ghost"
				:disabled="!currentPath"
				@click="$emit('navigateUp')"
			/>

			<UBreadcrumb
				:items="[
					{ icon: 'i-ph-house', to: undefined, click: () => $emit('navigateTo', -1) },
					...breadcrumbs.map((crumb, index) => ({
						label: crumb,
						to: undefined,
						click: () => $emit('navigateTo', index),
					})),
				]"
			/>
		</div>

		<div class="flex items-center gap-2">
			<UDropdownMenu v-if="hasSelection" :items="bulkActions">
				<UButton
					:label="`${selectionCount} of ${totalCount} selected`"
					color="primary"
					variant="soft"
					trailing-icon="i-ph-caret-down"
				/>
			</UDropdownMenu>
			<UButton
				label="Upload"
				icon="i-ph-upload-simple"
				color="neutral"
				variant="ghost"
				@click="$emit('upload')"
			/>
			<UButton
				icon="i-ph-arrows-clockwise"
				color="neutral"
				variant="ghost"
				@click="$emit('refresh')"
			/>
		</div>
	</div>
</template>
