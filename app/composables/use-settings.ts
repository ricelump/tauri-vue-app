import type { Settings } from '~/types/settings'

const defaultSettings: Settings = {
	locale: 'en',
	autoCopy: false,
	autoStart: false,
	colorMode: 'system',
	accentColor: 'blue',
	closeToHide: false,
	shortcuts: {
		toggleWindow: null as string | null,
	},
}

const settings = reactive<Settings>({ ...defaultSettings })
const loaded = ref(false)
let initializing = false

export function useSettings() {
	const { registerShortcut, unregisterShortcut, toggleWindow } = useGlobalShortcut()

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

	async function initShortcuts() {
		if (!isTauri) return

		if (settings.shortcuts.toggleWindow)
			await registerShortcut(settings.shortcuts.toggleWindow, toggleWindow)

		watch(
			() => settings.shortcuts.toggleWindow,
			async (newVal, oldVal) => {
				if (oldVal) await unregisterShortcut(oldVal)
				if (newVal) await registerShortcut(newVal, toggleWindow)
			},
		)
	}

	async function init() {
		if (initializing || loaded.value) return
		initializing = true

		await loadStore()
		await initShortcuts()

		loaded.value = true
	}

	function $reset() {
		Object.assign(settings, defaultSettings)
	}

	if (!loaded.value && !initializing) init()

	return {
		settings,
		loaded: readonly(loaded),
		$reset,
	}
}
