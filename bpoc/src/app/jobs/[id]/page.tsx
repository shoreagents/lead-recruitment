'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function JobShareRedirectPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  useEffect(() => {
    if (!params?.id) return
    // Redirect to the job matching page and open the selected job modal via query param
    router.replace(`/jobs/job-matching?jobId=${encodeURIComponent(params.id)}`)
  }, [params?.id, router])

  return null
}


