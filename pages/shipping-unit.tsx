import { HeadPage, Loading } from '@/components'
import { ShippingUnitContainer } from '@/plugins/shpping-unit/components'
import { breadcrumbsState } from '@/store/common'
import { isUserLoadingState, permissionsRuleState } from '@/store/user'
import { t } from '@/utils'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export default function ShippingUnitPage() {
  // Recoil
  const permissionsRule = useRecoilValue(permissionsRuleState)
  const isUserLoading = useRecoilValue(isUserLoadingState)

  // Get cookies
  let accessToken = getCookie('erpAccessToken')
  if (!accessToken && typeof window == 'object') {
    accessToken = sessionStorage.getItem('erpAccessToken')
  }

  // Hooks
  const router = useRouter()

  // State
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setRecoil(breadcrumbsState, [
      { name: t('dashboard'), to: '/' },
      { name: t('shippingUnitBreadcrumbsTitle'), to: '' },
    ])

    // Clear up function
    return () => {
      setRecoil(breadcrumbsState, [])
    }
  }, [])

  // Check permission view
  useEffect(() => {
    if (accessToken) {
      if (!isUserLoading) {
        if (permissionsRule.includes('shipping_unit_view')) {
          setLoading(false)
          return
        } else {
          router.push('/404')
        }
      }
    }
  }, [isUserLoading])

  return (
    <>
      <HeadPage title={t('shippingUnitHeadTitle') ?? ''} />
      {loading ? <Loading open={true} /> : <ShippingUnitContainer />}
    </>
  )
}
