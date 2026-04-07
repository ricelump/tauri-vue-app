<script setup lang="ts">
interface Props {
	title?: string
	description?: string
	icon?: string
	placeholder?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	close: []
	confirm: [value: string]
}>()

const inputValue = ref('')

function handleConfirm() {
	emit('confirm', inputValue.value)
	emit('close')
}

function handleClose() {
	emit('close')
}

function handleKeydown(e: KeyboardEvent) {
	if (e.key === 'Enter') {
		e.preventDefault()
		handleConfirm()
	}
}
</script>

<template>
	<AlertModal
		:title="title"
		:description="description"
		:icon="icon"
		@close="handleClose"
		@confirm="handleConfirm"
	>
		<UInput v-model="inputValue" :placeholder="placeholder" @keydown.enter="handleConfirm" />
	</AlertModal>
</template>
