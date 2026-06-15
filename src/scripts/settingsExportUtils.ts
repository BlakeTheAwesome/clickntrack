import { z } from 'zod'
import {
  SettingsExportSchema,
  BoardSectionSchema,
  ItemDisplaySectionSchema,
  ItemSelectionSectionSchema,
  type SettingsExport,
  type SectionKey,
  type BoardSection,
  type ItemDisplaySection,
  type ItemSelectionSection,
} from '@/types/settingsExport'
import { ClickCountEntrySchema, type ClickCountEntry } from '@/types/ClickCountEntry'
import { TrackerItemSchema, type TrackerItem } from '@/types/trackerItem'
import { useBoardStore } from '@/stores/boardStore'
import { useItemDisplayStore } from '@/stores/itemDisplayStore'
import { useTrackerStore } from '@/stores/trackerStore'

function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : ''
      return `${path}${issue.message}`
    })
    .join('; ')
}

export function buildExport(sections: SectionKey[], name?: string): SettingsExport {
  const boardStore = useBoardStore()
  const itemDisplayStore = useItemDisplayStore()
  const trackerStore = useTrackerStore()

  const result: SettingsExport = { version: 1 }
  if (name) {
    result.name = name
  }

  if (sections.includes('board')) {
    result.board = {
      bgColor: boardStore.bgColor,
      layout: boardStore.layout,
      itemShape: boardStore.itemShape,
      gridRowLength: boardStore.gridRowLength,
      cellSize: boardStore.cellSize,
      keywordPrefix: boardStore.keywordPrefix,
      filterTextColor: boardStore.filterTextColor,
      totalTextColor: boardStore.totalTextColor,
      totalDisplayType: boardStore.totalDisplayType,
    }
  }

  if (sections.includes('itemDisplay')) {
    result.itemDisplay = {
      displayType: itemDisplayStore.displayType,
      showTooltips: itemDisplayStore.showTooltips,
      imageMargin: itemDisplayStore.imageMargin,
      highlightCoversImage: itemDisplayStore.highlightCoversImage,
      textLocation: itemDisplayStore.textLocation,
      textMargin: itemDisplayStore.textMargin,
      itemTextColor: itemDisplayStore.itemTextColor,
      itemTextBackgroundColor: itemDisplayStore.itemTextBackgroundColor,
      itemTextBackgroundOpacityByte: itemDisplayStore.itemTextBackgroundOpacityByte,
      textSize: itemDisplayStore.textSize,
      markText: itemDisplayStore.markText,
      markLocation: itemDisplayStore.markLocation,
      markSize: itemDisplayStore.markSize,
      markMargin: itemDisplayStore.markMargin,
      markColor: itemDisplayStore.markColor,
      markShadowColor: itemDisplayStore.markShadowColor,
    }
  }

  if (sections.includes('colors')) {
    result.colors = JSON.parse(JSON.stringify(trackerStore.colours)) as ClickCountEntry[]
  }

  if (sections.includes('itemSelection')) {
    result.itemSelection = {
      numItems: trackerStore.numItems,
      seed: trackerStore.seed,
      shuffleItems: trackerStore.shuffleItems,
    }
  }

  if (sections.includes('itemSet')) {
    result.itemSet = JSON.parse(JSON.stringify(trackerStore.allGridItems)) as TrackerItem[]
  }

  return result
}

