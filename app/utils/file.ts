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

export const extensionIconMap: Record<string, string> = {
	pdf: 'i-ph-file-pdf',
	zip: 'i-ph-file-archive',
	rar: 'i-ph-file-archive',
	'7z': 'i-ph-file-archive',
	tar: 'i-ph-file-archive',
	gz: 'i-ph-file-archive',
	mp3: 'i-ph-file-audio',
	wav: 'i-ph-file-audio',
	flac: 'i-ph-file-audio',
	aac: 'i-ph-file-audio',
	ogg: 'i-ph-file-audio',
	mp4: 'i-ph-file-video',
	avi: 'i-ph-file-video',
	mkv: 'i-ph-file-video',
	mov: 'i-ph-file-video',
	wmv: 'i-ph-file-video',
	flv: 'i-ph-file-video',
	html: 'i-ph-file-html',
	htm: 'i-ph-file-html',
	css: 'i-ph-file-css',
	csv: 'i-ph-file-csv',
	doc: 'i-ph-file-doc',
	docx: 'i-ph-file-doc',
	xls: 'i-ph-file-xls',
	xlsx: 'i-ph-file-xls',
	ppt: 'i-ph-file-ppt',
	pptx: 'i-ph-file-ppt',
	jpg: 'i-ph-file-jpg',
	jpeg: 'i-ph-file-jpg',
	png: 'i-ph-file-png',
	gif: 'i-ph-file-image',
	svg: 'i-ph-file-svg',
	webp: 'i-ph-file-image',
	avif: 'i-ph-file-image',
	bmp: 'i-ph-file-image',
	ico: 'i-ph-file-image',
	js: 'i-ph-file-js',
	jsx: 'i-ph-file-jsx',
	ts: 'i-ph-file-ts',
	tsx: 'i-ph-file-tsx',
	py: 'i-ph-file-py',
	json: 'i-ph-file-code',
	xml: 'i-ph-file-code',
	yaml: 'i-ph-file-code',
	yml: 'i-ph-file-code',
	toml: 'i-ph-file-code',
	txt: 'i-ph-file-text',
	log: 'i-ph-file-text',
	md: 'i-ph-file-md',
	mdx: 'i-ph-file-md',
	php: 'i-ph-file-code',
	c: 'i-ph-file-c',
	h: 'i-ph-file-c',
	cpp: 'i-ph-file-cpp',
	cxx: 'i-ph-file-cpp',
	hpp: 'i-ph-file-cpp',
	cs: 'i-ph-file-c-sharp',
	rs: 'i-ph-file-rs',
	sql: 'i-ph-file-sql',
	vue: 'i-ph-file-vue',
	lock: 'i-ph-file-lock',
	ini: 'i-ph-file-code',
	cfg: 'i-ph-file-code',
	conf: 'i-ph-file-code',
	sh: 'i-ph-file-code',
	bash: 'i-ph-file-code',
	zsh: 'i-ph-file-code',
	fish: 'i-ph-file-code',
	bat: 'i-ph-file-code',
	cmd: 'i-ph-file-code',
	ps1: 'i-ph-file-code',
}

export function getFileIcon(file: BucketFile): string {
	if (file.isDirectory) return 'i-ph-folder-simple'
	const ext = file.name.split('.').pop()?.toLowerCase()
	if (ext && extensionIconMap[ext]) return extensionIconMap[ext]
	return 'i-ph-file'
}
