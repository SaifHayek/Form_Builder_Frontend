'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import api from '@/lib/api'
import { FormBuilder } from '@/components/form-builder'
import { FormConfig, SavedFormConfig } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { mapSavedConfigToFormConfig, mapFormConfigToSavedConfig } from '@/lib/formUtils'

interface EditFormProps {
  formId: number
}

export function EditForm({ formId }: EditFormProps) {
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchForm()
  }, [formId])

  const fetchForm = async () => {
    try {
      const response = await api.get(`/forms/${formId}`)
      const savedConfig: SavedFormConfig = response.data
      const config = mapSavedConfigToFormConfig(savedConfig)
      setFormConfig(config)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching form:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch form. Please try again.',
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  const handleSave = async (updatedConfig: FormConfig) => {
    setIsSaving(true)
    try {
      const savedConfig = mapFormConfigToSavedConfig(updatedConfig)
      await api.put(`/forms/${formId}`, savedConfig)
      toast({
        title: 'Success',
        description: 'Form updated successfully.',
      })
      router.push('/forms')
    } catch (error) {
      console.error('Error updating form:', error)
      if (error.response?.status === 400 && error.response?.data?.detail === "Form title must be unique.") {
        toast({
          title: 'Error',
          description: 'Form title must be unique. Please choose a different title.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update form. Please try again.',
          variant: 'destructive',
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-2">
        <h2 className="text-2xl font-bold w-[calc(100%-16rem)] ml-64 my-2">Edit Form</h2>
        {formConfig && (
          <FormBuilder
            initialConfig={formConfig}
            onSave={handleSave}
            isSaving={isSaving}
          />
        )}
      </div>
    </DndProvider>
  )
}

