import type { Bucket } from '~/types/bucket'

const buckets = ref<Bucket[]>([])
const currentBucketId = ref<string | null>(null)
const loaded = ref(false)
const initializing = ref(false)

const { encrypt, decrypt } = useCrypto()

export function useBuckets() {
	async function loadBuckets() {
		if (isTauri) {
			const store = await useTauriStoreLoad('buckets.json')
			const stored = await store.get<Bucket[]>('buckets')
			if (stored) {
				buckets.value = await Promise.all(
					stored.map(async (b) => ({
						...b,
						accessKey: await decrypt(b.accessKey),
						secretKey: await decrypt(b.secretKey),
					})),
				)
			}
			const lastSelected = await store.get<string>('currentBucketId')
			if (lastSelected) currentBucketId.value = lastSelected
		} else {
			const stored = localStorage.getItem('buckets')
			if (stored) {
				buckets.value = await Promise.all(
					JSON.parse(stored).map(async (b: Bucket) => ({
						...b,
						accessKey: await decrypt(b.accessKey),
						secretKey: await decrypt(b.secretKey),
					})),
				)
			}
			const lastSelected = localStorage.getItem('currentBucketId')
			if (lastSelected) currentBucketId.value = lastSelected
		}
		loaded.value = true
	}

	async function saveBuckets() {
		const toStore = await Promise.all(
			buckets.value.map(async (b) => ({
				...b,
				accessKey: await encrypt(b.accessKey),
				secretKey: await encrypt(b.secretKey),
			})),
		)

		if (isTauri) {
			const store = await useTauriStoreLoad('buckets.json')
			await store.set('buckets', toStore)
		} else localStorage.setItem('buckets', JSON.stringify(toStore))
	}

	async function addBucket(bucket: Bucket) {
		const newBucket = {
			...bucket,
			id: crypto.randomUUID(),
			createdAt: Date.now(),
		}
		buckets.value.push(newBucket)
		await saveBuckets()
		return newBucket
	}

	async function updateBucket(id: string, bucket: Partial<Omit<Bucket, 'id' | 'createdAt'>>) {
		const index = buckets.value.findIndex((b) => b.id === id)
		if (index === -1) return null

		const existing = buckets.value[index]!
		const updated: Bucket = {
			...existing,
			...bucket,
			accessKey: bucket.accessKey ?? existing.accessKey,
			secretKey: bucket.secretKey ?? existing.secretKey,
		}

		buckets.value[index] = updated
		await saveBuckets()
		return updated
	}

	async function removeBucket(id: string) {
		const index = buckets.value.findIndex((b) => b.id === id)
		if (index === -1) return false

		buckets.value.splice(index, 1)
		if (currentBucketId.value === id) currentBucketId.value = null
		await saveBuckets()
		return true
	}

	async function selectBucket(id: string | null) {
		currentBucketId.value = id
		if (isTauri) {
			const store = await useTauriStoreLoad('buckets.json')
			await store.set('currentBucketId', id)
		} else {
			if (id) localStorage.setItem('currentBucketId', id)
			else localStorage.removeItem('currentBucketId')
		}
	}

	const currentBucket = computed(
		() => buckets.value.find((b) => b.id === currentBucketId.value) || null,
	)

	const hasBuckets = computed(() => buckets.value.length > 0)

	async function init() {
		if (initializing.value || loaded.value) return
		initializing.value = true
		await loadBuckets()
	}

	if (!loaded.value && !initializing.value) init()

	return {
		buckets: readonly(buckets),
		loaded: readonly(loaded),
		currentBucket,
		hasBuckets,
		addBucket,
		updateBucket,
		removeBucket,
		selectBucket,
	}
}
