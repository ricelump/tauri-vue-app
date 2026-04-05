import { ListObjectsV2Command, type _Object, type CommonPrefix } from '@aws-sdk/client-s3'
import type { Bucket } from '~/types/bucket'
import type { BucketFile, FileListOptions } from '~/types/file'

export function useBucketFiles(bucketRef?: Ref<Bucket | null>) {
	const currentPath = ref('')
	const files = ref<BucketFile[]>([])
	const loading = ref(false)
	const error = ref<string | null>(null)
	const viewMode = ref<'list' | 'grid'>('list')

	const { getClient } = useS3(bucketRef)

	const breadcrumbs = computed(() => {
		if (!currentPath.value) return []
		return currentPath.value.split('/').filter(Boolean)
	})

	async function listFiles(options: FileListOptions = {}) {
		const bucket = bucketRef?.value
		const client = getClient()

		if (!bucket || !client) {
			files.value = []
			return
		}

		loading.value = true
		error.value = null

		try {
			const command = new ListObjectsV2Command({
				Bucket: bucket.bucketName,
				Prefix: currentPath.value || undefined,
				Delimiter: '/',
				MaxKeys: options.maxKeys || 1000,
			})

			const response = await client.send(command)

			const directories: BucketFile[] = (response.CommonPrefixes || []).map(
				(prefix: CommonPrefix) => ({
					key: prefix.Prefix!,
					name: prefix.Prefix!.replace(currentPath.value, '').replace('/', ''),
					isDirectory: true,
					prefix: prefix.Prefix,
				}),
			)

			const fileObjects: BucketFile[] = (response.Contents || [])
				.filter((obj: _Object) => obj.Key !== currentPath.value)
				.map((obj: _Object) => ({
					key: obj.Key!,
					name: obj.Key!.replace(currentPath.value, ''),
					size: obj.Size || 0,
					lastModified: obj.LastModified || new Date(),
					isDirectory: false,
				}))

			files.value = [...directories, ...fileObjects]
			console.log(files)
		} catch (err: any) {
			error.value = err.message || 'Failed to list files'
			files.value = []
		} finally {
			loading.value = false
		}
	}

	function navigateTo(path: string) {
		currentPath.value = path
		listFiles()
	}

	function navigateUp() {
		const parts = currentPath.value.split('/').filter(Boolean)
		parts.pop()
		currentPath.value = parts.length ? parts.join('/') + '/' : ''
		listFiles()
	}

	function navigateToBreadcrumb(index: number) {
		const parts = breadcrumbs.value.slice(0, index + 1)
		currentPath.value = parts.length ? parts.join('/') + '/' : ''
		listFiles()
	}

	function enterDirectory(directory: BucketFile) {
		if (!directory.isDirectory) return
		currentPath.value = directory.prefix || directory.key
		listFiles()
	}

	watch(
		() => bucketRef?.value?.id,
		() => {
			currentPath.value = ''
			listFiles()
		},
		{ immediate: true },
	)

	return {
		files,
		currentPath: readonly(currentPath),
		breadcrumbs,
		loading: readonly(loading),
		error: readonly(error),
		viewMode,
		listFiles,
		navigateTo,
		navigateUp,
		navigateToBreadcrumb,
		enterDirectory,
		refresh: listFiles,
	}
}
