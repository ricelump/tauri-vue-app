<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'

interface Props {
	close?: () => void
	title?: string
	description?: string
	modalClass?: string
	drawerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
	close: undefined,
	modalClass: 'min-h-[75dvh] max-w-5xl',
	drawerClass: 'min-h-[75dvh]',
})

const isDesktop = useMediaQuery('(min-width: 768px)')

defineExpose({
	close: props.close,
})
</script>

<template>
	<UModal
		v-if="isDesktop"
		:title="props.title"
		:description="props.description"
		:close="props.title ? true : false"
		:class="modalClass"
	>
		<template #body="{ close: modalClose }">
			<slot name="body" :close="props.close || modalClose" />
		</template>
	</UModal>

	<UDrawer v-else :title="props.title" :description="props.description" :class="drawerClass">
		<template #body>
			<slot name="body" :close="props.close" />
		</template>
	</UDrawer>
</template>
