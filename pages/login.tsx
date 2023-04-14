import { HeadPage } from '@/components'
import { AuthLayout } from '@/layouts'
import { LoginContainer } from '@/plugins/auth/components/login'
import { t } from '@/utils'

export default function LoginPage() {
  return (
    <>
      <HeadPage title={t('loginTitlePage')} />
      <LoginContainer />
    </>
  )
}

LoginPage.Layout = AuthLayout
