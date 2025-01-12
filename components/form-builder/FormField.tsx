import { FormField as FormFieldType, Choice, Language } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Trash2, GripVertical } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TextInput } from "./inputs/TextInput"
import { NumberInput } from "./inputs/NumberInput"
import { SelectInput } from "./inputs/SelectInput"
import { CheckboxInput } from "./inputs/CheckboxInput"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormFieldProps {
  field: FormFieldType
  updateField: (id: string, updates: Partial<FormFieldType>) => void
  removeField: (id: string) => void
}

export function FormField({ field, updateField, removeField }: FormFieldProps) {
  const [minLength, setMinLength] = useState(field.validation?.minLength || "")
  const [maxLength, setMaxLength] = useState(field.validation?.maxLength || "")
  const [minValue, setMinValue] = useState(field.validation?.min || "")
  const [maxValue, setMaxValue] = useState(field.validation?.max || "")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    validateInputs()
  }, [minLength, maxLength, minValue, maxValue])

  const validateInputs = () => {
    if (field.type === "number") {
      if (minValue !== "" && maxValue !== "" && Number(minValue) > Number(maxValue)) {
        setError("Minimum value cannot be greater than maximum value")
        return
      }
    } else {
      if (minLength !== "" && Number(minLength) < 0) {
        setError("Minimum length cannot be negative")
        return
      }
      if (maxLength !== "" && Number(maxLength) < 0) {
        setError("Maximum length cannot be negative")
        return
      }
      if (minLength !== "" && maxLength !== "" && Number(minLength) > Number(maxLength)) {
        setError("Minimum length cannot be greater than maximum length")
        return
      }
    }
    setError(null)
  }

  const handleInputChange = (value: string, setter: React.Dispatch<React.SetStateAction<string>>, validationKey: string) => {
    setter(value)
    updateField(field.id, {
      validation: { ...field.validation, [validationKey]: value }
    })
  }

  const handleSwitchChange = (checked: boolean, type: 'required' | 'hide') => {
    updateField(field.id, { 
      validation: { 
        ...field.validation, 
        required: type === 'required' ? checked : false,
        hide: type === 'hide' ? checked : false
      }
    })
  }

  const renderValidationInputs = () => {
    const commonInputs = (
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id={`required-${field.id}`}
              checked={field.validation.required}
              onCheckedChange={(checked) => handleSwitchChange(checked, 'required')}
            />
            <Label htmlFor={`required-${field.id}`}>Required</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id={`hide-${field.id}`}
              checked={field.validation.hide}
              onCheckedChange={(checked) => handleSwitchChange(checked, 'hide')}
            />
            <Label htmlFor={`hide-${field.id}`}>Hide</Label>
          </div>
        </div>
      </div>
    )

    switch (field.type) {
      case "text":
      case "textarea":
      case "password":
        return (
          <div className="space-y-2">
            {commonInputs}
            <div>
              <Label htmlFor={`minLength-${field.id}`}>Min Length</Label>
              <Input
                id={`minLength-${field.id}`}
                type="number"
                value={minLength}
                onChange={(e) => handleInputChange(e.target.value, setMinLength, 'minLength')}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor={`maxLength-${field.id}`}>Max Length</Label>
              <Input
                id={`maxLength-${field.id}`}
                type="number"
                value={maxLength}
                onChange={(e) => handleInputChange(e.target.value, setMaxLength, 'maxLength')}
                min="0"
              />
            </div>
          </div>
        )
      case "number":
        return (
          <div className="space-y-2">
            {commonInputs}
            <div>
              <Label htmlFor={`min-${field.id}`}>Min Value</Label>
              <Input
                id={`min-${field.id}`}
                type="number"
                value={minValue}
                onChange={(e) => handleInputChange(e.target.value, setMinValue, 'min')}
              />
            </div>
            <div>
              <Label htmlFor={`max-${field.id}`}>Max Value</Label>
              <Input
                id={`max-${field.id}`}
                type="number"
                value={maxValue}
                onChange={(e) => handleInputChange(e.target.value, setMaxValue, 'max')}
              />
            </div>
          </div>
        )
      case "email":
        return commonInputs
      default:
        return commonInputs
    }
  }

  const renderInputComponent = (language: Language) => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "textarea":
        return <TextInput field={field} updateField={updateField} language={language} />
      case "number":
        return <NumberInput field={field} updateField={updateField} language={language} />
      case "select":
      case "radio":
        return <SelectInput field={field} updateField={updateField} language={language} />
      case "checkbox":
        return <CheckboxInput field={field} updateField={updateField} language={language} />
      default:
        return null
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="cursor-move">
          <GripVertical className="h-5 w-5 text-gray-500" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="text-lg font-semibold mb-2">
            {field.type.charAt(0).toUpperCase() + field.type.slice(1)} Input (Order: {field.order})
          </div>
          <Tabs defaultValue="en">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">Arabic</TabsTrigger>
            </TabsList>
            <TabsContent value="en">
              {renderInputComponent('en')}
            </TabsContent>
            <TabsContent value="ar">
              {renderInputComponent('ar')}
            </TabsContent>
          </Tabs>
          <div>
            <Label>Validation</Label>
            {renderValidationInputs()}
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeField(field.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}

