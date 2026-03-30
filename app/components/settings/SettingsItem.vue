<script setup lang="ts">
defineProps<{
	label: string
	description?: string
	icon?: string
}>()
</script>

<template>
	<div class="flex items-center gap-2">
		<UIcon v-if="icon" :name="icon" class="size-6 text-muted" />
		<div class="flex flex-1 flex-col">
			<span class="text-sm font-medium">{{ label }}</span>
			<span v-if="description" class="text-xs text-muted">{{ description }}</span>
		</div>
		<slot class="ml-auto" />
	</div>
</template>
