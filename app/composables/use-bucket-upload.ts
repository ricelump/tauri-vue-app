import type { Bucket } from '~/types/bucket'

export function useBucketUpload(
	bucketRef: Ref<Bucket | null>,
	currentPath: Ref<string>,
	refresh: () => Promise<void>,
) {
	const fileInput = ref<HTMLInputElement>()
	const { upload: s3Upload } = useS3(bucketRef)
	const toast = useToast()

	async function uploadFiles(selectedFiles: FileList | null) {
		if (!selectedFiles || !bucketRef.value) return

		const files = Array.from(selectedFiles)

		toast.add({
			title: `Uploading ${files.length} file${files.length > 1 ? 's' : ''}`,
			color: 'info',
			icon: 'i-ph-upload-simple',
		})

		await Promise.all(files.map((file) => uploadSingle(file)))
		await refresh()
		if (fileInput.value) fileInput.value.value = ''
	}

	async function uploadSingle(file: File) {
		const key = `${currentPath.value}${file.name}`
		try {
			const success = await s3Upload(key, file, file.type)
			if (success) {
				toast.add({
					title: `${file.name} uploaded`,
					color: 'success',
					icon: 'i-ph-check-circle',
				})
			} else {
				throw new Error('Upload failed')
			}
		} catch {
			toast.add({
				title: `${file.name} failed`,
				color: 'error',
				icon: 'i-ph-warning-circle',
			})
		}
	}

	function openFilePicker() {
		fileInput.value?.click()
	}

	return {
		fileInput,
		uploadFiles,
		openFilePicker,
	}
}
