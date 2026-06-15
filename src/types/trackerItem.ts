import { z } from 'zod'

export const TrackerItemSchema = z.object({
  id: z.number().int(),
  displayName: z.string(),
  keywords: z.array(z.string()).optional(),
  img: z.string().optional(),
  overlayText: z.string().optional(),
  tooltip: z.string().optional(),
})

export type TrackerItem = z.infer<typeof TrackerItemSchema>
