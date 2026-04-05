<script setup lang="ts">
const { currentBucket, hasBuckets } = useBuckets()
</script>

<template>
	<PageWelcome v-if="!hasBuckets" />
	<div v-else>
		<BucketFileList :bucket="currentBucket" @file-click="console.log" />
	</div>
</template>
