import { HeadPage, Loading } from '@/components'
import { ProductDeliveryContainer } from '@/plugins/product-delivery/components'
import { breadcrumbsState, roleState } from '@/store/common'
import { t } from '@/utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export default function ProductDeliveriesPage() {
  // Hooks
  const role = useRecoilValue(roleState)
  const router = useRouter()

  // State
  const [firstLoading, setFirstLoading] = useState(true)

  // Handle set breadcrumb on header
  useEffect(() => {
    setRecoil(breadcrumbsState, [
      { name: t('dashboard'), to: '/' },
      { name: t('schedulesBreadcrumbsTitle'), to: '/schedules' },
      { name: t('productDeliveryBreadcrumbsTitle'), to: '' },
    ])

    // Clear up function
    return () => {
      setRecoil(breadcrumbsState, [])
    }
  }, [router])

  useEffect(() => {
    if (role == 'coordinate' || role == 'admin') {
      setFirstLoading(true)
    } else {
      router.push('/')
      setFirstLoading(true)
    }
  }, [role, router])

  return (
    <>
      <HeadPage title={t('productDeliveryHeadTitle') ?? ''} />

      {firstLoading ? <ProductDeliveryContainer /> : <Loading open={true} />}
    </>
  )
}
