import { HeadPage } from '@/components'
import { MainLayout } from '@/layouts'
import { DashboardContainer } from '@/plugins/dashboard/components'
import { breadcrumbsState } from '@/store/common'
import { t } from 'i18next'
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

export default function DashboardPage() {
  // Hooks
  const setBreadcrumbs = useSetRecoilState(breadcrumbsState)

  // Handle set breadcrumb on header
  useEffect(() => {
    setBreadcrumbs([{ name: t('dashboard'), to: '/' }])

    // Clear up function
    return () => {
      setBreadcrumbs([])
    }
  }, [])

  return (
    <>
      <HeadPage title={t('dashboard') ?? ''} />
      <DashboardContainer />
    </>
  )
}

DashboardPage.Layout = MainLayout
