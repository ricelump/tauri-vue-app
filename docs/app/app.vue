<script setup lang="ts">
const appConfig = useAppConfig()

useSeoMeta({
	title: appConfig.app.title,
	titleTemplate: `%s | ${appConfig.app.name}`,
	description: appConfig.app.description,
	ogTitle: appConfig.app.title,
	ogDescription: appConfig.app.description,
	ogType: 'website',
	ogSiteName: appConfig.app.name,
	twitterCard: 'summary_large_image',
	twitterTitle: appConfig.app.title,
	twitterDescription: appConfig.app.description,
})
</script>

<template>
	<UApp>
		<div class="min-h-screen bg-muted select-text selection:bg-primary/10 dark:bg-muted/20">
			<div class="relative mx-auto w-full max-w-xl border-x border-default bg-default">
				<Header />
				<NuxtPage />
				<Footer />
			</div>
		</div>
	</UApp>
</template>
