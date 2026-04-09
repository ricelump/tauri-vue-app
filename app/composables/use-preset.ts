import type { ImagePreset, Preset } from '~/types/preset'

const imagePresets = ref<Preset<ImagePreset>[]>([])
const currentImagePresetId = ref<string | null>(null)
const loaded = ref(false)
let initializing = false

export function usePreset() {
	async function loadStore() {
		if (isTauri) {
			const store = await useTauriStoreLoad('presets.json')
			const storedImage = await store.get<Preset<ImagePreset>[]>('imagePresets')
			const storedCurrentImage = await store.get<string>('currentImagePresetId')

			if (storedImage) imagePresets.value = storedImage
			if (storedCurrentImage) currentImagePresetId.value = storedCurrentImage

			watch(
				[imagePresets, currentImagePresetId],
				async () => {
					await store.set('imagePresets', toRaw(imagePresets.value))
					await store.set('currentImagePresetId', currentImagePresetId.value)
				},
				{ deep: true },
			)
		} else {
			const stored = localStorage.getItem('presets')
			if (stored) {
				const parsed = JSON.parse(stored)
				if (parsed.imagePresets) imagePresets.value = parsed.imagePresets
				if (parsed.currentImagePresetId) currentImagePresetId.value = parsed.currentImagePresetId
			}

			watch(
				[imagePresets, currentImagePresetId],
				() => {
					localStorage.setItem(
						'presets',
						JSON.stringify({
							imagePresets: toRaw(imagePresets.value),
							currentImagePresetId: currentImagePresetId.value,
						}),
					)
				},
				{ deep: true },
			)
		}
	}

	const currentImagePreset = computed(
		() => imagePresets.value.find((p) => p.id === currentImagePresetId.value) || null,
	)

	function addImagePreset(name: string, config: ImagePreset) {
		const preset: Preset<ImagePreset> = {
			id: crypto.randomUUID(),
			name,
			config,
		}
		imagePresets.value.push(preset)
		return preset
	}

	function updateImagePreset(id: string, update: { name?: string; config?: Partial<ImagePreset> }) {
		const index = imagePresets.value.findIndex((p) => p.id === id)
		if (index === -1) return null
		const preset = imagePresets.value[index]!
		imagePresets.value[index] = {
			...preset,
			name: update.name ?? preset.name,
			config: update.config ? { ...preset.config, ...update.config } : preset.config,
		}
		return imagePresets.value[index]
	}

	function removeImagePreset(id: string) {
		const index = imagePresets.value.findIndex((p) => p.id === id)
		if (index === -1) return false
		imagePresets.value.splice(index, 1)
		if (currentImagePresetId.value === id) currentImagePresetId.value = null
		return true
	}

	function selectImagePreset(id: string | null) {
		currentImagePresetId.value = id
	}

	async function init() {
		if (initializing || loaded.value) return
		initializing = true
		await loadStore()
		loaded.value = true
	}

	if (!loaded.value && !initializing) init()

	return {
		imagePresets: readonly(imagePresets),
		currentImagePreset,
		currentImagePresetId: readonly(currentImagePresetId),
		loaded: readonly(loaded),
		addImagePreset,
		updateImagePreset,
		removeImagePreset,
		selectImagePreset,
	}
}
