'use client'

import { EditForm } from '@/components/edit-form'

export default function EditFormPage({ params }: { params: { id: string } }) {
  const formId = parseInt(params.id, 10)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <EditForm formId={formId} />
    </div>
  )
}

