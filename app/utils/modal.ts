import { LazyAlertModal, LazyInputModal } from '#components'

const overlay = useOverlay()

const alertModal = overlay.create(LazyAlertModal)
const inputModal = overlay.create(LazyInputModal)

export async function openConfirmDialog(options: {
	title: string
	description: string
	destructive?: boolean
}): Promise<boolean> {
	return new Promise((resolve) => {
		alertModal.open({
			title: options.title,
			description: options.description,
			icon: 'i-ph-trash',
			destructive: options.destructive ?? false,
			onConfirm: () => {
				resolve(true)
			},
		})
	})
}

export async function openInputDialog(options: {
	title: string
	description: string
	icon?: string
	placeholder?: string
	defaultValue?: string
}): Promise<string | null> {
	return new Promise((resolve) => {
		inputModal.open({
			title: options.title,
			description: options.description,
			icon: options.icon || 'i-ph-folder-simple-plus',
			placeholder: options.placeholder || 'Name',
			defaultValue: options.defaultValue || '',
			onConfirm: (value: string) => {
				resolve(value)
			},
		})
	})
}
