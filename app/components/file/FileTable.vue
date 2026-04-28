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
				'aria-label': $t('file.selection.all'),
			}),
		cell: ({ row }) =>
			h(UCheckbox, {
				modelValue: row.getIsSelected(),
				'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
				'aria-label': $t('file.selection.row'),
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
		header: $t('file.name'),
	},
	{
		id: 'size',
		accessorKey: 'size',
		header: $t('file.size'),
	},
	{
		id: 'lastModified',
		accessorKey: 'lastModified',
		header: $t('file.lastModified'),
	},
	{
		id: 'actions',
		meta: {
			class: {
				td: 'text-right',
			},
		},
	},
]

function getContextMenuItems(row: TableRow<BucketFile>): DropdownMenuItem[][] {
	const file = row.original

	const result: DropdownMenuItem[][] = []

	const group: DropdownMenuItem[] = []

	// TODO: File preview
	if (file.isDirectory) {
		group.push({
			label: file.isDirectory ? $t('file.open') : $t('file.preview'),
			icon: file.isDirectory ? 'i-ph-folder-open' : 'i-ph-eye',
			onSelect: () => emit('select', file),
		})
	}

	if (!file.isDirectory) {
		group.push(
			{
				label: $t('file.copyUrl.label'),
				icon: 'i-ph-link-simple',
				onSelect: () => emit('copy-url', file),
			},
			{
				label: $t('file.download.label'),
				icon: 'i-ph-download-simple',
				onSelect: () => emit('download', file),
			},
		)
	}

	if (group.length > 0) result.push(group)

	if (!file.isDirectory) {
		result.push([
			{
				label: $t('file.rename.label'),
				icon: 'i-ph-pencil-simple',
				onSelect: () => emit('rename', file),
			},
			{
				label: $t('file.delete.label'),
				icon: 'i-ph-trash',
				color: 'error',
				onSelect: () => emit('delete', file),
			},
		])
	}

	return result
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
			:ui="{ th: 'py-2 pr-1.5', td: 'py-2 pr-1.5', separator: 'bg-border' }"
			@select="onSelect"
			@contextmenu="onContextmenu"
		>
			<template #name-cell="{ row }">
				<div class="flex items-center gap-2 select-text">
					<UIcon :name="getFileIcon(row.original)" class="size-5" />
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
				<UDropdownMenu :items="getContextMenuItems(row)">
					<UButton icon="i-ph-dots-three-vertical-bold" color="neutral" variant="ghost" size="sm" />
				</UDropdownMenu>
			</template>
		</UTable>
	</UContextMenu>
</template>
