import { Input } from "@/components/ui/input"
import { FormField as FormFieldType, Language } from "@/lib/types"
import { UseFormReturn } from "react-hook-form"
import { SharedFormField } from "./SharedFormField"

interface TextInputProps {
  field: FormFieldType
  form: UseFormReturn<any>
  language: Language
  value: string
  onChange: (value: string) => void
  t: (key: string) => string
}

export function TextInput({ field, form, language, value, onChange, t }: TextInputProps) {
  return (
    <SharedFormField field={field} form={form} language={language} value={value} onChange={onChange} t={t}>
      {(formField) => (
        <Input 
          {...formField} 
          type={field.type}
          placeholder={field.placeholder?.[language]}
          className={language === 'ar' ? 'text-right' : 'text-left'}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          value={formField.value || ''}
          onChange={(e) => {
            formField.onChange(e.target.value)
            onChange(e.target.value)
          }}
        />
      )}
    </SharedFormField>
  )
}

