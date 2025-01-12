import { z } from "zod"

export type InputType = 
  | "text"
  | "number"
  | "email"
  | "password"
  | "checkbox"
  | "select"
  | "textarea"
  | "radio"

export type ValidationRule = {
  required: boolean
  hide: boolean
  minLength?: string
  maxLength?: string
  min?: string
  max?: string
  pattern?: string
}

export interface Choice {
  label: string
  value: string
  id: string
}

export interface FormField {
  id: string
  name: string
  type: InputType
  order: number
  labelen: string
  labelar: string
  choices?: Choice[]
  validation: ValidationRule
  placeholder?: {
    en: string
    ar: string
  }
}

export interface FormConfig {
  title: {
    en: string
    ar: string
  }
  fields: FormField[]
}

export type Language = 'en' | 'ar'

export interface SavedFormConfig {
  title_en: string
  title_ar: string
  fields: {
    id: string
    name: string
    type: InputType
    order: number
    label_en: string
    label_ar: string
    placeholder_en?: string
    placeholder_ar?: string
    choices?: Choice[]
    validation: {
      required: boolean
      hide: boolean
      min_length?: number
      max_length?: number
      min_value?: number
      max_value?: number
      pattern?: string
    }
  }[]
}

export type FormValues = Record<string, any>

