import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormConfig } from "@/lib/types"
import { useRef, useEffect } from "react"

interface TitleInputProps {
  formConfig: FormConfig
  updateTitle: (lang: 'en' | 'ar', value: string) => void
  titleErrors: { en?: string; ar?: string }
}

export function TitleInput({ formConfig, updateTitle, titleErrors }: TitleInputProps) {
  const arTitleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (arTitleInputRef.current) {
      const input = arTitleInputRef.current
      input.setSelectionRange(input.value.length, input.value.length)
    }
  }, [formConfig.title.ar])

  return (
    <Card className="p-4">
      <Tabs defaultValue="en">
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">Arabic</TabsTrigger>
        </TabsList>
        <TabsContent value="en">
          <div className="space-y-2">
            <Label htmlFor="title-en">Form Title (English)</Label>
            <Input
              id="title-en"
              value={formConfig.title.en}
              onChange={(e) => updateTitle('en', e.target.value)}
              placeholder="Enter form title in English"
            />
            {titleErrors.en && (
              <p className="text-sm text-red-500 mt-1">{titleErrors.en}</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="ar">
          <div className="space-y-2">
            <Label htmlFor="title-ar">Form Title (Arabic)</Label>
            <Input
              id="title-ar"
              ref={arTitleInputRef}
              value={formConfig.title.ar}
              onChange={(e) => updateTitle('ar', e.target.value)}
              placeholder="أدخل عنوان النموذج بالعربية"
              className="text-right"
              dir="rtl"
            />
            {titleErrors.ar && (
              <p className="text-sm text-red-500 mt-1">{titleErrors.ar}</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

