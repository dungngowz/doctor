import { HeadPage, Loading } from '@/components'
import { ReportExportContainer } from '@/plugins/report-export/components'
import { breadcrumbsState, roleState } from '@/store/common'
import { t } from '@/utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export default function ReportExportPage() {
  // Hooks
  const role = useRecoilValue(roleState)
  const router = useRouter()

  // State
  const [firstLoading, setFirstLoading] = useState(true)

  // Handle set breadcrumb on header
  useEffect(() => {
    setRecoil(breadcrumbsState, [
      { name: t('dashboard'), to: '/' },
      { name: t('reportExportBreadcrumbsTitle'), to: '' },
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
      <HeadPage title={t('reportExportHeadTitle') ?? ''} />
      {!firstLoading ? <ReportExportContainer /> : <Loading open={true} />}
    </>
  )
}
