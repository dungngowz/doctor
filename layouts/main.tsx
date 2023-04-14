import { Loading, MainHeader, MainSideBar } from '@/components'
import { roleState } from '@/store/common'
import { LayoutProps } from '@/types'
import { Box } from '@mui/material'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

export function MainLayout({ children }: LayoutProps) {
  const [isLogged, setIsLogged] = useState(true)

  const router = useRouter()

  // Recoil
  const role = useRecoilValue(roleState)

  let accessToken = getCookie('erpAccessToken')
  if (!accessToken) {
    accessToken = typeof window === 'undefined' ? '' : sessionStorage.getItem('erpAccessToken')
  }

  /* Checking if the accessToken is in the cookie, if not, it is checking if it is in the sessionStorage. */
  useEffect(() => {
    if (accessToken) {
      setIsLogged(false)

      if (role == 'driver') {
        router.push('/driver')
      }
    } else {
      router.push('/login')
    }
  }, [role, router])

  return (
    <>
      {isLogged ? (
        <Loading open={isLogged} />
      ) : (
        <Box id="pr-app-root" component={'main'} className="main-layout-wrapper">
          {/* Main Header  */}
          <MainHeader />

          <Box id="pr-app-wrapper" className="app-wrapper">
            {/* Main Side bar */}
            <MainSideBar />

            <Box className="app-main">{children}</Box>
          </Box>
        </Box>
      )}
    </>
  )
}
