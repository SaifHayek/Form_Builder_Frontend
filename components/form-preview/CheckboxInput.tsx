import { Checkbox } from "@/components/ui/checkbox"
import { FormField as FormFieldType, Language } from "@/lib/types"
import { UseFormReturn } from "react-hook-form"
import { SharedFormField } from "./SharedFormField"

interface CheckboxInputProps {
  field: FormFieldType
  form: UseFormReturn<any>
  language: Language
  value: boolean
  onChange: (value: boolean) => void
  t: (key: string) => string
}

export function CheckboxInput({ field, form, language, value, onChange, t }: CheckboxInputProps) {
  return (
    <SharedFormField field={field} form={form} language={language} value={value} onChange={onChange} t={t}>
      {(formField) => (
        <div className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Checkbox 
            checked={formField.value ?? false}
            onCheckedChange={(checked) => {
              formField.onChange(checked)
              onChange(checked)
            }}
          />
          <span className={`ml-2 ${language === 'ar' ? 'mr-2 ml-0' : ''}`}>
            {language === 'en' ? field.labelen : field.labelar}
          </span>
        </div>
      )}
    </SharedFormField>
  )
}

