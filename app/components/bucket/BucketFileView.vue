<script setup lang="ts">
import type { DropdownMenuItem, TableRow } from '@nuxt/ui'
import type { Bucket } from '~/types/bucket'
import type { BucketFile } from '~/types/file'

const props = defineProps<{
	bucket: Bucket | null
}>()

const emit = defineEmits<{
	fileClick: [file: BucketFile]
}>()

const tableRef = ref()

const rowSelection = computed(() => tableRef.value?.rowSelection || {})

const {
	files,
	currentPath,
	breadcrumbs,
	loading,
	navigateUp,
	navigateToBreadcrumb,
	enterDirectory,
	refresh,
} = useBucketFiles(toRef(props, 'bucket'))

const { fileInput, uploadFiles, openFilePicker } = useBucketUpload(
	toRef(props, 'bucket'),
	currentPath,
	refresh,
)

const bulkActions: DropdownMenuItem[][] = [
	[
		{
			label: 'Delete All',
			icon: 'i-ph-trash',
			color: 'error',
		},
	],
	[
		{
			label: 'Clear Selection',
			icon: 'i-ph-selection-slash',
			onSelect: () => tableRef.value?.clearSelection(),
		},
	],
]

function onFileClick(file: BucketFile) {
	if (file.isDirectory) enterDirectory(file)
	else emit('fileClick', file)
}

function onRowClick(e: Event, row: TableRow<BucketFile>) {
	if ((e.target as HTMLElement).closest('[role="checkbox"]')) return

	if (row.original.isDirectory) enterDirectory(row.original)
	else emit('fileClick', row.original)
}

// TODO: view mode
</script>

<template>
	<div class="relative flex flex-col border-y border-default">
		<input
			ref="fileInput"
			type="file"
			multiple
			class="hidden"
			@change="uploadFiles(($event.target as HTMLInputElement).files)"
		/>

		<BucketToolbar
			:current-path="currentPath"
			:breadcrumbs="breadcrumbs"
			:has-selection="Object.keys(rowSelection).length > 0"
			:selection-count="Object.keys(rowSelection).length"
			:total-count="files.length"
			@navigate-up="navigateUp"
			@navigate-to="navigateToBreadcrumb"
			@upload="openFilePicker"
			@refresh="refresh"
		>
			<template #bulk-actions>
				<UDropdownMenu v-if="Object.keys(rowSelection).length > 0" :items="bulkActions">
					<UButton
						:label="`${Object.keys(rowSelection).length} of ${files.length} selected`"
						color="primary"
						variant="soft"
						trailing-icon="i-ph-caret-down"
					/>
				</UDropdownMenu>
			</template>
		</BucketToolbar>

		<DragDropZone @drop="uploadFiles" />

		<BucketFileTable
			ref="tableRef"
			:files="files"
			:loading="loading"
			@select="onFileClick"
			@row-click="onRowClick"
		/>
	</div>
</template>
