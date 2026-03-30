<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { LazySettingsModal } from '#components'

const overlay = useOverlay()
const settingsModal = overlay.create(LazySettingsModal)

const items = ref<DropdownMenuItem[][]>([
	[
		{
			label: 'Settings',
			icon: 'i-ph-gear-fine',
			onClick: () => settingsModal.open(),
		},
	],
])
</script>

<template>
	<UDropdownMenu :items="items">
		<UTooltip text="Open Application Menu">
			<UButton icon="i-ph-list" color="neutral" variant="ghost" />
		</UTooltip>
	</UDropdownMenu>
</template>
