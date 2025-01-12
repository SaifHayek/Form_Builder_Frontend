"use client"

import { useDrag } from 'react-dnd'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { InputType } from '@/lib/types'

const INPUT_TYPES: { type: InputType; label: string }[] = [
  { type: "text", label: "Text Input" },
  { type: "number", label: "Number Input" },
  { type: "email", label: "Email Input" },
  { type: "password", label: "Password Input" },
  { type: "checkbox", label: "Checkbox" },
  { type: "select", label: "Select" },
  { type: "textarea", label: "Text Area" },
  { type: "radio", label: "Radio Group" },
]

const DraggableItem = ({ type, label }: { type: InputType; label: string }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FORM_ELEMENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div ref={drag} className="mb-2">
      <Button
        variant="outline"
        className="w-full justify-start"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {label}
      </Button>
    </div>
  )
}

export function Sidebar() {
  return (
    <div className="fixed top-0 left-0 w-64 h-screen overflow-y-auto border-r bg-background">
      <ScrollArea className="h-full p-4">
        <div className="font-semibold mb-4">Form Elements</div>
        {INPUT_TYPES.map((input) => (
          <DraggableItem key={input.type} {...input} />
        ))}
      </ScrollArea>
    </div>
  )
}

