import { z } from "zod"
import { FormField, InputType } from "./types"

const fieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['text', 'number', 'email', 'password', 'checkbox', 'select', 'textarea', 'radio'] as const),
  order: z.number(),
  labelen: z.string().min(1, "Field Label in English is required"),
  labelar: z.string().min(1, "Field Label in Arabic is required"),
  choices: z.array(z.object({
    id: z.string(),
    label: z.string(),
    value: z.string()
  })).optional(),
  validation: z.object({
    required: z.boolean(),
    hide: z.boolean(),
    minLength: z.string().optional(),
    maxLength: z.string().optional(),
    min: z.string().optional(),
    max: z.string().optional(),
    pattern: z.string().optional()
  })
})

export const formConfigSchema = z.object({
  title: z.object({
    en: z.string().min(1, "Form English title is required"),
    ar: z.string().min(1, "Form Arabic title is required")
  }),
  fields: z.array(fieldSchema).min(1, "At least one form field is required")
})

export type FormConfigSchema = z.infer<typeof formConfigSchema>

