"use client"

import { useCallback } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { FormConfig, FormField as FormFieldType } from "@/lib/types"
import { FormField } from "./form-builder/FormField"
import { TitleInput } from "./form-builder/TitleInput"

interface FormBuilderTabProps {
  formConfig: FormConfig
  setFormConfig: (config: FormConfig) => void
  updateField: (id: string, updates: Partial<FormFieldType>) => void
  updateTitle: (lang: 'en' | 'ar', value: string) => void
  titleErrors: { en?: string; ar?: string }
}

export function FormBuilderTab({ formConfig, setFormConfig, updateField, updateTitle, titleErrors }: FormBuilderTabProps) {
  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(formConfig.fields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedFields = items.map((field, index) => ({
      ...field,
      order: index + 1
    }))

    setFormConfig({ ...formConfig, fields: updatedFields })
  }, [formConfig, setFormConfig])

  const removeField = useCallback((id: string) => {
    const updatedFields = formConfig.fields
      .filter(field => field.id !== id)
      .map((field, index) => ({ ...field, order: index + 1 }))

    setFormConfig({
      ...formConfig,
      fields: updatedFields,
    })
  }, [formConfig, setFormConfig])

  return (
    <div className="space-y-6">
      <TitleInput formConfig={formConfig} updateTitle={updateTitle} titleErrors={titleErrors} />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="form-fields">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {formConfig.fields
                .sort((a, b) => a.order - b.order)
                .map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <FormField
                          field={field}
                          updateField={updateField}
                          removeField={removeField}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

