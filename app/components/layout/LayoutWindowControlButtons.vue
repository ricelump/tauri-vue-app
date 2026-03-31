<script setup lang="ts">
const appWindow = useTauriWindowGetCurrentWindow()
const { settings } = useSettings()

const windowControlButtons = computed(() => [
	{
		key: 'minimize',
		icon: 'i-ph-minus',
		onClick: async () => {
			await appWindow.minimize()
		},
	},
	{
		key: 'maximize',
		icon: 'i-ph-square',
		onClick: async () => {
			if (await appWindow.isMaximized()) await appWindow.unmaximize()
			else await appWindow.maximize()
		},
	},
	{
		key: 'close',
		icon: 'i-ph-x',
		onClick: async () => {
			if (settings.closeToHide) await appWindow.hide()
			else await appWindow.close()
		},
	},
])
</script>

<template>
	<section class="flex h-full items-center">
		<div class="flex items-center">
			<template v-for="button of windowControlButtons" :key="button.key">
				<UButton
					size="sm"
					variant="ghost"
					color="neutral"
					:icon="button.icon"
					:class="[
						'flex size-12 items-center justify-center rounded-none p-0',
						button.key === 'close' && 'hover:bg-red-500 hover:text-white active:bg-red-600',
					]"
					@click="button.onClick"
				/>
			</template>
		</div>
	</section>
</template>
