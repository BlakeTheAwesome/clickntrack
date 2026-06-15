import { z } from 'zod'

export const ClickCountEntrySchema = z.object({
  id: z.number().int(),
  color: z.string(),
  countsTowardsTotal: z.boolean(),
})

export type ClickCountEntry = z.infer<typeof ClickCountEntrySchema>
