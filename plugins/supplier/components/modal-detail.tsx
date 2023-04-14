import {
  BasicCard,
  ButtonBase,
  ButtonSubmit,
  InputField,
  MainModal,
  ModalAction,
} from '@/components'
import { openModalDetailState } from '@/store/common'
import { formatDate, isPermissionUpdate, t } from '@/utils'
import {
  addressFieldValidation,
  codeFieldValidation,
  nameFieldValidation,
  phoneFieldValidation,
  taxCodeFieldValidation,
} from '@/utils/validator'
import { Box, Stack } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState } from 'recoil'
import { submitCreateSupplierApi, submitUpdateSupplierApi } from '../api'
import { supplierActiveState } from '../store'
import { SupplierType } from '../type'

type ValuesType = {
  name: string
  code: string
  taxCode: string
  phone: string
  address: string
  email: string
  nameContact: string
  position: string
  memo: string
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [supplierActive, setSupplierActive] = useRecoilState<SupplierType | null>(
    supplierActiveState
  )

  // Initial values
  const defaultValues: ValuesType = {
    code: supplierActive?.code ?? '',
    name: supplierActive?.name ?? '',
    taxCode: supplierActive?.taxCode ?? '',
    phone: supplierActive?.phone ?? '',
    address: supplierActive?.address ?? '',
    email: supplierActive?.email ?? '',
    nameContact: supplierActive?.nameContact ?? '',
    position: supplierActive?.position ?? '',
    memo: supplierActive?.memo ?? '',
    createdAt: formatDate(supplierActive?.createdAt as string) ?? '',
    updatedAt: formatDate(supplierActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setSupplierActive(null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    if (supplierActive && supplierActive?.id > 0) {
      const supplierActiveId = supplierActive && supplierActive?.id > 0 ? supplierActive?.id : 0
      submitUpdateSupplierApi(data, supplierActiveId, handleClose)
    } else {
      submitCreateSupplierApi(data, () => {
        handleClose()
      })
    }
  }

  return (
    <MainModal
      open={openModalDetail}
      title={
        supplierActive && supplierActive?.id > 0
          ? t('supplierModalUpdate')
          : t('supplierModalCreate')
      }
      maxWidth="sm"
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} width="100%" pb={10}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <InputField
              name={'code'}
              required
              label={t('supplierCodeFieldLabel')}
              placeholder={t('supplierCodeFieldPlaceholder')}
              validation={codeFieldValidation()}
              disabled={
                supplierActive ? (isPermissionUpdate('suppliers_update') ? false : true) : false
              }
            />
            <InputField
              name={'name'}
              required
              label={t('supplierNameFieldLabel')}
              placeholder={t('supplierNameFieldPlaceholder')}
              validation={nameFieldValidation()}
              disabled={
                supplierActive ? (isPermissionUpdate('suppliers_update') ? false : true) : false
              }
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <InputField
              name={'taxCode'}
              required
              label={t('supplierTaxCodeFieldLabel')}
              placeholder={t('supplierTaxCodeFieldPlaceholder')}
              validation={taxCodeFieldValidation()}
              disabled={
                supplierActive ? (isPermissionUpdate('suppliers_update') ? false : true) : false
              }
            />
            <InputField
              name={'phone'}
              required
              label={t('supplierPhoneFieldLabel')}
              placeholder={t('supplierPhoneFieldPlaceholder')}
              validation={phoneFieldValidation()}
              disabled={
                supplierActive ? (isPermissionUpdate('suppliers_update') ? false : true) : false
              }
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Box flex={1}>
              <InputField
                name={'email'}
                label={t('supplierEmailFieldLabel')}
                placeholder={t('supplierEmailFieldPlaceholder')}
                disabled={
                  supplierActive ? (isPermissionUpdate('suppliers_update') ? false : true) : false
                }
              />
            </Box>
            <Box flex={1}></Box>
          </Stack>
          <InputField
            name={'address'}
            required
            label={t('supplierAddressFieldLabel')}
            placeholder={t('supplierAddressFieldPlaceholder')}
            validation={addressFieldValidation()}
            disabled={
              supplierActive ? (isPermissionUpdate('suppliers_update') ? false : true) : false
            }
          />

          <BasicCard title={t('supplierContactLabel')}>
            <>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <InputField
                  name="nameContact"
                  label={t('supplierContactNameLabel')}
                  placeholder={t('supplierContactNamePlaceholder')}
                  disabled={
                    supplierActive ? (isPermissionUpdate('suppliers_update') ? false : true) : false
                  }
                />
                <InputField
                  name="position"
                  label={t('supplierContactPositionLabel')}
                  placeholder={t('supplierContactPositionPlaceholder')}
                  disabled={
                    supplierActive ? (isPermissionUpdate('suppliers_update') ? false : true) : false
                  }
                />
              </Stack>
              <InputField
                name="memo"
                rows={3}
                label={t('supplierContactMemoFieldLabel')}
                disabled={
                  supplierActive ? (isPermissionUpdate('suppliers_update') ? false : true) : false
                }
              />
            </>
          </BasicCard>

          {supplierActive && supplierActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>
        <ModalAction>
          <ButtonBase btnText={t('supplierBtnClose')} handleClick={handleClose} />

          {supplierActive ? (
            <React.Fragment>
              {isPermissionUpdate('suppliers_update') && (
                <ButtonSubmit btnText={t('supplierBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('supplierBtnSubmit')} type="submit" />
          )}
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
