import type { ShortcutEvent } from '@tauri-apps/plugin-global-shortcut'

const registeredShortcuts = reactive<Map<string, () => void>>(new Map())
let appWindow: any = null
let isInitialized = false

export function useGlobalShortcut() {
	if (!isTauri) {
		return {
			registerShortcut: async () => false,
			unregisterShortcut: async () => false,
			toggleWindow: async () => {},
			// isRegistered: (accelerator: string) => false,
			isRegistered: () => false,
			registeredShortcuts: readonly(registeredShortcuts),
		}
	}

	if (!appWindow) appWindow = useTauriWindowGetCurrentWindow()

	async function init() {
		if (isInitialized) return
		isInitialized = true

		try {
			await useTauriGlobalShortcutUnregisterAll()
		} catch {}
	}

	async function registerShortcut(accelerator: string | null, callback: () => void) {
		if (!accelerator) return false

		try {
			try {
				await useTauriGlobalShortcutUnregister(accelerator)
			} catch {}

			await useTauriGlobalShortcutRegister(accelerator, (event: ShortcutEvent) => {
				if (event.state === 'Pressed') callback()
			})

			registeredShortcuts.set(accelerator, callback)
			return true
		} catch (err) {
			console.error(`Failed to register shortcut ${accelerator}:`, err)
			return false
		}
	}

	async function unregisterShortcut(accelerator: string) {
		try {
			await useTauriGlobalShortcutUnregister(accelerator)
			registeredShortcuts.delete(accelerator)
			return true
		} catch {
			return false
		}
	}

	async function toggleWindow() {
		if (!appWindow) return

		const visible = await appWindow.isVisible()
		if (visible) {
			await appWindow.hide()
		} else {
			await appWindow.show()
			await appWindow.setFocus()
		}
	}

	function isRegistered(accelerator: string) {
		return registeredShortcuts.has(accelerator)
	}

	init()

	onScopeDispose(async () => {
		for (const accelerator of registeredShortcuts.keys()) {
			try {
				await useTauriGlobalShortcutUnregister(accelerator)
			} catch {}
		}
		registeredShortcuts.clear()
		appWindow = null
	})

	return {
		registerShortcut,
		unregisterShortcut,
		toggleWindow,
		isRegistered,
		registeredShortcuts: readonly(registeredShortcuts),
	}
}
