export default defineAppConfig({
	app: {
		name: 'Prebucket',
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
