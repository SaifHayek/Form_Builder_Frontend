import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField as FormFieldType, Language } from "@/lib/types"
import { UseFormReturn } from "react-hook-form"
import { SharedFormField } from "./SharedFormField"

interface SelectInputProps {
  field: FormFieldType
  form: UseFormReturn<any>
  language: Language
  value: string
  onChange: (value: string) => void
  t: (key: string) => string
}

export function SelectInput({ field, form, language, value, onChange, t }: SelectInputProps) {
  return (
    <SharedFormField field={field} form={form} language={language} value={value} onChange={onChange} t={t}>
      {(formField) => (
        <Select 
          onValueChange={(value) => {
            formField.onChange(value)
            onChange(value)
          }}
          value={formField.value || undefined}
        >
          <SelectTrigger className={language === 'ar' ? 'text-right' : 'text-left'}>
            <SelectValue placeholder={field.placeholder?.[language] || t('Select an option')} />
          </SelectTrigger>
          <SelectContent>
            {!field.validation.required && (
              <SelectItem value="_empty">{t('None')}</SelectItem>
            )}
            {field.choices?.map((choice) => (
              <SelectItem key={`${field.id}-${choice.id}`} value={choice.value}>
                {choice.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </SharedFormField>
  )
}

