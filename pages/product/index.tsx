import { HeadPage, Loading } from '@/components'
import { ProductContainer } from '@/plugins/product/components'
import { breadcrumbsState } from '@/store/common'
import { isUserLoadingState, permissionsRuleState } from '@/store/user'
import { t } from '@/utils'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export default function ProductPage() {
  // Hooks
  const router = useRouter()
  const permissionsRule = useRecoilValue(permissionsRuleState)
  const isUserLoading = useRecoilValue(isUserLoadingState)

  // Get cookies
  let accessToken = getCookie('erpAccessToken')
  if (!accessToken && typeof window == 'object') {
    accessToken = sessionStorage.getItem('erpAccessToken')
  }

  // State
  const [firstLoading, setFirstLoading] = useState(true)

  // Handle set breadcrumb on header
  useEffect(() => {
    setRecoil(breadcrumbsState, [
      { name: t('dashboard'), to: '/' },
      { name: t('productTitle'), to: '' },
    ])

    // Clear up function
    return () => {
      setRecoil(breadcrumbsState, [])
    }
  }, [])

  useEffect(() => {
    if (accessToken) {
      if (!isUserLoading) {
        if (permissionsRule.includes('products_view')) {
          setFirstLoading(false)
        } else {
          router.push('/404')
        }
      }
    }
  }, [router, permissionsRule, accessToken])

  return (
    <>
      <HeadPage title={t('productTitle') ?? ''} />
      {firstLoading ? <Loading open={true} /> : <ProductContainer />}
    </>
  )
}
