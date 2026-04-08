<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'

interface Props {
	title?: string
	description?: string
	modalClass?: string
	drawerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
	modalClass: 'min-h-[75dvh] max-w-5xl',
	drawerClass: 'min-h-[75dvh]',
})

const isDesktop = useMediaQuery('(min-width: 768px)')

const emit = defineEmits<{ close: [] }>()

function close() {
	emit('close')
}
</script>

<template>
	<UModal
		v-if="isDesktop"
		:title="title"
		:close="!!title"
		:dismissible="false"
		:class="modalClass"
		:ui="{ footer: 'justify-end' }"
	>
		<template v-if="$slots.header" #header="{ close: modalClose }">
			<slot name="header" :close="modalClose" />
		</template>
		<template #body="{ close: modalClose }">
			<slot name="body" :close="modalClose" />
		</template>
		<template v-if="$slots.footer" #footer="{ close: modalClose }">
			<slot name="footer" :close="modalClose" />
		</template>
	</UModal>

	<UDrawer v-else :title="props.title" :description="props.description" :class="drawerClass">
		<template v-if="$slots.header" #footer>
			<slot name="header" :close="close" />
		</template>
		<template #body>
			<slot name="body" :close="close" />
		</template>
		<template v-if="$slots.footer" #footer>
			<slot name="footer" :close="close" />
		</template>
	</UDrawer>
</template>
