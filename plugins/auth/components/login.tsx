import { ButtonSubmit, InputField, InputPasswordField } from '@/components'
import { CardAuth } from '@/components/card/auth'
import { t } from '@/utils'
import { fieldRequired, passwordValidation } from '@/utils/validator'
import { Stack, Typography } from '@mui/material'
import { CheckboxElement, FormContainer } from 'react-hook-form-mui'
import { toast } from 'react-toastify'
import { loginApi } from '../api'
import { FormLoginType } from '../types'

export const LoginContainer = () => {
  const defaultValues: FormLoginType = {
    email: '',
    password: '',
    remember: false,
    role: 'admin',
  }

  // Login
  const onSubmit = async (data: FormLoginType) => {
    loginApi(data, toast)
  }

  return (
    <CardAuth vector={'ic ic--login'}>
      <Stack width={'100%'}>
        <Typography variant="h5" textAlign="center" fontWeight={600}>
          {t('loginTitlePage')}
        </Typography>

        <FormContainer defaultValues={defaultValues} onSuccess={onSubmit}>
          <Stack width={'100%'} spacing={2} paddingTop={4}>
            <InputField
              name="email"
              label={t('emailPhoneLabel')}
              placeholder={t('emailPhonePlaceholder')}
              validation={fieldRequired(t('emailPhoneValidation'))}
            />

            <InputPasswordField
              name={'password'}
              label={t('passwordLabel')}
              placeholder={t('passwordPlaceholder')}
              validation={passwordValidation()}
            />
          </Stack>

          <Stack
            paddingTop={1}
            paddingBottom={1}
            direction={'row'}
            alignItems="center"
            justifyContent={'space-between'}
          >
            <CheckboxElement name={'remember'} label={t('rememberLogin')} />
            {/* <Link href={'/forgot-password'}>{t('loginForgotPasswordLabel')}</Link> */}
          </Stack>

          <Stack direction={'row'} alignItems="center" justifyContent={'center'}>
            <ButtonSubmit type={'submit'} btnText={t('loginBtnSubmit')} />
          </Stack>
        </FormContainer>
      </Stack>
    </CardAuth>
  )
}
