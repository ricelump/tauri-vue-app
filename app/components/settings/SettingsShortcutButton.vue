<script setup lang="ts">
const { settings } = useSettings()

const recording = ref(false)
const displayKeys = ref<string[]>([])

const hasShortcut = computed(() => !!settings.shortcuts.toggleWindow)

function formatShortcut(accelerator: string | null): string[] {
	if (!accelerator) return []
	return accelerator.split('+').map((k) => k.trim())
}

function startRecording() {
	recording.value = true
	displayKeys.value = []
	window.addEventListener('keydown', handleKeyDown, true)
	window.addEventListener('keyup', handleKeyUp, true)
}

function stopRecording() {
	recording.value = false
	displayKeys.value = []
	window.removeEventListener('keydown', handleKeyDown, true)
	window.removeEventListener('keyup', handleKeyUp, true)
}

function handleKeyDown(e: KeyboardEvent) {
	if (!recording.value) return
	e.preventDefault()
	e.stopPropagation()

	const keys = new Set<string>()

	if (e.metaKey) keys.add('Command')
	if (e.ctrlKey) keys.add('Control')
	if (e.altKey) keys.add('Alt')
	if (e.shiftKey) keys.add('Shift')

	if (!['Meta', 'Control', 'Alt', 'Shift'].includes(e.key)) {
		const key = e.key.length === 1 ? e.key.toUpperCase() : e.key
		keys.add(key)
	}

	displayKeys.value = Array.from(keys)

	if (displayKeys.value.length >= 2 && displayKeys.value.length <= 3) {
		const hasModifier = displayKeys.value.some((k) =>
			['Command', 'Control', 'Alt', 'Shift'].includes(k),
		)
		const hasNormal = displayKeys.value.some(
			(k) => !['Command', 'Control', 'Alt', 'Shift'].includes(k),
		)

		if (hasModifier && hasNormal) {
			settings.shortcuts.toggleWindow = displayKeys.value.join('+')
			stopRecording()
		}
	}
}

function handleKeyUp(e: KeyboardEvent) {
	if (!recording.value) return
	e.preventDefault()
}

function clearShortcut() {
	settings.shortcuts.toggleWindow = null
}

onUnmounted(() => {
	stopRecording()
})
</script>

<template>
	<div class="flex items-center gap-2">
		<UButton :color="recording ? 'primary' : 'neutral'" variant="outline" @click="startRecording">
			<template v-if="recording">
				<span class="animate-pulse text-sm text-primary">
					{{ $t('settings.shortcuts.pressKeys') }}
				</span>
			</template>
			<template v-else-if="hasShortcut">
				<UKbd
					v-for="key in formatShortcut(settings.shortcuts.toggleWindow)"
					:key="key"
					:value="key"
				/>
			</template>
			<template v-else>
				<span class="text-sm text-muted">{{ $t('settings.shortcuts.notSet') }}</span>
			</template>
		</UButton>

		<UButton
			v-if="hasShortcut && !recording"
			icon="i-ph-backspace"
			color="neutral"
			variant="outline"
			@click.stop="clearShortcut"
		/>
		<UButton
			v-if="recording"
			icon="i-ph-stop-circle"
			color="neutral"
			variant="outline"
			@click.stop="stopRecording"
		/>
	</div>
</template>
