import type { Bucket } from '~/types/bucket'

const buckets = ref<Bucket[]>([])
const loaded = ref(false)
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
		} else {
			const stored = localStorage.getItem('buckets')
			if (stored) {
				const parsed = JSON.parse(stored)
				buckets.value = parsed.map((b: Bucket) => ({
					...b,
					accessKey: atob(b.accessKey),
					secretKey: atob(b.secretKey),
				}))
			}
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
		} else {
			localStorage.setItem('buckets', JSON.stringify(toStore))
		}
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

	if (!loaded.value) loadBuckets()

	return {
		buckets: readonly(buckets),
		loaded: readonly(loaded),
		addBucket,
		loadBuckets,
	}
}
