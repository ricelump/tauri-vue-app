<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'

const isDesktop = useMediaQuery('(min-width: 768px)')
</script>

<template>
	<UModal v-if="isDesktop" :close="false" class="h-[75dvh] max-w-5xl">
		<template #body="{ close }">
			<Settings :close="close" />
		</template>
	</UModal>

	<UDrawer v-else class="h-[75dvh]">
		<template #body>
			<Settings />
		</template>
	</UDrawer>
</template>
