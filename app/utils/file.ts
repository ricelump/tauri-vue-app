import type { Bucket } from '~/types/bucket'
import type { BucketFile } from '~/types/file'

export function getPublicUrl(file: BucketFile, bucket: Bucket | null): string | null {
	if (!bucket) return null
	const base = bucket.publicUrl || bucket.endpoint
	if (!base) return null
	const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base
	return `${cleanBase}/${file.key}`
}

export async function downloadFile(url: string, filename: string) {
	if (isTauri) {
		const savePath = await useTauriDialogSave({ defaultPath: filename })
		if (!savePath) return

		await useTauriUploadDownload(url, savePath)
	} else {
		const a = document.createElement('a')
		a.href = url
		a.download = filename
		a.target = '_blank'
		a.click()
	}
}
