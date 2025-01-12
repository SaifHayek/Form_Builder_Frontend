import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormField } from "@/lib/types"
import { useEffect, useRef } from "react"

interface NumberInputProps {
  field: FormField
  updateField: (id: string, updates: Partial<FormField>) => void
  language: 'en' | 'ar'
}

export function NumberInput({ field, updateField, language }: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (language === 'ar' && inputRef.current) {
      const input = inputRef.current
      input.setSelectionRange(input.value.length, input.value.length)
    }
  }, [language, field.labelen, field.labelar])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'labelen' | 'labelar') => {
    const value = e.target.value
    updateField(field.id, { [key]: value })
    
    if (language === 'ar') {
      setTimeout(() => {
        e.target.setSelectionRange(value.length, value.length)
      }, 0)
    }
  }

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`label-${language}-${field.id}`}>Field Label ({language === 'en' ? 'English' : 'Arabic'})</Label>
        <Input
          id={`label-${language}-${field.id}`}
          ref={inputRef}
          value={language === 'en' ? field.labelen : field.labelar}
          onChange={(e) => handleInputChange(e, language === 'en' ? 'labelen' : 'labelar')}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`placeholder-${language}-${field.id}`}>Placeholder ({language === 'en' ? 'English' : 'Arabic'})</Label>
        <Input
          id={`placeholder-${language}-${field.id}`}
          value={field.placeholder?.[language] || ""}
          onChange={(e) =>
            updateField(field.id, {
              placeholder: { ...field.placeholder, [language]: e.target.value },
            })
          }
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>
    </>
  )
}

