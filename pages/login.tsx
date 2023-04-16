import { HeadPage } from '@/components'
import { AuthLayout } from '@/layouts'
import { LoginContainer } from '@/plugins/auth/components/login'

export default function LoginPage() {
  return (
    <>
      <HeadPage title="Test CICD" />
      <LoginContainer />
    </>
  )
}

LoginPage.Layout = AuthLayout
