import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormField } from "@/lib/types"
import { useEffect, useRef } from "react"

interface CheckboxInputProps {
  field: FormField
  updateField: (id: string, updates: Partial<FormField>) => void
  language: 'en' | 'ar'
}

export function CheckboxInput({ field, updateField, language }: CheckboxInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (language === 'ar' && inputRef.current) {
      const input = inputRef.current
      input.setSelectionRange(input.value.length, input.value.length)
    }
  }, [language, field.labelen, field.labelar])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    updateField(field.id, { [language === 'en' ? 'labelen' : 'labelar']: value })
    
    if (language === 'ar') {
      setTimeout(() => {
        e.target.setSelectionRange(value.length, value.length)
      }, 0)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`label-${language}-${field.id}`}>
        Field Label ({language === 'en' ? 'English' : 'Arabic'})
      </Label>
      <div className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <Input
          id={`label-${language}-${field.id}`}
          ref={inputRef}
          value={language === 'en' ? field.labelen : field.labelar}
          onChange={handleInputChange}
          className={language === 'ar' ? 'text-right' : 'text-left'}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>
    </div>
  )
}

