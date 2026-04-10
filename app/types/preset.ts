export interface ImagePreset {
	format?: 'webp' | 'jpeg' | 'png' | 'avif'
	quality?: number
	maxWidth?: number
	maxHeight?: number
}

export interface Preset<T> {
	id: string
	name: string
	config: T
}
