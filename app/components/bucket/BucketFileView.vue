<script setup lang="ts">
import type { TableRow } from '@nuxt/ui'
import type { Bucket } from '~/types/bucket'
import type { BucketFile } from '~/types/file'

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

const { upload, createFolder, deleteFile, deleteFiles, rename } = useS3(toRef(props, 'bucket'))
const { currentImagePreset } = usePreset()
const toast = useToast()
const { copy } = useClipboard()

async function handleCreateFolder() {
	const folderName = await openInputDialog({
		title: 'Create New Folder',
		description: 'Enter the name of the folder you want to create.',
		icon: 'i-ph-folder-simple-plus',
		placeholder: 'Folder name',
	})
	if (!folderName || folderName.trim() === '') return

	const success = await createFolder(folderName.trim(), currentPath.value)
	if (success) {
		toast.add({ title: `Folder "${folderName}" created`, color: 'success' })
		await refresh()
	} else toast.add({ title: `Failed to create folder "${folderName}"`, color: 'error' })
}

async function handleRenameFile(file: BucketFile) {
	const oldName = file.name
	const newName = await openInputDialog({
		title: `Rename "${oldName}"`,
		description: 'Enter the new name.',
		icon: 'i-ph-pencil-simple',
		placeholder: oldName,
	})
	if (!newName || newName.trim() === '' || newName === oldName) return

	const oldKey = file.key
	const newKey = file.isDirectory
		? `${currentPath.value}${newName.trim()}/`
		: `${currentPath.value}${newName.trim()}`

	const success = await rename(oldKey, newKey)
	if (success) {
		toast.add({ title: `Renamed to "${newName}"`, color: 'success' })
		await refresh()
	} else toast.add({ title: `Failed to rename "${oldName}"`, color: 'error' })
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
		// toast.add({
		// 	title: `Deleted ${keys.length} item${keys.length > 1 ? 's' : ''}`,
		// 	color: 'success',
		// })
		await refresh()
		tableRef.value?.clearSelection()
	} else toast.add({ title: 'Batch deletion failed', color: 'error' })
}

async function processFile(file: File): Promise<File> {
	if (file.type.startsWith('image/') && currentImagePreset.value)
		return processImage(file, currentImagePreset.value.config)
	return file
}

async function handleFileUpload(selectedFiles: FileList | null) {
	if (!selectedFiles || !props.bucket) return

	const files = Array.from(selectedFiles)

	toast.add({
		title: `Uploading ${files.length} file${files.length > 1 ? 's' : ''}`,
		color: 'info',
		icon: 'i-ph-upload-simple',
	})

	await Promise.all(
		files.map(async (file) => {
			const processedFile = await processFile(file)
			const filename = processedFile.name
			const key = `${currentPath.value}${filename}`

			try {
				const success = await upload(key, processedFile, processedFile.type)
				if (!success) throw new Error('Upload failed')
			} catch {
				toast.add({ title: `${filename} failed`, color: 'error', icon: 'i-ph-warning-circle' })
			}
		}),
	)

	await refresh()

	if (fileInputRef.value) fileInputRef.value.value = ''
}

function handleDownload(file: BucketFile) {
	const url = getPublicUrl(file, props.bucket)
	if (!url) {
		toast.add({ title: 'Download unavailable', color: 'error' })
		return
	}
	downloadFile(url, file.name)
}

function handleCopyUrl(file: BucketFile) {
	const url = getPublicUrl(file, props.bucket)
	if (!url) {
		toast.add({ title: 'URL unavailable', color: 'error' })
		return
	}
	copy(url)
	toast.add({ title: 'URL copied', color: 'success' })
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

		<BucketFileToolbar
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
			@create-folder="handleCreateFolder"
		/>

		<DragDropZone @drop="handleFileUpload" />

		<BucketFileTable
			ref="tableRef"
			:files="files"
			:loading="loading"
			@select="onFileClick"
			@row-click="onRowClick"
			@rename="handleRenameFile"
			@delete="handleDeleteFile"
			@download="handleDownload"
			@copy-url="handleCopyUrl"
		/>
	</div>
</template>
