import { FormConfig, SavedFormConfig, FormField } from "@/lib/types"
import { v4 as uuidv4 } from 'uuid'

export const mapFormConfigToSavedConfig = (formConfig: FormConfig): SavedFormConfig => {
  return {
    title_en: formConfig.title.en,
    title_ar: formConfig.title.ar,
    fields: formConfig.fields
      .sort((a, b) => a.order - b.order)
      .map(field => ({
        id: field.id,
        name: field.name,
        type: field.type,
        order: field.order,
        label_en: field.labelen,
        label_ar: field.labelar,
        placeholder_en: field.placeholder?.en,
        placeholder_ar: field.placeholder?.ar,
        choices: field.type === 'select' || field.type === 'radio'
          ? field.choices?.map(choice => ({
            ...choice,
            id: choice.id || uuidv4()
          }))
          : undefined,
        validation: {
          required: field.validation.required,
          hide: field.validation.hide || false,
          min_length: field.validation.minLength ? parseInt(field.validation.minLength) : undefined,
          max_length: field.validation.maxLength ? parseInt(field.validation.maxLength) : undefined,
          min_value: field.validation.min ? parseInt(field.validation.min) : undefined,
          max_value: field.validation.max ? parseInt(field.validation.max) : undefined,
          pattern: field.validation.pattern
        }
      }))
  }
}

export const mapSavedConfigToFormConfig = (savedConfig: SavedFormConfig): FormConfig => {
  return {
    title: {
      en: savedConfig.title_en,
      ar: savedConfig.title_ar,
    },
    fields: savedConfig.fields.map(field => ({
      id: field.id,
      name: field.name,
      type: field.type,
      order: field.order,
      labelen: field.label_en,
      labelar: field.label_ar,
      choices: field.choices,
      validation: {
        required: field.validation.required,
        hide: field.validation.hide,
        minLength: field.validation.min_length?.toString(),
        maxLength: field.validation.max_length?.toString(),
        min: field.validation.min_value?.toString(),
        max: field.validation.max_value?.toString(),
        pattern: field.validation.pattern,
      },
      placeholder: {
        en: field.placeholder_en || '',
        ar: field.placeholder_ar || '',
      },
    }))
  }
}

