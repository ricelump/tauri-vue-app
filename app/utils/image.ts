import mime from 'mime'
import resize from '@jsquash/resize'
import type { ImagePreset } from '~/types/preset'

const SUPPORTED_INPUT_MIME = {
	'image/avif': 'avif',
	'image/jpg': 'jpeg',
	'image/jpeg': 'jpeg',
	'image/webp': 'webp',
	'image/png': 'png',
} as const

const wasmInitialized = new Map<string, boolean>()

async function ensureWasmLoaded(format: string): Promise<void> {
	if (wasmInitialized.get(format)) return

	try {
		switch (format) {
			case 'avif':
				await import('@jsquash/avif')
				break
			case 'jpeg':
				await import('@jsquash/jpeg')
				break
			case 'png':
				await import('@jsquash/png')
				break
			case 'webp':
				await import('@jsquash/webp')
				break
		}
		wasmInitialized.set(format, true)
	} catch (error) {
		console.error(`Failed to initialize WASM for ${format}:`, error)
		throw new Error(`Failed to initialize ${format} support`)
	}
}

async function decode(
	sourceMime: keyof typeof SUPPORTED_INPUT_MIME,
	fileBuffer: ArrayBuffer,
): Promise<ImageData> {
	const sourceType = SUPPORTED_INPUT_MIME[sourceMime]
	await ensureWasmLoaded(sourceType)

	try {
		switch (sourceType) {
			case 'avif': {
				const { decode } = await import('@jsquash/avif')
				const result = await decode(fileBuffer)
				if (!result) throw new Error('Failed to decode AVIF')
				return result
			}
			case 'jpeg': {
				const { decode } = await import('@jsquash/jpeg')
				const result = await decode(fileBuffer)
				if (!result) throw new Error('Failed to decode JPEG')
				return result
			}
			case 'png': {
				const { decode } = await import('@jsquash/png')
				const result = await decode(fileBuffer)
				if (!result) throw new Error('Failed to decode PNG')
				return result
			}
			case 'webp': {
				const { decode } = await import('@jsquash/webp')
				const result = await decode(fileBuffer)
				if (!result) throw new Error('Failed to decode WebP')
				return result
			}
			default:
				throw new Error(`Unsupported source type: ${sourceMime}`)
		}
	} catch (error) {
		console.error(`Failed to decode ${sourceMime} image:`, error)
		throw new Error(`Failed to decode ${sourceMime} image`)
	}
}

async function encode(
	format: 'webp' | 'jpeg' | 'png' | 'avif',
	imageData: ImageData,
	quality: number,
): Promise<ArrayBuffer> {
	await ensureWasmLoaded(format)

	try {
		switch (format) {
			case 'avif': {
				const { encode } = await import('@jsquash/avif')
				return await encode(imageData, { quality })
			}
			case 'jpeg': {
				const { encode } = await import('@jsquash/jpeg')
				return await encode(imageData, { quality })
			}
			case 'png': {
				const { encode } = await import('@jsquash/png')
				return await encode(imageData)
			}
			case 'webp': {
				const { encode } = await import('@jsquash/webp')
				return await encode(imageData, { quality })
			}
			default:
				throw new Error(`Unsupported format: ${format}`)
		}
	} catch (error) {
		console.error(`Failed to encode to ${format}:`, error)
		throw new Error(`Failed to encode to ${format}`)
	}
}

function isSupportedFileType(file: File): boolean {
	return Object.keys(SUPPORTED_INPUT_MIME).includes(file.type)
}

export async function processImage(file: File, preset: ImagePreset): Promise<File> {
	if (!isSupportedFileType(file)) return file

	const { maxWidth, maxHeight, format, quality } = preset

	const needsResize = maxWidth != null && maxHeight != null
	const needsConvert = format != null

	// Nothing to do if no options are set
	if (!needsResize && !needsConvert) return file

	const sourceMime = file.type as keyof typeof SUPPORTED_INPUT_MIME
	const sourceFormat = SUPPORTED_INPUT_MIME[sourceMime]
	const fileBuffer = await file.arrayBuffer()
	let imageData = await decode(sourceMime, fileBuffer)

	// Resize if dimensions are specified and image exceeds them
	if (needsResize && (imageData.width > maxWidth || imageData.height > maxHeight)) {
		const scale = Math.min(maxWidth / imageData.width, maxHeight / imageData.height)
		const width = Math.round(imageData.width * scale)
		const height = Math.round(imageData.height * scale)
		imageData = await resize(imageData, { width, height })
	}

	// Use target format or keep original
	const outputFormat = format ?? sourceFormat
	const outputQuality = quality ?? 85

	const encodedBuffer = await encode(outputFormat, imageData, outputQuality)
	const outputMime = mime.getType(outputFormat)

	return new File([encodedBuffer], file.name.replace(/\.[^.]+$/, `.${outputFormat}`), {
		type: outputMime ?? `image/${outputFormat}`,
		lastModified: file.lastModified,
	})
}