export function applyImport(data: SettingsExport, sections: SectionKey[]): void {
  const boardStore = useBoardStore()
  const itemDisplayStore = useItemDisplayStore()
  const trackerStore = useTrackerStore()

  // Validate all sections first — nothing is applied if any fail
  let boardPatch: BoardSection | undefined
  let itemDisplayPatch: ItemDisplaySection | undefined
  let colorsPatch: ClickCountEntry[] | undefined
  let itemSelectionPatch: ItemSelectionSection | undefined
  let itemSetPatch: TrackerItem[] | undefined

  if (sections.includes('board') && data.board) {
    const result = BoardSectionSchema.safeParse(data.board)
    if (!result.success) {
      throw new Error(`Board: ${formatZodError(result.error)}`)
    }
    boardPatch = result.data
  }

  if (sections.includes('itemDisplay') && data.itemDisplay) {
    const result = ItemDisplaySectionSchema.safeParse(data.itemDisplay)
    if (!result.success) {
      throw new Error(`Item display: ${formatZodError(result.error)}`)
    }
    itemDisplayPatch = result.data
  }

  if (sections.includes('colors') && data.colors) {
    const result = z.array(ClickCountEntrySchema).safeParse(data.colors)
    if (!result.success) {
      throw new Error(`Colors: ${formatZodError(result.error)}`)
    }
    const colors = JSON.parse(JSON.stringify(result.data)) as ClickCountEntry[]
    // Ensure IDs are sequential around the zero row
    const zeroIndex = colors.findIndex((c) => c.id === 0)
    const anchorIndex = zeroIndex !== -1 ? zeroIndex : 0
    for (let i = 0; i < colors.length; i++) {
      colors[i].id = i - anchorIndex
    }
    colorsPatch = colors
  }

  if (sections.includes('itemSelection') && data.itemSelection) {
    const result = ItemSelectionSectionSchema.safeParse(data.itemSelection)
    if (!result.success) {
      throw new Error(`Item selection: ${formatZodError(result.error)}`)
    }
    itemSelectionPatch = result.data
  }

  if (sections.includes('itemSet') && data.itemSet) {
    const result = z.array(TrackerItemSchema).safeParse(data.itemSet)
    if (!result.success) {
      throw new Error(`Item set: ${formatZodError(result.error)}`)
    }
    itemSetPatch = [...result.data]
  }

  // All valid — apply everything
  if (boardPatch) {
    boardStore.$patch(boardPatch)
  }
  if (itemDisplayPatch) {
    itemDisplayStore.$patch(itemDisplayPatch)
  }
  if (colorsPatch) {
    trackerStore.$patch({ colours: colorsPatch })
  }
  if (itemSelectionPatch) {
    trackerStore.$patch(itemSelectionPatch)
  }
  if (itemSetPatch) {
    trackerStore.initTracker(itemSetPatch)
  }
}

export function validateColors(colors: ClickCountEntry[]): string[] {
  const warnings: string[] = []
  if (colors.length === 0) {
    warnings.push('No color entries found.')
    return warnings
  }
  const hasZero = colors.some((c) => c.id === 0)
  if (!hasZero) {
    warnings.push('No default (id: 0) row — the first row will be set as default on import.')
  }
  return warnings
}

export function getSectionSummary(data: SettingsExport, section: SectionKey): string {
  switch (section) {
    case 'board':
      return `${Object.keys(data.board ?? {}).length} settings`
    case 'itemDisplay':
      return `${Object.keys(data.itemDisplay ?? {}).length} settings`
    case 'colors':
      return `${data.colors?.length ?? 0} color entries`
    case 'itemSelection': {
      const s = data.itemSelection
      if (!s) {
        return ''
      }
      
      const parts = [`${s.numItems} items`]
      if (s.shuffleItems) parts.push('shuffled')
      if (s.seed) parts.push(`seed: "${s.seed}"`)
      return parts.join(', ')
    }
    case 'itemSet':
      return `${data.itemSet?.length ?? 0} items`
  }
}

export function downloadExport(data: SettingsExport, name: string): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const date = new Date().toISOString().slice(0, 10)
  const slug = name
    ? name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    : 'clickntrack-settings'
  const filename = `${slug}-${date}.json`

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function parseSettingsFile(content: string): SettingsExport {
  const parsed: unknown = JSON.parse(content)

  // Raw TrackerItem array (item editor export format)
  if (Array.isArray(parsed)) {
    return { version: 1, itemSet: parsed }
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Invalid file format')
  }

  const obj = parsed as Record<string, unknown>

  // New format
  if (obj.version === 1) {
    const result = SettingsExportSchema.safeParse(obj)
    if (!result.success) throw new Error(`Invalid settings file: ${formatZodError(result.error)}`)
    return result.data
  }

  // Legacy format: { tracker: { colours, numItems, ... } }
  if (obj.tracker && typeof obj.tracker === 'object') {
    const t = obj.tracker as Record<string, unknown>
    const result: SettingsExport = { version: 1 }

    if (t.colours) result.colors = t.colours as SettingsExport['colors']
    if (t.allGridItems) result.itemSet = t.allGridItems as SettingsExport['itemSet']

    if (t.numItems !== undefined || t.seed !== undefined || t.shuffleItems !== undefined) {
      result.itemSelection = {
        numItems: (t.numItems as number) ?? 151,
        seed: (t.seed as string) ?? '',
        shuffleItems: (t.shuffleItems as boolean) ?? true,
      }
    }

    // These fields moved to boardStore in the refactor
    if (t.filterTextColor || t.totalTextColor || t.totalDisplayType) {
      result.board = {
        filterTextColor: (t.filterTextColor as string) ?? '#666666',
        totalTextColor: (t.totalTextColor as string) ?? '#992222',
        totalDisplayType: (t.totalDisplayType as string) ?? 'single-total',
      } as SettingsExport['board']
    }

    return result
  }

  throw new Error('Unrecognised file format')
}
