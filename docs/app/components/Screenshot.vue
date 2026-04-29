<script setup lang="ts">
import screenshot from '~/assets/screenshot.webp'
</script>

<template>
	<div class="dash-bar overflow-hidden border-y border-default select-none">
		<img :src="screenshot" class="aspect-5/4 w-full object-cover" />
	</div>
</template>
