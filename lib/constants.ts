import { InputType } from './types'

export const INPUT_TYPES: { type: InputType; label: string }[] = [
  { type: "text", label: "Text Input" },
  { type: "number", label: "Number Input" },
  { type: "email", label: "Email Input" },
  { type: "password", label: "Password Input" },
  { type: "checkbox", label: "Checkbox" },
  { type: "select", label: "Select" },
  { type: "textarea", label: "Text Area" },
  { type: "radio", label: "Radio Group" },
]

export const LANGUAGES = ['en', 'ar'] as const

