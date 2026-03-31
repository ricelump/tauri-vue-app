import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart'
import type { Settings } from '~/types/settings'

const defaultSettings: Settings = {
	locale: 'en',
	autoStart: false,
	colorMode: 'system',
	closeToHide: false,
}

const settings = reactive<Settings>({ ...defaultSettings })
const loaded = ref(false)
let initializing = false

async function initSettings() {
	if (initializing || loaded.value) return
	initializing = true

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

		settings.autoStart = await isEnabled()
		watch(
			() => settings.autoStart,
			async (val) => {
				try {
					if (val) await enable()
					else await disable()
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

	loaded.value = true
}

export function useSettings() {
	if (!loaded.value && !initializing) {
		initSettings()
	}

	function $reset() {
		Object.assign(settings, defaultSettings)
	}

	return {
		settings,
		loaded: readonly(loaded),
		$reset,
	}
}

export async function initAppSettings() {
	await initSettings()

	if (!isTauri) return

	const colorMode = useColorMode()
	const { setLocale } = useI18n()

	if (settings.locale) setLocale(settings.locale)
	if (settings.colorMode) colorMode.preference = settings.colorMode
}
