import { HeadPage, Loading } from '@/components'
import { OrderContainer } from '@/plugins/order/components'
import { OrderCoordinateContainer } from '@/plugins/order/order-coordinate'
import { breadcrumbsState, roleState } from '@/store/common'
import { isUserLoadingState } from '@/store/user'
import { t } from '@/utils'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export default function OrderPage() {
  const role = useRecoilValue(roleState)
  const loading = useRecoilValue(isUserLoadingState)

  // Handle set breadcrumb on header
  useEffect(() => {
    setRecoil(breadcrumbsState, [
      { name: t('dashboard'), to: '/' },
      { name: t('orderBreadcrumbsTitle'), to: '' },
    ])

    // Clear up function
    return () => {
      setRecoil(breadcrumbsState, [])
    }
  }, [])

  return (
    <>
      <HeadPage title={t('orderHeadTitle') ?? ''} />
      {loading ? (
        <Loading />
      ) : (
        <>{role === 'coordinate' ? <OrderCoordinateContainer /> : <OrderContainer />}</>
      )}
    </>
  )
}
