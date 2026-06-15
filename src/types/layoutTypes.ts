import { z } from 'zod'

export const LayoutSchema = z.enum(['Grid', 'Hex'])
export type Layout = z.infer<typeof LayoutSchema>
export const Layouts = [
  { label: 'Grid', value: 'Grid' },
  { label: 'Hex', value: 'Hex' },
] as const satisfies readonly { label: string; value: Layout }[]
export const LayoutValues = LayoutSchema.options

export const ItemShapeSchema = z.enum(['Square', 'Hex'])
export type ItemShape = z.infer<typeof ItemShapeSchema>
export const ItemShapes = [
  { label: 'Square', value: 'Square' },
  { label: 'Hex', value: 'Hex' },
] as const satisfies readonly { label: string; value: ItemShape }[]
export const ItemShapeValues = ItemShapeSchema.options

export const DisplayTypeSchema = z.enum(['Image', 'Text', 'Both'])
export type DisplayType = z.infer<typeof DisplayTypeSchema>
export const DisplayTypes = [
  { label: 'Image', value: 'Image' },
  { label: 'Text', value: 'Text' },
  { label: 'Both', value: 'Both' },
] as const satisfies readonly { label: string; value: DisplayType }[]
export const DisplayTypeValues = DisplayTypeSchema.options

export const AnchorLocationSchema = z.enum(['TL', 'TC', 'TR', 'CL', 'CC', 'CR', 'BL', 'BC', 'BR'])
export type AnchorLocation = z.infer<typeof AnchorLocationSchema>
export const AnchorLocations = [
  { label: 'Top Left', value: 'TL' },
  { label: 'Top Center', value: 'TC' },
  { label: 'Top Right', value: 'TR' },
  { label: 'Center Left', value: 'CL' },
  { label: 'Center', value: 'CC' },
  { label: 'Center Right', value: 'CR' },
  { label: 'Bottom Left', value: 'BL' },
  { label: 'Bottom Center', value: 'BC' },
  { label: 'Bottom Right', value: 'BR' },
] as const satisfies readonly { label: string; value: AnchorLocation }[]
export const AnchorLocationValues = AnchorLocationSchema.options

export const TotalDisplayTypeSchema = z.enum(['hidden', 'single-total', 'individual-counts', 'both'])
export type TotalDisplayType = z.infer<typeof TotalDisplayTypeSchema>
export const TotalDisplayTypes = [
  { label: 'Hidden', value: 'hidden' },
  { label: 'Single Total', value: 'single-total' },
  { label: 'Individual Counts', value: 'individual-counts' },
  { label: 'Both', value: 'both' },
] as const satisfies readonly { label: string; value: TotalDisplayType }[]
export const TotalDisplayTypeValues = TotalDisplayTypeSchema.options
