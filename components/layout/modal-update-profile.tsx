import { updateProfileApi } from '@/plugins/auth/api'
import { userState } from '@/store/user'
import { t } from '@/utils'
import {
  addressFieldValidation,
  emailValidation,
  nameFieldValidation,
  passwordValidation,
  phoneFieldValidation,
} from '@/utils/validator'
import { Stack } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilValue } from 'recoil'
import { ButtonBase, ButtonSubmit } from '../button'
import { InputField } from '../form-control'
import { MainModal, ModalAction } from '../modal'

type IProps = {
  open: boolean
  handleClose: () => void
}

type DefaultValuesType = {
  name: string
  phone: string
  email: string
  password: string
  address: string
}

export const ModalUpdateProfile = (props: IProps) => {
  const { open = false, handleClose } = props

  // Hooks
  const user = useRecoilValue(userState)

  // defaultValues
  const defaultValues: DefaultValuesType = {
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    password: '',
    address: user?.address ?? '',
  }

  // Define form context
  const formContext = useForm<DefaultValuesType>({
    defaultValues: defaultValues,
  })

  const { setValue } = formContext

  // On submit
  const onHandleSubmit = (values: DefaultValuesType) => {
    updateProfileApi(values, handleClose)
  }

  useEffect(() => {
    setValue('name', user?.name)
    setValue('phone', user?.phone)
    setValue('email', user?.email)
    setValue('address', user?.address)
  }, [user])

  return (
    <MainModal
      open={open}
      maxWidth="xs"
      onClose={handleClose}
      title="Cập nhật thông tin người dùng"
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} mb={8}>
          <InputField
            name="name"
            required
            label={t('userNameFieldLabel')}
            placeholder={t('userNameFieldPlaceholder')}
            validation={nameFieldValidation()}
          />
          <InputField
            name="phone"
            required
            label={t('userPhoneFieldLabel')}
            placeholder={t('userPhoneFieldPlaceholder')}
            validation={phoneFieldValidation()}
          />
          <InputField
            name="email"
            label={t('userEmailFieldLabel')}
            placeholder={t('userEmailFieldPlaceholder')}
            // validation={emailValidation()}
            validation={emailValidation('', t('staffEmailMaxLengthValidation'), 255, false)}
          />
          <InputField
            name="password"
            label={t('userPasswordFieldLabel')}
            placeholder={t('userPasswordFieldPlaceholder')}
            validation={passwordValidation(6, 20, false)}
          />
          <InputField
            name="address"
            required
            label={t('userAddressFieldLabel')}
            placeholder={t('userAddressFieldPlaceholder')}
            validation={addressFieldValidation()}
          />

          <ModalAction>
            <ButtonBase btnText={t('userBtnClose')} handleClick={handleClose} />
            <ButtonSubmit type="submit" btnText={t('userBtnSubmitUpdate')} />
          </ModalAction>
        </Stack>
      </FormContainer>
    </MainModal>
  )
}
