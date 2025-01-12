"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Sidebar } from "@/components/sidebar"
import { FormField, FormConfig, SavedFormConfig, InputType } from "@/lib/types"
import { v4 as uuidv4 } from 'uuid'
import { FormContent } from "./form-builder/FormContent"
import { useFormConfig } from "@/hooks/useFormConfig"
import { useFormValidation } from "@/hooks/useFormValidation"
import { mapFormConfigToSavedConfig } from "@/lib/formUtils"
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

interface FormBuilderProps {
  initialConfig?: FormConfig
  onSave?: (config: FormConfig) => Promise<void>
  isSaving?: boolean
}

export function FormBuilder({ initialConfig, onSave, isSaving: externalIsSaving }: FormBuilderProps) {
  const { formConfig, setFormConfig, updateField, updateTitle, addNewField } = useFormConfig(initialConfig)
  const [titleErrors, setTitleErrors] = useState<{ en?: string; ar?: string }>({})
  const { toast } = useToast()
  const [internalIsSaving, setInternalIsSaving] = useState(false)
  const router = useRouter()
  const { validateForm } = useFormValidation()

  const isSaving = externalIsSaving !== undefined ? externalIsSaving : internalIsSaving

  useEffect(() => {
    if (initialConfig) {
      setFormConfig(initialConfig)
    }
  }, [initialConfig])


  const handleSave = async () => {
    setInternalIsSaving(true)
    const validationErrors = validateForm(formConfig)

    if (validationErrors.length > 0) {
      setInternalIsSaving(false)
      toast({
        title: "Validation Error",
        description: (
          <ul className="list-disc pl-4">
            {validationErrors.map((msg, index) => (
              <li key={`error-${index}`} className="text-white">{msg}</li>
            ))}
          </ul>
        ),
        variant: "destructive",
      })
      return
    }

    try {
      if (onSave) {
        await onSave(formConfig)
      } else {
        const savedConfig = mapFormConfigToSavedConfig(formConfig)
        const response = await api.post('/forms/', savedConfig)
        toast({
          title: "Success",
          description: "The form configuration has been successfully saved.",
        })
        router.push(`/forms/edit/${response.data.id}`)
      }
    } catch (error) {
      console.error('Error saving form configuration:', error)
      if (error.response?.status === 400 && error.response?.data?.detail === "Form title must be unique.") {
        toast({
          title: 'Error',
          description: 'Form title must be unique. Please choose a different title.',
          variant: 'destructive',
        })
      }else{      
        toast({
          title: "Error Saving Configuration",
          description: "There was an error saving the form configuration.",
          variant: "destructive",
        })
      }
    } finally {
      setInternalIsSaving(false)
    }
  }

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 w-[calc(100%-16rem)]">
        <FormContent
          formConfig={formConfig}
          setFormConfig={setFormConfig}
          updateField={updateField}
          updateTitle={updateTitle}
          titleErrors={titleErrors}
          handleSave={handleSave}
          addNewField={addNewField}
          isSaving={isSaving}
        />
      </div>
    </div>
  )
}

