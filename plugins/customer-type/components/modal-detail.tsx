import { ButtonBase, ButtonSubmit, InputField, MainModal, ModalAction } from '@/components'
import { openModalDetailState } from '@/store/common'
import { formatDate, isPermissionUpdate, t } from '@/utils'
import { nameFieldValidation } from '@/utils/validator'
import { Stack } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { submitCreateCustomerTypesApi, submitUpdateCustomerTypesApi } from '../api'
import { customerTypesActiveState } from '../store'

type ValuesType = {
  title: string
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [customerTypesActive, setCustomerTypesActive] = useRecoilState(customerTypesActiveState)

  // Initial values
  const defaultValues: ValuesType = {
    title: customerTypesActive?.title ?? '',
    createdAt: formatDate(customerTypesActive?.createdAt as string) ?? '',
    updatedAt: formatDate(customerTypesActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setCustomerTypesActive(null)
    setRecoil(customerTypesActiveState, null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    if (customerTypesActive && customerTypesActive?.id > 0) {
      const customerTypesActiveId =
        customerTypesActive && customerTypesActive?.id > 0 ? customerTypesActive?.id : 0
      submitUpdateCustomerTypesApi(data, customerTypesActiveId, handleClose)
    } else {
      submitCreateCustomerTypesApi(data, () => {
        handleClose()
      })
    }
  }

  return (
    <MainModal
      open={openModalDetail}
      title={
        customerTypesActive && customerTypesActive?.id > 0
          ? t('customerTypesModalUpdate')
          : t('customerTypesModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack pb={9} spacing={2}>
          <InputField
            name="title"
            required
            label={t('customerTypesTitleFieldLabel')}
            placeholder={t('customerTypesTitlePlaceholder')}
            validation={nameFieldValidation()}
            disabled={
              customerTypesActive
                ? isPermissionUpdate('customer_types_update')
                  ? false
                  : true
                : false
            }
          />

          {customerTypesActive && customerTypesActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('customerTypesBtnClose')} handleClick={handleClose} />

          {customerTypesActive ? (
            <React.Fragment>
              {isPermissionUpdate('customer_types_update') && (
                <ButtonSubmit btnText={t('customerTypesBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('customerTypesBtnSubmit')} type="submit" />
          )}
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
