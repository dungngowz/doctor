import { HeadPage } from '@/components'
import { DriverLayout } from '@/layouts/driver'
import { DriverContainer } from '@/plugins/driver/components'
import { breadcrumbsState } from '@/store/common'
import { t } from 'i18next'
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

export default function DriverPage() {
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
      <HeadPage title={t('driver') ?? ''} />
      <DriverContainer />
    </>
  )
}

DriverPage.Layout = DriverLayout
