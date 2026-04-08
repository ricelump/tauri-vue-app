<script setup lang="ts">
import type { BucketFile } from '~/types/file'
import type { ContextMenuItem, DropdownMenuItem, TableColumn, TableRow } from '@nuxt/ui'

const props = defineProps<{
	files: BucketFile[]
	loading: boolean
}>()

const emit = defineEmits<{
	select: [file: BucketFile]
	'row-click': [e: Event, row: TableRow<BucketFile>]
	delete: [file: BucketFile]
	rename: [file: BucketFile]
	download: [file: BucketFile]
	'copy-url': [file: BucketFile]
}>()

const UCheckbox = resolveComponent('UCheckbox')

const rowSelection = ref<Record<string, boolean>>({})
const menuItems = ref<ContextMenuItem[]>([])

const columns: TableColumn<BucketFile>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			h(UCheckbox, {
				modelValue: table.getIsSomePageRowsSelected()
					? 'indeterminate'
					: table.getIsAllPageRowsSelected(),
				'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
					table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all',
			}),
		cell: ({ row }) =>
			h(UCheckbox, {
				modelValue: row.getIsSelected(),
				'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
				'aria-label': 'Select row',
			}),
		enableSorting: false,
		enableHiding: false,
		meta: {
			class: {
				th: 'w-9.5',
				td: 'w-9.5',
			},
		},
	},
	{
		id: 'name',
		accessorKey: 'name',
		header: 'Name',
	},
	{
		id: 'size',
		accessorKey: 'size',
		header: 'Size',
	},
	{
		id: 'lastModified',
		accessorKey: 'lastModified',
		header: 'Modified',
	},
	{
		id: 'actions',
		meta: {
			class: {
				th: 'w-10',
				td: 'w-10 text-right',
			},
		},
	},
]

function getContextMenuItems(row: TableRow<BucketFile>): DropdownMenuItem[][] {
	const file = row.original

	return [
		[
			{
				label: file.isDirectory ? 'Open' : 'Preview',
				icon: file.isDirectory ? 'i-ph-folder-open' : 'i-ph-eye',
				onSelect: () => emit('select', file),
			},
			{
				label: 'Copy URL',
				icon: 'i-ph-link-simple',
				disabled: file.isDirectory,
				onSelect: () => emit('copy-url', file),
			},
			{
				label: 'Download',
				icon: 'i-ph-download-simple',
				disabled: file.isDirectory,
				onSelect: () => emit('download', file),
			},
		],
		[
			{
				label: 'Rename',
				icon: 'i-ph-pencil-simple',
				onSelect: () => emit('rename', file),
			},
			{
				label: 'Delete',
				icon: 'i-ph-trash',
				color: 'error',
				onSelect: () => emit('delete', file),
			},
		],
	]
}

function onContextmenu(_e: Event, row: TableRow<BucketFile>) {
	menuItems.value = getContextMenuItems(row)
}

function onSelect(e: Event, row: TableRow<BucketFile>) {
	emit('row-click', e, row)
}

defineExpose({
	rowSelection,
	clearSelection: () => {
		rowSelection.value = {}
	},
})
</script>

<template>
	<UContextMenu :items="menuItems">
		<UTable
			v-model:row-selection="rowSelection"
			:data="files"
			:columns="columns"
			:loading="loading"
			:ui="{ th: 'py-3', td: 'py-3', separator: 'bg-border' }"
			sticky
			@select="onSelect"
			@contextmenu="onContextmenu"
		>
			<template #name-cell="{ row }">
				<div class="flex items-center gap-2">
					<UIcon
						:name="row.original.isDirectory ? 'i-ph-folder-simple' : 'i-ph-file'"
						class="size-5"
					/>
					<span class="font-medium text-highlighted">{{ row.original.name }}</span>
				</div>
			</template>

			<template #size-cell="{ row }">
				<span v-if="row.original.size" class="text-sm text-muted">
					{{ formatSize(row.original.size) }}
				</span>
			</template>

			<template #lastModified-cell="{ row }">
				<span v-if="row.original.lastModified" class="text-sm text-muted">
					{{ formatDate(row.original.lastModified) }}
				</span>
			</template>

			<template #actions-cell="{ row }">
				<div class="text-right">
					<UDropdownMenu :items="getContextMenuItems(row)">
						<UButton
							icon="i-ph-dots-three-vertical-bold"
							color="neutral"
							variant="ghost"
							size="sm"
						/>
					</UDropdownMenu>
				</div>
			</template>
		</UTable>
	</UContextMenu>
</template>
