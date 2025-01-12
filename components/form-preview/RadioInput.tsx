import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FormField as FormFieldType, Language } from "@/lib/types"
import { UseFormReturn } from "react-hook-form"
import { SharedFormField } from "./SharedFormField"

interface RadioInputProps {
  field: FormFieldType
  form: UseFormReturn<any>
  language: Language
  value: string
  onChange: (value: string) => void
  t: (key: string) => string
}

export function RadioInput({ field, form, language, value, onChange, t }: RadioInputProps) {
  return (
    <SharedFormField field={field} form={form} language={language} value={value} onChange={onChange} t={t}>
      {(formField) => (
        <RadioGroup
          onValueChange={(value) => {
            formField.onChange(value)
            onChange(value)
          }}
          value={formField.value || ''}
          className={`space-y-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
        >
          <div className={`flex flex-col ${language === 'ar' ? 'items-end' : 'items-start'}`}>
            {field.choices?.map((choice) => (
              <div key={`${field.id}-${choice.id}`} className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <RadioGroupItem value={choice.value} id={`${field.id}-${choice.id}`} />
                <label 
                  htmlFor={`${field.id}-${choice.id}`} 
                  className={`text-sm font-normal ${language === 'ar' ? 'mr-2' : 'ml-2'}`}
                >
                  {choice.label}
                </label>
              </div>
            ))}
          </div>
        </RadioGroup>
      )}
    </SharedFormField>
  )
}

