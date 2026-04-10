export type Locales = 'en' | 'fr' | 'zh_cn' | 'zh_tw' | 'ja'

export interface Settings {
	locale: Locales
	autoCopy: boolean
	autoStart: boolean
	colorMode: 'light' | 'dark' | 'system'
	accentColor: string
	closeToHide: boolean
	shortcuts: {
		toggleWindow: string | null
	}
}
