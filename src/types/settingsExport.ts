import { z } from 'zod'
import {
  LayoutSchema,
  ItemShapeSchema,
  DisplayTypeSchema,
  AnchorLocationSchema,
  TotalDisplayTypeSchema,
} from '@/types/layoutTypes'
import { ClickCountEntrySchema } from '@/types/ClickCountEntry'
import { TrackerItemSchema } from '@/types/trackerItem'

// These schemas are the source of truth for BoardSection and ItemDisplaySection types.
// If a field is added to boardStore or itemDisplayStore, it must be added here too —
// buildExport will produce a TypeScript error otherwise.
export const BoardSectionSchema = z.object({
  bgColor: z.string(),
  layout: LayoutSchema,
  itemShape: ItemShapeSchema,
  gridRowLength: z.number().int().positive(),
  cellSize: z.number().int().positive(),
  keywordPrefix: z.string(),
  filterTextColor: z.string(),
  totalTextColor: z.string(),
  totalDisplayType: TotalDisplayTypeSchema,
})

export const ItemDisplaySectionSchema = z.object({
  displayType: DisplayTypeSchema,
  showTooltips: z.boolean(),
  imageMargin: z.number(),
  highlightCoversImage: z.boolean(),
  textLocation: AnchorLocationSchema,
  textMargin: z.number(),
  itemTextColor: z.string(),
  itemTextBackgroundColor: z.string(),
  itemTextBackgroundOpacityByte: z.number().int(),
  textSize: z.number().int().positive(),
  markText: z.string(),
  markLocation: AnchorLocationSchema,
  markSize: z.number(),
  markMargin: z.number(),
  markColor: z.string(),
  markShadowColor: z.string(),
})

export const ItemSelectionSectionSchema = z.object({
  numItems: z.number().int().positive(),
  seed: z.string(),
  shuffleItems: z.boolean(),
})

export const SettingsExportSchema = z.object({
  version: z.literal(1),
  name: z.string().optional(),
  board: BoardSectionSchema.optional(),
  itemDisplay: ItemDisplaySectionSchema.optional(),
  colors: z.array(ClickCountEntrySchema).optional(),
  itemSelection: ItemSelectionSectionSchema.optional(),
  itemSet: z.array(TrackerItemSchema).optional(),
})

export type BoardSection = z.infer<typeof BoardSectionSchema>
export type ItemDisplaySection = z.infer<typeof ItemDisplaySectionSchema>
export type ItemSelectionSection = z.infer<typeof ItemSelectionSectionSchema>
export type SettingsExport = z.infer<typeof SettingsExportSchema>

export type SectionKey = 'board' | 'itemDisplay' | 'colors' | 'itemSelection' | 'itemSet'

export const SECTION_ORDER: SectionKey[] = ['board', 'itemDisplay', 'colors', 'itemSelection', 'itemSet']

export const SECTION_LABELS: Record<SectionKey, string> = {
  board: 'Board Setup',
  itemDisplay: 'Item Display',
  colors: 'Colors',
  itemSelection: 'Item Selection',
  itemSet: 'Item Set',
}
