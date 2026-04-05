<script setup lang="ts">
const emit = defineEmits<{
	drop: [files: FileList]
}>()

const isDragging = ref(false)
let dragCounter = 0

function onDragEnter(e: DragEvent) {
	e.preventDefault()
	dragCounter++
	if (dragCounter === 1) isDragging.value = true
}

function onDragLeave(e: DragEvent) {
	e.preventDefault()
	dragCounter--
	if (dragCounter === 0) isDragging.value = false
}

function onDragOver(e: DragEvent) {
	e.preventDefault()
}

function onDrop(e: DragEvent) {
	e.preventDefault()
	dragCounter = 0
	isDragging.value = false
	const files = e.dataTransfer?.files
	if (files?.length) emit('drop', files)
}

onMounted(() => {
	window.addEventListener('dragenter', onDragEnter)
	window.addEventListener('dragleave', onDragLeave)
	window.addEventListener('dragover', onDragOver)
	window.addEventListener('drop', onDrop)
})

onUnmounted(() => {
	window.removeEventListener('dragenter', onDragEnter)
	window.removeEventListener('dragleave', onDragLeave)
	window.removeEventListener('dragover', onDragOver)
	window.removeEventListener('drop', onDrop)
})
</script>

<template>
	<Teleport to="body">
		<div
			v-if="isDragging"
			class="fixed inset-0 z-50 flex items-center justify-center bg-default/10 backdrop-blur-lg"
		>
			<div class="flex flex-col items-center gap-2">
				<UIcon name="i-ph-upload-simple" class="size-12" />
				<p class="text-lg font-medium">Drop files here</p>
			</div>
		</div>
	</Teleport>
</template>
