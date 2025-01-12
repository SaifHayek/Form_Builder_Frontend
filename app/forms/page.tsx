import { FormList } from '@/components/form-list'

export default function FormsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Forms</h1>
      <div className="bg-card shadow rounded-lg p-6">
        <FormList />
      </div>
    </div>
  )
}

