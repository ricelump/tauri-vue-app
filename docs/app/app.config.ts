export default defineAppConfig({
	app: {
		name: 'Prebucket',
		title: 'Prebucket: Modern S3 Bucket Management',
		description:
			'Manage multiple S3-compatible buckets from a modern desktop app. Upload files, auto-preprocess images, and copy public URLs in one seamless flow.',
		github: 'https://github.com/ricelump/prebucket',
		mail: 'contact+prebucket@preblocks.com',
	},
	ui: {
		colors: {
			primary: 'teal',
			neutral: 'mist',
		},
		button: {
			slots: {
				base: 'cursor-pointer',
			},
		},
		accordion: {
			slots: {
				trigger: 'cursor-pointer',
				item: 'md:py-2',
			},
		},
		prose: {
			h2: {
				slots: {
					base: 'mt-6 mb-2 text-base/7 font-semibold',
				},
			},
			p: {
				base: 'my-1',
			},
			ul: {
				base: 'my-2',
			},
			li: {
				base: 'my-1 ps-0.5',
			},
		},
	},
})
