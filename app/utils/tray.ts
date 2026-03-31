export async function createTray() {
	if (!isTauri) return null

	const trayInstance: any = ref(null)
	if (trayInstance.value) return trayInstance

	const { t } = useI18n()
	const appConfig = useAppConfig()
	const appWindow = useTauriWindowGetCurrentWindow()

	const menu = await useTauriMenuMenu.new({
		items: [
			{
				id: 'show',
				text: t('tray.show'),
				action: async () => {
					await appWindow.show()
					await appWindow.setFocus()
				},
			},
			{
				id: 'relaunch',
				text: t('tray.relaunch'),
				action: async () => {
					await useTauriProcessRelaunch()
				},
			},
			{
				id: 'quit',
				text: t('tray.quit'),
				action: async () => {
					await useTauriProcessExit(0)
				},
			},
		],
	})

	trayInstance.value = await useTauriTrayTrayIcon.new({
		icon: (await useTauriAppDefaultWindowIcon()) as any,
		tooltip: appConfig.app.name,
		menu,
		menuOnLeftClick: false,
	})

	return trayInstance
}
