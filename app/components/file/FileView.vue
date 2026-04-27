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
const { settings } = useSettings()
const toast = useToast()
const { copy } = useClipboard()

async function handleCreateFolder() {
	const folderName = await openInputDialog({
		title: $t('file.createFolder.title'),
		description: $t('file.createFolder.description'),
		icon: 'i-ph-folder-simple-plus',
		placeholder: $t('file.createFolder.placeholder'),
	})
	if (!folderName || folderName.trim() === '') return

	const success = await createFolder(folderName.trim(), currentPath.value)
	if (success) await refresh()
	else toast.add({ title: $t('file.createFolder.error', { name: folderName }), color: 'error' })
}

async function handleRenameFile(file: BucketFile) {
	const oldName = file.name
	const newName = await openInputDialog({
		title: $t('file.rename.title', { name: oldName }),
		description: $t('file.rename.description'),
		icon: 'i-ph-pencil-simple',
		placeholder: oldName,
		defaultValue: oldName,
	})
	if (!newName || newName.trim() === '' || newName === oldName) return

	const oldKey = file.key
	const newKey = file.isDirectory
		? `${currentPath.value}${newName.trim()}/`
		: `${currentPath.value}${newName.trim()}`

	const success = await rename(oldKey, newKey)
	if (success) {
		toast.add({ title: $t('file.rename.success', { name: newName }), color: 'success' })
		await refresh()
	} else toast.add({ title: $t('file.rename.error', { name: oldName }), color: 'error' })
}

async function handleDeleteFile(file: BucketFile) {
	const confirmed = await openConfirmDialog({
		title: $t('file.delete.title', { name: file.name }),
		description: $t('file.delete.description', {
			name: file.name,
			description: file.isDirectory
				? $t('file.delete.folderDescription')
				: $t('file.delete.fileDescription'),
		}),
		destructive: true,
	})
	if (!confirmed) return

	const success = await deleteFile(file.key)
	if (success) {
		await refresh()
		tableRef.value?.clearSelection()
	} else toast.add({ title: $t('file.delete.error', { name: file.name }), color: 'error' })
}

async function handleDeleteAll() {
	const selectedIndices = Object.keys(rowSelection.value).filter((key) => rowSelection.value[key])
	if (selectedIndices.length === 0) return

	const selectedFiles: BucketFile[] = []
	for (const index of selectedIndices) {
		const file = files.value[parseInt(index)]
		if (file) selectedFiles.push(file)
	}

	if (selectedFiles.length === 0) return

	const confirmed = await openConfirmDialog({
		title: $t('file.deleteAll.title', { count: selectedFiles.length }),
		description: $t('file.deleteAll.description', {
			count: selectedFiles.length,
			description: selectedFiles.some((f: BucketFile) => f.isDirectory)
				? $t('file.deleteAll.folderDescription')
				: $t('file.deleteAll.fileDescription'),
		}),
		destructive: true,
	})
	if (!confirmed) return

	const keys = selectedFiles.map((f: BucketFile) => f.key)
	const success = await deleteFiles(keys)
	if (success) {
		await refresh()
		tableRef.value?.clearSelection()
	} else toast.add({ title: $t('file.deleteAll.error'), color: 'error' })
}

async function processFile(file: File): Promise<File> {
	if (file.type.startsWith('image/') && currentImagePreset.value)
		return processImage(file, currentImagePreset.value.config)
	return file
}

function getPublicUrlFromKey(key: string): string | null {
	if (!props.bucket) return null
	const base = props.bucket.publicUrl || props.bucket.endpoint
	if (!base) return null
	const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base
	return `${cleanBase}/${key}`
}

async function handleFileUpload(selectedFiles: FileList | null) {
	if (!selectedFiles || !props.bucket) return

	const files = Array.from(selectedFiles)

	// toast.add({
	// 	title: `Uploading ${files.length} file${files.length > 1 ? 's' : ''}`,
	// 	color: 'info',
	// 	icon: 'i-ph-upload-simple',
	// })

	const uploadedKeys: string[] = []

	await Promise.all(
		files.map(async (file) => {
			const processedFile = await processFile(file)
			const filename = processedFile.name
			const key = `${currentPath.value}${filename}`

			try {
				const success = await upload(key, processedFile, processedFile.type)
				if (!success) throw new Error()
				uploadedKeys.push(key)
			} catch {
				toast.add({
					title: $t('file.upload.error', { name: filename }),
					color: 'error',
					icon: 'i-ph-warning-circle',
				})
			}
		}),
	)

	await refresh()

	if (fileInputRef.value) fileInputRef.value.value = ''

	if (files.length === 1 && uploadedKeys.length === 1 && settings.autoCopy) {
		const url = getPublicUrlFromKey(uploadedKeys[0]!)
		if (url) copy(url)
	}
}

function handleDownload(file: BucketFile) {
	const url = getPublicUrl(file, props.bucket)
	if (!url) {
		toast.add({ title: $t('file.download.unavailable'), color: 'error' })
		return
	}
	downloadFile(url, file.name)
}

function handleCopyUrl(file: BucketFile) {
	const url = getPublicUrl(file, props.bucket)
	if (!url) {
		toast.add({ title: $t('file.copyUrl.unavailable'), color: 'error' })
		return
	}
	copy(url)
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
	<div class="relative flex flex-col">
		<input
			ref="fileInputRef"
			type="file"
			multiple
			class="hidden"
			@change="handleFileUpload(($event.target as HTMLInputElement).files)"
		/>

		<FileToolbar
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

		<FileTable
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
