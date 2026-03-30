<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'

const isDesktop = useMediaQuery('(min-width: 768px)')
</script>

<template>
	<UModal v-if="isDesktop" :close="false" class="max-w-2xl">
		<template #body="{ close }">
			<Settings :close="close" />
		</template>
	</UModal>

	<UDrawer v-else>
		<template #body>
			<Settings />
		</template>
	</UDrawer>
</template>
