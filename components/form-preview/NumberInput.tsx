import { Input } from "@/components/ui/input"
import { FormField as FormFieldType, Language } from "@/lib/types"
import { UseFormReturn } from "react-hook-form"
import { SharedFormField } from "./SharedFormField"

interface NumberInputProps {
  field: FormFieldType
  form: UseFormReturn<any>
  language: Language
  value: string
  onChange: (value: string) => void
  t: (key: string) => string
}

export function NumberInput({ field, form, language, value, onChange, t }: NumberInputProps) {
  return (
    <SharedFormField field={field} form={form} language={language} value={value} onChange={onChange} t={t}>
      {(formField) => (
        <Input 
          {...formField} 
          type="number"
          placeholder={field.placeholder?.[language]}
          className={language === 'ar' ? 'text-right' : 'text-left'}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          value={formField.value ?? ''}
          onChange={(e) => {
            const newValue = e.target.value;
            formField.onChange(newValue === '' ? undefined : Number(newValue));
            onChange(newValue);
          }}
        />
      )}
    </SharedFormField>
  )
}

