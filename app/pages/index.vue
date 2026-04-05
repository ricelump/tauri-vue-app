<script setup lang="ts">
const { currentBucket, hasBuckets } = useBuckets()
</script>

<template>
	<PageWelcome v-if="!hasBuckets" />
	<div v-else>
		<BucketFileView :bucket="currentBucket" />
	</div>
</template>
