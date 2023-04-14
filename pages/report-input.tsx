import { HeadPage, Loading } from '@/components'
import { ReportInputContainer } from '@/plugins/report-input/components'
import { breadcrumbsState, roleState } from '@/store/common'
import { t } from '@/utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export default function ReportInputPage() {
  // Hooks
  const role = useRecoilValue(roleState)
  const router = useRouter()

  // State
  const [firstLoading, setFirstLoading] = useState(true)

  // Handle set breadcrumb on header
  useEffect(() => {
    setRecoil(breadcrumbsState, [
      { name: t('dashboard'), to: '/' },
      { name: t('reportInputBreadcrumbsTitle'), to: '' },
    ])

    // Clear up function
    return () => {
      setRecoil(breadcrumbsState, [])
    }
  }, [router])

  useEffect(() => {
    if (role == 'admin' || role == 'coordinate') {
      setFirstLoading(false)
    } else {
      setFirstLoading(false)
      router.push('/')
    }
  }, [role, router])

  return (
    <>
      <HeadPage title={t('reportInputHeadTitle') ?? ''} />
      {!firstLoading ? <ReportInputContainer /> : <Loading open={true} />}
    </>
  )
}
