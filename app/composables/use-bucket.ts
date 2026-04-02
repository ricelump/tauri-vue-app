import type { Bucket } from '~/types/bucket'

const buckets = ref<Bucket[]>([])
const currentBucketId = ref<string | null | undefined>(null)
const loaded = ref(false)

const { encrypt, decrypt } = useCrypto()

interface Storage {
	get(key: string): Promise<unknown>
	set(key: string, value: unknown): Promise<void>
}

function createStorage(): Storage {
	if (isTauri) {
		let store: {
			get: (key: string) => Promise<unknown>
			set: (key: string, value: unknown) => Promise<void>
		} | null = null

		return {
			async get(key: string) {
				if (!store) store = await useTauriStoreLoad('buckets.json')
				return store.get(key)
			},
			async set(key: string, value: unknown) {
				if (!store) store = await useTauriStoreLoad('buckets.json')
				await store.set(key, value)
			},
		}
	}

	return {
		async get(key: string) {
			const item = localStorage.getItem(key)
			return item ? JSON.parse(item) : null
		},
		async set(key: string, value: unknown) {
			localStorage.setItem(key, JSON.stringify(value))
		},
	}
}

const storage = createStorage()

export function useBuckets() {
	async function loadBuckets() {
		const stored = (await storage.get('buckets')) as Bucket[] | null

		if (stored) {
			buckets.value = await Promise.all(
				stored.map(async (b) => ({
					...b,
					accessKey: await decrypt(b.accessKey),
					secretKey: await decrypt(b.secretKey),
				})),
			)
		}

		const lastSelected = (await storage.get('currentBucketId')) as string | null

		if (lastSelected) {
			const exists = buckets.value.find((b) => b.id === lastSelected)
			if (exists) currentBucketId.value = lastSelected
		}

		loaded.value = true
	}

	async function addBucket(bucket: Bucket) {
		const newBucket = {
			...bucket,
			accessKey: await encrypt(bucket.accessKey),
			secretKey: await encrypt(bucket.secretKey),
			id: crypto.randomUUID(),
			createdAt: Date.now(),
		}
		buckets.value.push(newBucket)
		return newBucket
	}

	function selectBucket(id: string | null | undefined) {
		currentBucketId.value = id
		storage.set('currentBucketId', id)
	}

	const currentBucket = computed(
		() => buckets.value.find((b) => b.id === currentBucketId.value) || null,
	)

	const hasBuckets = computed(() => buckets.value.length > 0)

	if (!loaded.value) loadBuckets()

	watch(currentBucketId, (id) => storage.set('currentBucketId', id))

	return {
		buckets: readonly(buckets),
		loaded: readonly(loaded),
		addBucket,
		loadBuckets,
		currentBucket,
		hasBuckets,
		selectBucket,
	}
}
