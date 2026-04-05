<script setup lang="ts">
import type { Bucket } from '~/types/bucket'
import type { BucketFile } from '~/types/file'
import type { ContextMenuItem, DropdownMenuItem, TableColumn, TableRow } from '@nuxt/ui'

const props = defineProps<{
	bucket: Bucket | null
}>()

const UCheckbox = resolveComponent('UCheckbox')

const {
	files,
	currentPath,
	breadcrumbs,
	loading,
	viewMode,
	navigateUp,
	navigateToBreadcrumb,
	enterDirectory,
	refresh,
} = useBucketFiles(toRef(props, 'bucket'))

const table = useTemplateRef('table')

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
				onSelect: () => (file.isDirectory ? enterDirectory(file) : emit('fileClick', file)),
			},
			{
				label: 'Download',
				icon: 'i-ph-download-simple',
				disabled: file.isDirectory,
			},
		],
		[
			{
				label: 'Rename',
				icon: 'i-ph-pencil-simple',
			},
		],
		[
			{
				label: 'Delete',
				icon: 'i-ph-trash',
				color: 'error',
			},
		],
	]
}

const bulkActions = computed<DropdownMenuItem[][]>(() => {
	return [
		[
			{
				label: 'Move All',
				icon: 'i-ph-arrows-out-cardinal',
			},
			{
				label: 'Delete All',
				icon: 'i-ph-trash',
				color: 'error',
			},
		],
		[
			{
				label: 'Clear Selection',
				icon: 'i-ph-selection-slash',
				onSelect: () => {
					rowSelection.value = {}
				},
			},
		],
	]
})

function onSelect(e: Event, row: TableRow<BucketFile>) {
	if ((e.target as HTMLElement).closest('[role="checkbox"]')) return

	if (row.original.isDirectory) enterDirectory(row.original)
	else emit('fileClick', row.original)
}

function onContextmenu(_e: Event, row: TableRow<BucketFile>) {
	menuItems.value = getContextMenuItems(row)
}

const emit = defineEmits<{
	fileClick: [file: BucketFile]
}>()
</script>

<template>
	<div class="flex flex-col border-y border-default">
		<div
			class="flex items-center justify-between gap-2 overflow-x-auto border-b border-default px-2 py-1.5"
		>
			<div class="flex items-center gap-3">
				<UButton
					icon="i-ph-arrow-left"
					color="neutral"
					variant="ghost"
					:disabled="!currentPath"
					@click="navigateUp"
				/>

				<UBreadcrumb
					:items="[
						{ icon: 'i-ph-house', to: undefined, click: () => navigateToBreadcrumb(-1) },
						...breadcrumbs.map((crumb, index) => ({
							label: crumb,
							to: undefined,
							click: () => navigateToBreadcrumb(index),
						})),
					]"
				/>
			</div>

			<div class="flex items-center gap-2">
				<UDropdownMenu
					v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length! > 0"
					:items="bulkActions"
				>
					<UButton
						:label="`${table?.tableApi?.getFilteredSelectedRowModel().rows.length} of ${table?.tableApi?.getFilteredRowModel().rows.length} selected`"
						color="primary"
						variant="soft"
						trailing-icon="i-ph-caret-down"
					/>
				</UDropdownMenu>
				<!-- <UButtonGroup>
					<UButton
						:color="viewMode === 'list' ? 'primary' : 'neutral'"
						icon="i-ph-list"
						@click="viewMode = 'list'"
					/>
					<UButton
						:color="viewMode === 'grid' ? 'primary' : 'neutral'"
						icon="i-ph-squares-four"
						@click="viewMode = 'grid'"
					/>
				</UButtonGroup> -->

				<UButton
					icon="i-ph-arrows-clockwise"
					color="neutral"
					variant="ghost"
					:loading="loading"
					@click="() => refresh()"
				/>
			</div>
		</div>

		<UContextMenu v-if="viewMode === 'list'" :items="menuItems">
			<UTable
				ref="table"
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
					<UDropdownMenu :items="getContextMenuItems(row)">
						<UButton
							icon="i-ph-dots-three-vertical-bold"
							color="neutral"
							variant="ghost"
							size="sm"
						/>
					</UDropdownMenu>
				</template>
			</UTable>
		</UContextMenu>

		<div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
			<div
				v-for="file in files"
				:key="file.key"
				class="group flex cursor-pointer flex-col items-center rounded-lg border border-dashed border-default p-4 transition-colors hover:border-primary"
				@click="file.isDirectory ? enterDirectory(file) : $emit('fileClick', file)"
			>
				<UIcon :name="file.isDirectory ? 'i-ph-folder' : 'i-ph-file'" class="mb-2 size-12" />
				<span class="w-full truncate text-center text-sm">{{ file.name }}</span>
				<span v-if="!file.isDirectory && file.size" class="text-xs text-muted">
					{{ formatSize(file.size) }}
				</span>
			</div>
		</div>
	</div>
</template>
