import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FormField as FormFieldType, Language } from "@/lib/types"
import { UseFormReturn } from "react-hook-form"
import { ReactNode } from "react"

interface SharedFormFieldProps {
  field: FormFieldType
  form: UseFormReturn<any>
  language: Language
  value: any
  onChange: (value: any) => void
  children: (formField: any) => ReactNode
  t: (key: string) => string
}

export function SharedFormField({ field, form, language, value, onChange, children, t }: SharedFormFieldProps) {
  return (
    <FormField
      control={form.control}
      name={field.id}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className={language === 'ar' ? 'text-right block' : 'text-left block'}>
            {language === 'en' ? field.labelen : field.labelar}
          </FormLabel>
          <FormControl>
            {children({
              ...formField,
              value: value,
              onChange: (newValue: any) => {
                formField.onChange(newValue)
                onChange(newValue)
              },
            })}
          </FormControl>
          <FormMessage>
            {({ message }) => message ? t(message) : null}
          </FormMessage>
        </FormItem>
      )}
    />
  )
}

