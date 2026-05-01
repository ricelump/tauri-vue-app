<template>
	<div class="dash-bar flex flex-col border-t pb-0 sm:pb-0">
		<section class="relative w-full overflow-hidden border-t bg-default">
			<div
				class="absolute inset-0 bg-[radial-gradient(circle,rgb(161_161_170/0.08)_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,black_10%,transparent_70%)] bg-size-[24px_24px]"
			/>
			<div
				class="absolute top-1/2 left-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[100px]"
			/>

			<div
				class="relative flex w-full flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-24"
			>
				<h2 class="font-serif text-3xl font-bold text-highlighted sm:text-4xl">
					Free and open source.
				</h2>
				<p class="mx-auto mt-4 max-w-lg text-sm text-muted">
					Download and use Prebucket for free. No trials, no limits, no tracking.
				</p>

				<Actions />
			</div>
		</section>
		<p
			class="flex max-h-5 items-center justify-center border-t text-center text-xs text-muted sm:max-h-6"
		>
			Made by the creator of
			<UButton to="https://preblocks.com" target="_blank" variant="link" color="neutral" size="xs">
				Preblocks
			</UButton>
		</p>
	</div>
</template>

<style scoped>
.cta-dots {
	background-image: radial-gradient(circle, rgb(161 161 170 / 0.08) 1px, transparent 1px);
	background-size: 24px 24px;
	mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 10%, transparent 70%);
}
</style>
