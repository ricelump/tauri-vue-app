<script setup lang="ts">
defineProps<{
	currentPath: string
	breadcrumbs: string[]
	hasSelection: boolean
	selectionCount: number
	totalCount: number
}>()

defineEmits<{
	navigateUp: []
	navigateTo: [index: number]
	upload: []
	refresh: []
}>()
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
			<slot name="bulk-actions" />

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
