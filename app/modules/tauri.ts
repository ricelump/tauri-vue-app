import * as tauriApp from '@tauri-apps/api/app'
import * as tauriWebviewWindow from '@tauri-apps/api/webviewWindow'
import * as tauriWindow from '@tauri-apps/api/window'
import * as tauriAutoStart from '@tauri-apps/plugin-autostart'
import * as tauriOs from '@tauri-apps/plugin-os'
import * as tauriStore from '@tauri-apps/plugin-store'
import { addImports, defineNuxtModule } from 'nuxt/kit'

const capitalize = (name: string) => {
	return name.charAt(0).toUpperCase() + name.slice(1)
}

const tauriModules = [
	{ module: tauriApp, prefix: 'App', importPath: '@tauri-apps/api/app' },
	{ module: tauriWindow, prefix: 'Window', importPath: '@tauri-apps/api/window' },
	{
		module: tauriWebviewWindow,
		prefix: 'WebviewWindow',
		importPath: '@tauri-apps/api/webviewWindow',
	},
	{ module: tauriOs, prefix: 'Os', importPath: '@tauri-apps/plugin-os' },
	{ module: tauriStore, prefix: 'Store', importPath: '@tauri-apps/plugin-store' },
	{ module: tauriAutoStart, prefix: 'AutoStart', importPath: '@tauri-apps/plugin-autostart' },
]

export default defineNuxtModule({
	meta: {
		name: 'nuxt-tauri',
		configKey: 'tauri',
	},
	defaults: {
		prefix: 'useTauri',
	},
	setup(options) {
		tauriModules.forEach(({ module, prefix, importPath }) => {
			Object.keys(module)
				.filter((name) => name !== 'default')
				.forEach((name) => {
					const prefixedName = `${options.prefix}${prefix}` || ''
					const as = prefixedName ? prefixedName + capitalize(name) : name
					addImports({ from: importPath, name, as })
				})
		})
	},
})
