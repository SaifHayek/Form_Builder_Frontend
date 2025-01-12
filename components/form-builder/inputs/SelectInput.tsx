import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from 'lucide-react'
import { FormField, Choice } from "@/lib/types"
import { useState, KeyboardEvent, useRef, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'

interface SelectInputProps {
  field: FormField
  updateField: (id: string, updates: Partial<FormField>) => void
  language: 'en' | 'ar'
}

export function SelectInput({ field, updateField, language }: SelectInputProps) {
  const [newOption, setNewOption] = useState("")
  const [error, setError] = useState<string | null>(null);
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

  const addOption = () => {
    if (newOption.trim() === "") return;

    const newValue = newOption.toLowerCase().replace(/\s+/g, '_');
    const isDuplicate = field.choices?.some(choice => choice.value === newValue);

    if (isDuplicate) {
      setError("An option with this value already exists. Please use a different value.");
      return;
    }

    const newChoice: Choice = {
      id: uuidv4(),
      label: newOption,
      value: newValue
    };

    updateField(field.id, {
      choices: [...(field.choices || []), newChoice]
    });

    setNewOption("");
    setError(null);
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addOption()
    }
  }

  const removeOption = (choiceId: string) => {
    updateField(field.id, {
      choices: field.choices?.filter(choice => choice.id !== choiceId)
    })
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
        <Label>Options ({language === 'en' ? 'English' : 'Arabic'})</Label>
        <div className="flex gap-2">
          <Input
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'en' ? "Add new option" : "إضافة خيار جديد"}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          <Button
            type="button"
            onClick={addOption}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {field.choices?.map((choice) => (
            <div
              key={`${field.id}-${choice.id}`}
              className="flex items-center gap-2"
            >
              <Input
                value={choice.label}
                onChange={(e) => {
                  const updatedChoices = field.choices?.map(c =>
                    c.id === choice.id ? { ...c, label: e.target.value } : c
                  )
                  updateField(field.id, { choices: updatedChoices })
                }}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeOption(choice.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </div>
    </>
  )
}

