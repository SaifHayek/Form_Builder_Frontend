'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import api from '@/lib/api'
import { Loader2 } from 'lucide-react'

interface Form {
  id: number
  title_en: string
  title_ar: string
}

export function FormList() {
  const [forms, setForms] = useState<Form[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingFormId, setDeletingFormId] = useState<number | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await api.get('/forms/?offset=0&limit=100')
      setForms(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching forms:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch forms. Please try again.',
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  const handleCreateForm = () => {
    router.push('/')
  }

  const handleEditForm = (id: number) => {
    router.push(`/forms/edit/${id}`)
  }

  const handleDeleteForm = async (id: number) => {
    setDeletingFormId(id)
    try {
      await api.delete(`/forms/${id}`)
      toast({
        title: 'Success',
        description: 'Form deleted successfully.',
        variant: 'success',
      })
      fetchForms()
    } catch (error) {
      console.error('Error deleting form:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete form. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setDeletingFormId(null)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Button onClick={handleCreateForm} className="mb-4">
        Create New Form
      </Button>
      <ul className="space-y-4">
        {forms.map((form) => (
          <li key={form.id} className="flex items-center justify-between bg-card p-4 rounded-lg shadow">
            <span className="text-lg font-medium">{form.title_en} / {form.title_ar}</span>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => handleEditForm(form.id)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteForm(form.id)}
                disabled={deletingFormId === form.id}
              >
                {deletingFormId === form.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

