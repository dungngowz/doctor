import { HeadPage, Loading } from '@/components'
import { ContractorContainer } from '@/plugins/contractor/components'
import { breadcrumbsState } from '@/store/common'
import { isUserLoadingState, permissionsRuleState } from '@/store/user'
import { t } from '@/utils'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export default function ContractorPage() {
  // Recoil
  const isUserLoading = useRecoilValue(isUserLoadingState)
  const permissionsRule = useRecoilValue(permissionsRuleState)

  // Hooks
  const router = useRouter()

  // State
  const [loading, setLoading] = useState(true)

  // Get cookies
  let accessToken = getCookie('erpAccessToken')
  if (!accessToken && typeof window == 'object') {
    accessToken = sessionStorage.getItem('erpAccessToken')
  }
  // Handle set breadcrumb on header
  useEffect(() => {
    setRecoil(breadcrumbsState, [
      { name: t('dashboard'), to: '/' },
      { name: t('contractorBreadcrumbsTitle'), to: '' },
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
        if (permissionsRule?.includes('contractors_view')) {
          setLoading(false)
          return
        } else {
          router.push('/404')
        }
      }
    }
  }, [isUserLoading, permissionsRule])

  return (
    <>
      <HeadPage title={t('contractorHeadTitle') ?? ''} />
      {loading ? <Loading open={true} /> : <ContractorContainer />}
    </>
  )
}
