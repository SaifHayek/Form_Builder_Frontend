import { z } from "zod"
import { FormField } from "./types"

export const generateValidation = (field: FormField, isConfigSave: boolean = false) => {
  let schema: z.ZodTypeAny = z.any()

  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "textarea":
      schema = z.string().optional()
      if (field.validation?.minLength && field.validation.minLength !== "") {
        const minLength = Number(field.validation.minLength)
        if (!isNaN(minLength) && minLength > 0) {
          schema = schema.refine(
            (val) => !val || val.length >= minLength,
            { message: `Minimum length is ${minLength} characters` }
          )
        }
      }
      if (field.validation?.maxLength && field.validation.maxLength !== "") {
        const maxLength = Number(field.validation.maxLength)
        if (!isNaN(maxLength) && maxLength > 0) {
          schema = schema.refine(
            (val) => !val || val.length <= maxLength,
            { message: `Maximum length is ${maxLength} characters` }
          )
        }
      }
      if (field.type === "email") {
        schema = schema.refine(
          (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
          { message: "Please enter a valid email address" }
        )
      }
      break
    case "number":
      schema = z.preprocess((val) => {
        if (typeof val === 'string' && val.trim() === '') return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      }, z.number().optional())
      if (field.validation?.min !== undefined && field.validation.min !== "") {
        const min = Number(field.validation.min)
        if (!isNaN(min)) {
          schema = schema.refine((val) => val === undefined || val >= min, {
            message: `Minimum value is ${min}`
          })
        }
      }
      if (field.validation?.max !== undefined && field.validation.max !== "") {
        const max = Number(field.validation.max)
        if (!isNaN(max)) {
          schema = schema.refine((val) => val === undefined || val <= max, {
            message: `Maximum value is ${max}`
          })
        }
      }
      break
    case "checkbox":
      schema = z.boolean().optional()
      break
    case "select":
    case "radio":
      if (field.choices && field.choices.length > 0) {
        const enumSchema = z.enum(field.choices.map(choice => choice.value) as [string, ...string[]])
        schema = z.union([z.literal('_empty'), enumSchema]).optional()
      } else {
        schema = z.string().optional()
      }
      break
  }

  if (!isConfigSave && field.validation?.required) {
    if (field.type === "checkbox") {
      schema = schema.refine((val) => val === true, {
        message: "This field is required",
      })
    } else if (field.type === "select" || field.type === "radio") {
      schema = schema.refine((val) => val !== undefined && val !== "_empty", {
        message: "Please select an option",
      })
    } else if (field.type === "number") {
      schema = schema.refine((val) => val !== undefined, {
        message: "This field is required",
      })
    } else {
      schema = schema.refine((val) => val !== undefined && val !== "", {
        message: "This field is required",
      })
    }
  }

  return schema
}

export const generateSchema = (fields: FormField[], isConfigSave: boolean = false) => {
  const schema: Record<string, z.ZodTypeAny> = {}

  fields?.forEach((field) => {
    if (!field || field.validation.hide) return
    schema[field.id] = generateValidation(field, isConfigSave)
  })

  return z.object(schema)
}

