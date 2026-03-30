<script setup lang="ts">
const appConfig = useAppConfig()

async function handleWindowDrag(event: MouseEvent) {
	if (!isTauri) return

	const target = event.target as HTMLElement
	if (
		target.closest('button') ||
		target.closest('[role="button"]') ||
		target.closest('input') ||
		target.closest('select')
	) {
		return
	}

	if (event.button !== 0) return

	try {
		const windows = await useTauriWindowGetAllWindows()

		windows.forEach((window) => {
			if (window.label === 'main') {
				window.startDragging()
			}
		})
	} catch (error) {
		console.error(error)
	}
}
</script>

<template>
	<div
		class="fixed top-0 right-0 left-0 z-50 flex h-12 items-center justify-between pl-4 select-none"
		@mousedown="handleWindowDrag"
	>
		<section class="flex h-full items-center">
			<p class="text-sm">{{ appConfig.app.name }}</p>
		</section>

		<LayoutWindowControlButtons v-if="isTauri" />
	</div>
</template>
