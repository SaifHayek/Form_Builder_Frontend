import { useState, useEffect } from "react"
import { FormConfig, FormField, InputType } from "@/lib/types"
import { v4 as uuidv4 } from 'uuid'

export const useFormConfig = (initialConfig?: FormConfig) => {
  const [formConfig, setFormConfig] = useState<FormConfig>(initialConfig || {
    title: { en: "", ar: "" },
    fields: []
  })

  useEffect(() => {
    if (initialConfig) {
      setFormConfig(initialConfig)
    }
  }, [initialConfig])

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormConfig(prevConfig => ({
      ...prevConfig,
      fields: prevConfig.fields.map(field =>
        field.id === id ? { ...field, ...updates, validation: { ...field.validation, ...updates.validation } } : field
      )
    }))
  }

  const updateTitle = (lang: 'en' | 'ar', value: string) => {
    setFormConfig(prev => ({
      ...prev,
      title: {
        ...prev.title,
        [lang]: value
      }
    }))
  }

  const addNewField = (type: InputType) => {
    const newField: FormField = {
      id: uuidv4(),
      name: `New ${type} field`,
      type: type,
      order: formConfig.fields.length + 1,
      labelen: `New ${type} field`,
      labelar: getArabicLabel(type),
      validation: {
        required: true,
        hide: false
      },
    }
    setFormConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField].map((field, index) => ({
        ...field,
        order: index + 1
      }))
    }))
  }

  return { formConfig, setFormConfig, updateField, updateTitle, addNewField }
}

function getArabicLabel(type: InputType): string {
  switch (type) {
    case 'text': return 'حقل نص جديد';
    case 'number': return 'حقل رقم جديد';
    case 'email': return 'حقل بريد إلكتروني جديد';
    case 'password': return 'حقل كلمة مرور جديد';
    case 'checkbox': return 'حقل اختيار جديد';
    case 'select': return 'حقل قائمة منسدلة جديد';
    case 'textarea': return 'حقل نص طويل جديد';
    case 'radio': return 'حقل اختيار فردي جديد';
    default: return `حقل جديد`;
  }
}

