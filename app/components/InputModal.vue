<script setup lang="ts">
interface Props {
	title?: string
	description?: string
	icon?: string
	placeholder?: string
	defaultValue?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	close: []
	confirm: [value: string]
}>()

const inputValue = ref(props.defaultValue || '')

function handleConfirm() {
	emit('confirm', inputValue.value)
	emit('close')
}

function handleClose() {
	emit('close')
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
