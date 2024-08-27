export const Layouts = [
  {
    label: 'Grid',
    value: 'Grid',
  },
  {
    label: 'Hex',
    value: 'Hex',
  },
] as const
export const LayoutValues = Layouts.map((x) => x.value)
export type Layout = (typeof LayoutValues)[number]

export const ItemShapes = [
  {
    label: 'Square',
    value: 'Square',
  },
  {
    label: 'Hex',
    value: 'Hex',
  },
] as const
export const ItemShapeValues = ItemShapes.map((x) => x.value)
export type ItemShape = (typeof ItemShapeValues)[number]

export const DisplayTypes = [
  {
    label: 'Image',
    value: 'Image',
  },
  {
    label: 'Text',
    value: 'Text',
  },
  {
    label: 'Both',
    value: 'Both',
  },
] as const
export const DisplayTypeValues = DisplayTypes.map((x) => x.value)
export type DisplayType = (typeof DisplayTypeValues)[number]

export const AnchorLocations = [
  {
    label: 'Top Left',
    value: 'TL',
  },
  {
    label: 'Top Center',
    value: 'TC',
  },
  {
    label: 'Top Right',
    value: 'TR',
  },
  {
    label: 'Center Left',
    value: 'CL',
  },
  {
    label: 'Center',
    value: 'CC',
  },
  {
    label: 'Center Right',
    value: 'CR',
  },
  {
    label: 'Bottom Left',
    value: 'BL',
  },
  {
    label: 'Bottom Center',
    value: 'BC',
  },
  {
    label: 'Bottom Right',
    value: 'BR',
  },
] as const
export const AnchorLocationValues = AnchorLocations.map((x) => x.value)
export type AnchorLocation = (typeof AnchorLocationValues)[number]
