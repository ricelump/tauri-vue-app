<script setup lang="ts">
import type { TableRow } from '@nuxt/ui'
import type { Bucket } from '~/types/bucket'
import type { BucketFile } from '~/types/file'
import { LazyAlertModal } from '#components'

const props = defineProps<{
	bucket: Bucket | null
}>()

const emit = defineEmits<{
	fileClick: [file: BucketFile]
}>()

const tableRef = ref()
const fileInputRef = ref<HTMLInputElement>()

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

const { uploadFiles, resetFileInput } = useBucketUpload(
	toRef(props, 'bucket'),
	currentPath,
	refresh,
)

const { deleteFile, deleteFiles } = useS3(toRef(props, 'bucket'))
const toast = useToast()
const overlay = useOverlay()

const alertModal = overlay.create(LazyAlertModal)

async function openConfirmDialog(options: {
	title: string
	description: string
	destructive?: boolean
}): Promise<boolean> {
	return new Promise((resolve) => {
		const instance = alertModal.open({
			title: options.title,
			description: options.description,
			icon: 'i-ph-trash',
			destructive: options.destructive ?? false,
			onConfirm: () => {
				resolve(true)
			},
		})
	})
}

async function handleDeleteFile(file: BucketFile) {
	const confirmed = await openConfirmDialog({
		title: `Delete "${file.name}"?`,
		description: `This action cannot be undone. ${file.isDirectory ? 'All contents inside the folder will also be deleted.' : ''}`,
		destructive: true,
	})
	if (!confirmed) return

	const success = await deleteFile(file.key)
	if (success) {
		toast.add({ title: `Deleted ${file.name}`, color: 'success' })
		await refresh()
		tableRef.value?.clearSelection()
	} else toast.add({ title: `Failed to delete ${file.name}`, color: 'error' })
}

async function handleDeleteAll() {
	const selectedIndices = Object.keys(rowSelection.value).filter((key) => rowSelection.value[key])
	if (selectedIndices.length === 0) {
		toast.add({ title: 'No files selected', color: 'warning' })
		return
	}

	const selectedFiles: BucketFile[] = []
	for (const index of selectedIndices) {
		const file = files.value[parseInt(index)]
		if (file) selectedFiles.push(file)
	}

	if (selectedFiles.length === 0) return

	const confirmed = await openConfirmDialog({
		title: `Delete ${selectedFiles.length} item${selectedFiles.length > 1 ? 's' : ''}?`,
		description: `This action cannot be undone. ${selectedFiles.some((f: BucketFile) => f.isDirectory) ? 'Folders and their contents will be permanently removed.' : ''}`,
		destructive: true,
	})
	if (!confirmed) return

	const keys = selectedFiles.map((f: BucketFile) => f.key)
	const success = await deleteFiles(keys)
	if (success) {
		toast.add({
			title: `Deleted ${keys.length} item${keys.length > 1 ? 's' : ''}`,
			color: 'success',
		})
		await refresh()
		tableRef.value?.clearSelection()
	} else toast.add({ title: 'Batch deletion failed', color: 'error' })
}

async function handleFileUpload(files: FileList | null) {
	await uploadFiles(files)
	resetFileInput(fileInputRef.value)
}

function onFileClick(file: BucketFile) {
	if (file.isDirectory) enterDirectory(file)
	else emit('fileClick', file)
}

function onRowClick(e: Event, row: TableRow<BucketFile>) {
	if ((e.target as HTMLElement).closest('[role="checkbox"]')) return
	if (row.original.isDirectory) enterDirectory(row.original)
	else emit('fileClick', row.original)
}

function handleClearSelection() {
	tableRef.value?.clearSelection()
}

function openFilePicker() {
	fileInputRef.value?.click()
}
</script>

<template>
	<div class="relative flex flex-col border-y border-default">
		<input
			ref="fileInputRef"
			type="file"
			multiple
			class="hidden"
			@change="handleFileUpload(($event.target as HTMLInputElement).files)"
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
			@clear-selection="handleClearSelection"
			@delete-all="handleDeleteAll"
		/>

		<DragDropZone @drop="uploadFiles" />

		<BucketFileTable
			ref="tableRef"
			:files="files"
			:loading="loading"
			@select="onFileClick"
			@row-click="onRowClick"
			@delete="handleDeleteFile"
		/>
	</div>
</template>
