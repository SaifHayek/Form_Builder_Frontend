import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Link from 'next/link'
import '@/lib/i18n'
import { ThemeToggle } from "@/components/theme-toggle"
import { useIsCreateOrEditPage } from "@/hooks/useIsCreateOrEditPage"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isCreateOrEditPage = useIsCreateOrEditPage()

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <nav className="border-b">
            <div className={`container mx-auto flex justify-between items-center p-4 ${isCreateOrEditPage ? 'w-[calc(100%-16rem)] ml-64' : ''}`}>
              <Link href="/" className="text-lg font-bold">Form Builder</Link>
              <div className="flex items-center space-x-4">
                <Link href="/forms" className="hover:underline">View All Forms</Link>
                <ThemeToggle />
              </div>
            </div>
          </nav>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'