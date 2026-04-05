export interface BucketFile {
	key: string
	name: string
	size?: number
	lastModified?: Date
	isDirectory: boolean
	prefix?: string
}

export interface FileListOptions {
	prefix?: string
	delimiter?: string
	maxKeys?: number
}
