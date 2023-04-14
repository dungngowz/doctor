import { AuthLayout } from '@/layouts'
import { ResetPasswordContainer } from '@/plugins/auth/components/reset-password'

export default function ResetPasswordPage() {
  return <ResetPasswordContainer />
}

ResetPasswordPage.Layout = AuthLayout
