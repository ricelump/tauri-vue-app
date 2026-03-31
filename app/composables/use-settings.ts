import type { Locales, Settings } from '~/types/settings'

const defaultSettings: Settings = {
	locale: 'en',
	autoStart: false,
	colorMode: 'system',
	accentColor: 'blue',
	closeToHide: false,
}

export function useSettings() {
	const settings = reactive<Settings>({ ...defaultSettings })
	const loaded = ref(false)
	const initializing = ref(false)

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

			settings.autoStart = await useTauriAutoStartIsEnabled()
			watch(
				() => settings.autoStart,
				async (val) => {
					try {
						if (val) await useTauriAutoStartEnable()
						else await useTauriAutoStartDisable()
					} catch {}
				},
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
	}

	// async function initLocale() {
	// 	if (!isTauri) return

	// 	const sysLocale = await useTauriOsLocale()
	// 	const normalized = sysLocale?.toLowerCase().replace('-', '_')

	// 	const supported = ['en', 'es', 'fr', 'ja', 'zh_cn', 'zh_tw'] as Locales[]
	// 	const matched = supported.find((l) => normalized === l || normalized?.startsWith(l + '_'))

	// 	settings.locale = matched || 'en'
	// }

	async function initAutoStart() {
		if (!isTauri) return

		settings.autoStart = await useTauriAutoStartIsEnabled()

		watch(
			() => settings.autoStart,
			async (val) => {
				try {
					if (val) await useTauriAutoStartEnable()
					else await useTauriAutoStartDisable()
				} catch {}
			},
		)
	}

	async function init() {
		if (initializing.value || loaded.value) return
		initializing.value = true

		await loadStore()
		await initAutoStart()

		loaded.value = true
	}

	function $reset() {
		Object.assign(settings, defaultSettings)
	}

	if (!loaded.value && !initializing.value) init()

	return {
		settings,
		loaded: readonly(loaded),
		init,
		$reset,
	}
}
