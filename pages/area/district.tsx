import { HeadPage, Loading } from '@/components'
import { DistrictContainer } from '@/plugins/district/components'
import { breadcrumbsState } from '@/store/common'
import { isUserLoadingState, permissionsRuleState } from '@/store/user'
import { t } from '@/utils'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export default function DistrictPage() {
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
      { name: t('districtTitle'), to: '' },
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
        if (permissionsRule?.includes('districts_view')) {
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
      <HeadPage title={t('districtTitle') ?? ''} />
      {loading ? <Loading open={true} /> : <DistrictContainer />}
    </>
  )
}
