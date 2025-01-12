"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { FormConfig, Language, FormField as FormFieldType, FormValues } from "@/lib/types"
import { useState, useEffect, useCallback } from "react"
import { TextInput } from "./form-preview/TextInput"
import { NumberInput } from "./form-preview/NumberInput"
import { TextareaInput } from "./form-preview/TextareaInput"
import { CheckboxInput } from "./form-preview/CheckboxInput"
import { SelectInput } from "./form-preview/SelectInput"
import { RadioInput } from "./form-preview/RadioInput"
import { generateSchema } from "@/lib/validation"
import { LANGUAGES } from "@/lib/constants"
import { useTranslation } from 'react-i18next'
import i18n from '@/lib/i18n'

interface FormPreviewTabProps {
  formConfig: FormConfig
}

export function FormPreviewTab({ formConfig }: FormPreviewTabProps) {
  const { toast } = useToast()
  const { t } = useTranslation()
  const [language, setLanguage] = useState<Language>('en')
  const [formValues, setFormValues] = useState<FormValues>({})

  const form = useForm<FormValues>({
    resolver: zodResolver(generateSchema(formConfig.fields)),
    defaultValues: getDefaultValues(),
  })

  useEffect(() => {
    form.reset(getDefaultValues())
  }, [formConfig, language])

  function getDefaultValues() {
    return formConfig?.fields?.reduce((acc, field) => {
      if (!field || field.validation.hide) return acc
      if (field.type === 'checkbox') {
        acc[field.id] = formValues[field.id] ?? false
      } else if (field.type === 'select' || field.type === 'radio') {
        acc[field.id] = formValues[field.id] ?? '_empty'
      } else {
        acc[field.id] = formValues[field.id] || ""
      }
      return acc
    }, {} as FormValues) || {}
  }

  const onSubmit = (data: FormValues) => {
    const combinedData = { ...formValues, ...data }
    const cleanedData = Object.fromEntries(
      Object.entries(combinedData).map(([key, value]) => [key, value === '_empty' ? '' : value])
    )
    toast({
      title: "Form Submitted",
    })
  }

  const toggleLanguage = useCallback(() => {
    const currentValues = form.getValues()
    setFormValues(prev => ({ ...prev, ...currentValues }))
    const newLang = language === 'en' ? 'ar' : 'en'
    setLanguage(newLang)
    i18n.changeLanguage(newLang)
  }, [language, form])

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }))
  }, [])

  const renderField = useCallback((field: FormFieldType) => {
    if (!field || field.validation.hide) return null

    const InputComponent = {
      text: TextInput,
      email: TextInput,
      password: TextInput,
      number: NumberInput,
      textarea: TextareaInput,
      checkbox: CheckboxInput,
      select: SelectInput,
      radio: RadioInput,
    }[field.type] || TextInput

    return (
      <InputComponent
        key={field.id}
        field={field}
        form={form}
        language={language}
        value={formValues[field.id] ?? (field.type === 'checkbox' ? false : field.type === 'select' || field.type === 'radio' ? '_empty' : "")}
        onChange={(value: any) => handleFieldChange(field.id, value)}
        t={t}
      />
    )
  }, [form, language, formValues, handleFieldChange, t])

  return (
    <div className={`${language === 'ar' ? 'rtl' : 'ltr'} transition-all duration-300`}>
      <Button onClick={toggleLanguage} className="mb-4">
        {language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      </Button>
      <h2 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        {formConfig?.title?.[language] || ''}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {formConfig?.fields?.map(renderField)}
          <Button type="submit" className={language === 'ar' ? 'float-left' : 'float-right'}>
            {t('Submit')}
          </Button>
        </form>
      </Form>
    </div>
  )
}

