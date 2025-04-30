'use client'
import { SignIn } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { use } from 'react'


export default function Page() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url') || '/'
  const pathname = usePathname()
  return <SignIn forceRedirectUrl={redirectUrl} />
}