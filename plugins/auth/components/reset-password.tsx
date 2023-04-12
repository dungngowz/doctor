import { ButtonSubmit, CardAuth, InputPasswordField, InputPasswordRepeatField } from '@/components'
import { t } from '@/utils'
import { passwordValidation } from '@/utils/validator'
import { Stack } from '@mui/material'
import { FormContainer } from 'react-hook-form-mui'

/**
 * @property {string} newPassword - The new password that the user wants to set.
 * @property {string} confirmPassword - The password confirmation field.
 * @property {string} token - The token that was sent to the user's email address.
 */
type FormResetPasswordType = {
  newPassword?: string
  confirmPassword?: string
  token?: string
}

export const ResetPasswordContainer = () => {
  /* Setting the default values for the form. */
  const defaultValues: FormResetPasswordType = {
    newPassword: '',
    confirmPassword: '',
    token: '',
  }

  const onSubmit = (data: FormResetPasswordType) => {
    console.log(data)
  }

  return (
    <>
      <CardAuth vector={'ic ic--reset-password'} title={t('resetPasswordTitle')}>
        <FormContainer defaultValues={defaultValues} onSuccess={onSubmit}>
          <Stack spacing={2} paddingBottom={4}>
            <InputPasswordField
              name="newPassword"
              label={t('newPasswordLabel')}
              required
              validation={passwordValidation()}
            />
            <InputPasswordRepeatField
              passwordFieldName="newPassword"
              name="confirmPassword"
              label={t('confirmPasswordLabel')}
              required
              validation={passwordValidation()}
            />
          </Stack>
          <ButtonSubmit type="submit" btnText={t('submitRestPassword')} />
        </FormContainer>
      </CardAuth>
    </>
  )
}
