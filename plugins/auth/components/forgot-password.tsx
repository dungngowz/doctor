import { ButtonSubmit, CardAuth, InputField, Loading } from '@/components'
import { t } from '@/utils'
import { Stack } from '@mui/material'
import { useState } from 'react'
import { FormContainer } from 'react-hook-form-mui'

/**
 * FormForgotPassword is an object with a property called email that is a string.
 * @property {string} email - string
 */
export type FormForgotPassword = {
  email: string
}

/**
 * It's a function that returns a card with a form that allows the user to reset their password
 * @returns A card with a form that allows the user to reset their password.
 */
export const ForgotPasswordContainer = () => {
  /* Call hooks */
  const [loading, setLoading] = useState(false)

  /* Setting the default value of the email field to an empty string. */
  const defaultValues: FormForgotPassword = {
    email: '',
  }

  /**
   * A function that will be called when the form is submitted.
   * @param {FormForgotPassword} data - FormForgotPassword
   */
  const onSubmit = (data: FormForgotPassword) => {
    // forgotPasswordApi(data, setLoading)
  }

  return (
    <>
      <CardAuth
        vector={'ic ic--forgot-password'}
        title={t('forgotPasswordTitle')}
        description={t('forgotPasswordDescription')}
      >
        <FormContainer defaultValues={defaultValues} onSuccess={onSubmit}>
          <Stack spacing={4}>
            <InputField name={'email'} label={t('emailLabel')} required type={'email'} />
            <ButtonSubmit type={'submit'} btnText={t('forgotPasswordSubmit')} />
          </Stack>
        </FormContainer>
      </CardAuth>

      <Loading open={loading} />
    </>
  )
}
