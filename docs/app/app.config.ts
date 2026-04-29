export default defineAppConfig({
	app: {
		name: 'Prebucket',
		title: 'Prebucket: Modern S3 Bucket Management',
		description:
			'Manage multiple S3-compatible buckets from a modern desktop app. Upload files, apply image presets, and copy public URLs in one seamless flow.',
		github: 'https://github.com/ricelump/prebucket',
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
	},
})
