import { FormConfig, FormField } from "@/lib/types"
import { formConfigSchema } from "@/lib/formConfigSchema"

export const useFormValidation = () => {
  const validateForm = (formConfig: FormConfig): string[] => {
    const formConfigResult = formConfigSchema.safeParse(formConfig)
    let validationErrors: string[] = []

    if (!formConfigResult.success) {
      formConfigResult.error.issues.forEach(issue => {
        if (issue.path[0] === 'title' && issue.path[1]) {
          validationErrors.push(`${issue.path[1] === 'en' ? 'English' : 'Arabic'} title: ${issue.message}`)
        } else if (issue.path[0] === 'fields') {
          if (issue.message === "At least one form field is required") {
            validationErrors.push(issue.message)
          } else {
            const fieldIndex = Number(issue.path[1])
            const fieldName = formConfig.fields[fieldIndex]?.labelen || `Field ${fieldIndex + 1}`
            if (issue.path.includes('labelen')) {
              validationErrors.push(`${fieldName}: English label is required`)
            } else if (issue.path.includes('labelar')) {
              validationErrors.push(`${fieldName}: Arabic label is required`)
            } else {
              validationErrors.push(`${fieldName}: ${issue.message}`)
            }
          }
        }
      })
    }

    validationErrors = [
      ...validationErrors,
      ...validateFieldConstraints(formConfig.fields),
      ...validateSelectAndRadioOptions(formConfig.fields)
    ]

    return validationErrors
  }

  return { validateForm }
}

function validateFieldConstraints(fields: FormField[]): string[] {
  return fields.flatMap((field, index) => {
    const errors: string[] = []
    if (field.type === 'number' && field.validation) {
      const min = field.validation.min !== undefined ? Number(field.validation.min) : undefined
      const max = field.validation.max !== undefined ? Number(field.validation.max) : undefined
      if (min !== undefined && max !== undefined && min > max) {
        errors.push(`Field ${index + 1} (${field.labelen}): Minimum value (${min}) is greater than maximum value (${max})`)
      }
    }
    if ((field.type === 'text' || field.type === 'password' || field.type === 'textarea') && field.validation) {
      const minLength = field.validation.minLength !== undefined ? Number(field.validation.minLength) : undefined
      const maxLength = field.validation.maxLength !== undefined ? Number(field.validation.maxLength) : undefined
      if (minLength !== undefined && Number(minLength) < 0) {
        errors.push(`Field "${field.labelen}": Minimum length cannot be negative`)
      }
      if (maxLength !== undefined && Number(maxLength) < 0) {
        errors.push(`Field "${field.labelen}": Maximum length cannot be negative`)
      }
      if (minLength !== undefined && maxLength !== undefined && minLength > maxLength) {
        errors.push(`Field ${index + 1} (${field.labelen}): Minimum length (${minLength}) is greater than maximum length (${maxLength})`)
      }
    }
    return errors
  })
}

function validateSelectAndRadioOptions(fields: FormField[]): string[] {
  return fields.flatMap((field, index) => {
    if ((field.type === 'select' || field.type === 'radio') && (!field.choices || field.choices.length === 0)) {
      return [`Field ${index + 1} (${field.labelen}): At least one option is required for ${field.type} inputs`]
    }
    return []
  })
}

