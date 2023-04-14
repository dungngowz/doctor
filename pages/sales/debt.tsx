import { HeadPage, Loading } from '@/components'
import { DebtContainer } from '@/plugins/debt/components'
import { breadcrumbsState, roleState } from '@/store/common'
import { userState } from '@/store/user'
import { t } from '@/utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
export default function DebtPage() {
  // Hooks
  const role = useRecoilValue(roleState)
  const router = useRouter()
  const user = useRecoilValue(userState)

  // State
  const [firstLoading, setFirstLoading] = useState(true)

  // Handle set breadcrumb on header
  useEffect(() => {
    setRecoil(breadcrumbsState, [
      { name: t('dashboard'), to: '/' },
      { name: t('debtBreadcrumbsTitle'), to: '' },
    ])

    // Clear up function
    return () => {
      setRecoil(breadcrumbsState, [])
    }
  }, [])

  useEffect(() => {
    if (role == 'admin' || role == 'accountant' || role == 'business') {
      setFirstLoading(false)
    } else {
      setFirstLoading(true)
      router.push('/')
    }

    if (role == 'business') {
      const checkApproved = user.canApproved // check  business manager
      if (!checkApproved) {
        router.push('/')
        setFirstLoading(true)
      }
    }
  }, [role, router, user])

  return (
    <>
      <HeadPage title={t('debtHeadTitle') ?? ''} />
      {firstLoading ? <Loading open={true} /> : <DebtContainer />}
    </>
  )
}
