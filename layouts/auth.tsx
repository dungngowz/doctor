import { Loading } from '@/components'
import { LayoutProps } from '@/types'
import { Container } from '@mui/material'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/**
 * It checks if the user is logged in, and if not, it renders the children
 * @param {LayoutProps}  - children - The content of the component.
 * @returns A Container component with children.
 */
export const AuthLayout = ({ children }: LayoutProps) => {
  /* A state hook. */
  const [isLogged, setIsLogged] = useState(true)

  /* A Next.js hook that allows you to access the router. */
  const router = useRouter()

  /* Checking if the user is logged in. */
  let accessToken = getCookie('erpAccessToken')
  if (!(typeof window === 'undefined')) {
    if (!accessToken) {
      accessToken = sessionStorage.getItem('erpAccessToken')
    }
  }

  /* Checking if the user is logged in. */
  useEffect(() => {
    if (accessToken) {
      router.push('/')
      setIsLogged(false)
    } else {
      setIsLogged(false)
    }
  }, [accessToken, router])

  /* Checking if the user is logged in, and if not, it renders the children. */
  return (
    <> {isLogged ? <Loading open={true} /> : <Container maxWidth="md">{children}</Container>} </>
  )
}
