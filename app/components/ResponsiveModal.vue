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

const isOpen = defineModel<boolean>('open', { default: false })

function close() {
	isOpen.value = false
}
</script>

<template>
	<UModal
		v-if="isDesktop"
		v-model:open="isOpen"
		:title="title"
		:class="modalClass"
		:ui="{ footer: 'justify-end' }"
	>
		<template v-if="$slots.header" #header>
			<slot name="header" :close="close" />
		</template>
		<template #body>
			<slot name="body" :close="close" />
		</template>
		<template v-if="$slots.footer" #footer>
			<slot name="footer" :close="close" />
		</template>
	</UModal>

	<UDrawer
		v-else
		v-model:open="isOpen"
		:title="title"
		:description="description"
		:class="drawerClass"
	>
		<template v-if="$slots.header" #header>
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
