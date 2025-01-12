import { Textarea } from "@/components/ui/textarea"
import { FormField as FormFieldType, Language } from "@/lib/types"
import { UseFormReturn } from "react-hook-form"
import { SharedFormField } from "./SharedFormField"

interface TextareaInputProps {
  field: FormFieldType
  form: UseFormReturn<any>
  language: Language
  value: string
  onChange: (value: string) => void
}

export function TextareaInput({ field, form, language, value, onChange }: TextareaInputProps) {
  return (
    <SharedFormField field={field} form={form} language={language} value={value} onChange={onChange}>
      {(formField) => (
        <Textarea 
          {...formField} 
          placeholder={field.placeholder?.[language]}
          className={language === 'ar' ? 'text-right' : 'text-left'}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          value={formField.value}
          onChange={(e) => formField.onChange(e.target.value)}
        />
      )}
    </SharedFormField>
  )
}

