import { roleState } from '@/store/common'
import { LayoutProps } from '@/types'
import { Container } from '@mui/system'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

export const DriverLayout = ({ children }: LayoutProps) => {
  const role = useRecoilValue(roleState)
  const router = useRouter()

  let accessToken = getCookie('erpAccessToken')
  if (!accessToken) {
    accessToken = typeof window === 'undefined' ? '' : sessionStorage.getItem('erpAccessToken')
  }
  useEffect(() => {
    if (accessToken) {
      if (typeof role != 'undefined') {
        if (role != 'driver') {
          router.push('/')
        } else {
          return
        }
      }
    } else if (!accessToken) {
      router.push('/login')
    }
  }, [role, accessToken, router])

  return (
    <Container sx={{ bgcolor: '#fafafa', height: '100vh' }} maxWidth="sm">
      {children}
    </Container>
  )
}
