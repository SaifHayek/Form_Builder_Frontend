"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FormBuilderTab } from "@/components/form-builder-tab"
import { FormPreviewTab } from "@/components/form-preview-tab"
import { FormConfig, InputType, FormField } from "@/lib/types"
import { useDrop } from 'react-dnd'

interface FormContentProps {
  formConfig: FormConfig
  setFormConfig: React.Dispatch<React.SetStateAction<FormConfig>>
  updateField: (id: string, updates: Partial<FormField>) => void
  updateTitle: (lang: 'en' | 'ar', value: string) => void
  titleErrors: { en?: string; ar?: string }
  handleSave: () => void
  addNewField: (type: InputType) => void
  isSaving: boolean;
}

export function FormContent({
  formConfig,
  setFormConfig,
  updateField,
  updateTitle,
  titleErrors,
  handleSave,
  addNewField,
  isSaving
}: FormContentProps) {
  const [, drop] = useDrop(() => ({
    accept: 'FORM_ELEMENT',
    drop: (item: { type: InputType }) => {
      addNewField(item.type)
    },
  }))

  return (
    <Tabs defaultValue="builder" className="flex-1 flex flex-col">
      <TabsList className="border-b px-4">
        <TabsTrigger value="builder">Form Builder</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <div ref={drop} className="flex-1 overflow-auto">
        <div className="w-full max-w-3xl mx-auto p-4">
          <TabsContent value="builder" className="mt-0 h-full w-full">
            <FormBuilderTab
              formConfig={formConfig}
              setFormConfig={setFormConfig}
              updateField={updateField}
              updateTitle={updateTitle}
              titleErrors={titleErrors}
            />
            <Button 
              onClick={handleSave} 
              className="mt-4"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </TabsContent>
          <TabsContent value="preview" className="mt-0 h-full w-full">
            <FormPreviewTab formConfig={formConfig} />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}

