import { usePathname } from 'next/navigation'

export const useIsCreateOrEditPage = (): boolean => {
  const pathname = usePathname()
  return pathname === '/' || pathname?.startsWith('/forms/edit/')
}

