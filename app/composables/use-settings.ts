import type { Settings } from '~/types/settings'

const defaultSettings: Settings = {
	locale: 'en',
	autoStart: false,
	colorMode: 'system',
}

export function useSettings() {
	const settings = reactive<Settings>({ ...defaultSettings })
	const loaded = ref(false)

	async function loadStore() {
		if (isTauri) {
			const store = await useTauriStoreLoad('settings.json')

			const stored = await store.get<Settings>('settings')
			if (stored) Object.assign(settings, stored)

			watch(
				settings,
				async (val) => {
					await store.set('settings', toRaw(val))
				},
				{ deep: true },
			)
		} else {
			const stored = localStorage.getItem('settings')
			if (stored) Object.assign(settings, JSON.parse(stored))

			watch(
				settings,
				(val) => {
					localStorage.setItem('settings', JSON.stringify(toRaw(val)))
				},
				{ deep: true },
			)
		}

		loaded.value = true
	}

	function $reset() {
		Object.assign(settings, defaultSettings)
	}

	onMounted(loadStore)

	return {
		settings,
		loaded,
		$reset,
	}
}
