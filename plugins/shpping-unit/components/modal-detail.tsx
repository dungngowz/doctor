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
import { setRecoil } from 'recoil-nexus'
import { submitCreateShippingUnitApi, submitUpdateShippingUnitApi } from '../api'
import { shippingUnitActiveState } from '../store'

type ValuesType = {
  code: string
  name: string
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
  const [shippingUnitActive, setShippingUnitActive] = useRecoilState(shippingUnitActiveState)

  // Initial values
  const defaultValues: ValuesType = {
    code: shippingUnitActive?.code ?? '',
    name: shippingUnitActive?.name ?? '',
    taxCode: shippingUnitActive?.taxCode ?? '',
    phone: shippingUnitActive?.phone ?? '',
    address: shippingUnitActive?.address ?? '',
    email: shippingUnitActive?.email ?? '',
    nameContact: shippingUnitActive?.nameContact ?? '',
    position: shippingUnitActive?.position ?? '',
    memo: shippingUnitActive?.memo ?? '',
    createdAt: formatDate(shippingUnitActive?.createdAt as string) ?? '',
    updatedAt: formatDate(shippingUnitActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  const { watch, getValues } = formContext

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setShippingUnitActive(null)
    setRecoil(shippingUnitActiveState, null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    if (shippingUnitActive && shippingUnitActive?.id > 0) {
      const shippingUnitActiveId =
        shippingUnitActive && shippingUnitActive?.id > 0 ? shippingUnitActive?.id : 0
      submitUpdateShippingUnitApi(data, shippingUnitActiveId, handleClose)
    } else {
      submitCreateShippingUnitApi(data, () => {
        handleClose()
      })
    }
  }

  return (
    <MainModal
      open={openModalDetail}
      maxWidth="sm"
      title={
        shippingUnitActive && shippingUnitActive?.id > 0
          ? t('shippingUnitModalUpdate')
          : t('shippingUnitModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} width="100%" pb={10}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <InputField
              name={'code'}
              required
              label={t('shippingUnitCodeFieldLabel')}
              placeholder={t('shippingUnitCodeFieldPlaceholder')}
              validation={codeFieldValidation()}
              disabled={
                shippingUnitActive
                  ? isPermissionUpdate('shipping_unit_update')
                    ? false
                    : true
                  : false
              }
            />
            <InputField
              name={'name'}
              required
              label={t('shippingUnitNameFieldLabel')}
              placeholder={t('shippingUnitNameFieldPlaceholder')}
              validation={nameFieldValidation()}
              disabled={
                shippingUnitActive
                  ? isPermissionUpdate('shipping_unit_update')
                    ? false
                    : true
                  : false
              }
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <InputField
              name={'taxCode'}
              required
              label={t('shippingUnitTaxCodeFieldLabel')}
              placeholder={t('shippingUnitTaxCodeFieldPlaceholder')}
              validation={taxCodeFieldValidation()}
              disabled={
                shippingUnitActive
                  ? isPermissionUpdate('shipping_unit_update')
                    ? false
                    : true
                  : false
              }
            />
            <InputField
              name={'phone'}
              required
              label={t('shippingUnitPhoneFieldLabel')}
              placeholder={t('shippingUnitPhoneFieldPlaceholder')}
              validation={phoneFieldValidation()}
              disabled={
                shippingUnitActive
                  ? isPermissionUpdate('shipping_unit_update')
                    ? false
                    : true
                  : false
              }
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Box flex={1}>
              <InputField
                name={'email'}
                label={t('shippingUnitEmailFieldLabel')}
                placeholder={t('shippingUnitEmailFieldPlaceholder')}
                disabled={
                  shippingUnitActive
                    ? isPermissionUpdate('shipping_unit_update')
                      ? false
                      : true
                    : false
                }
              />
            </Box>
            <Box flex={1}></Box>
          </Stack>
          <InputField
            name={'address'}
            required
            label={t('shippingUnitAddressFieldLabel')}
            placeholder={t('shippingUnitAddressFieldPlaceholder')}
            validation={addressFieldValidation()}
            disabled={
              shippingUnitActive
                ? isPermissionUpdate('shipping_unit_update')
                  ? false
                  : true
                : false
            }
          />

          <BasicCard title={t('shippingUnitContactLabel')}>
            <>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <InputField
                  name="nameContact"
                  label={t('shippingUnitContactNameLabel')}
                  placeholder={t('shippingUnitContactNamePlaceholder')}
                  disabled={
                    shippingUnitActive
                      ? isPermissionUpdate('shipping_unit_update')
                        ? false
                        : true
                      : false
                  }
                />
                <InputField
                  name="position"
                  label={t('shippingUnitContactPositionLabel')}
                  placeholder={t('shippingUnitContactPositionPlaceholder')}
                  disabled={
                    shippingUnitActive
                      ? isPermissionUpdate('shipping_unit_update')
                        ? false
                        : true
                      : false
                  }
                />
              </Stack>
              <InputField
                name="memo"
                rows={3}
                label={t('shippingUnitContactMemoFieldLabel')}
                disabled={
                  shippingUnitActive
                    ? isPermissionUpdate('shipping_unit_update')
                      ? false
                      : true
                    : false
                }
              />
            </>
          </BasicCard>

          {shippingUnitActive && shippingUnitActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('shippingUnitBtnClose')} handleClick={handleClose} />

          {shippingUnitActive ? (
            <React.Fragment>
              {isPermissionUpdate('shipping_unit_update') && (
                <ButtonSubmit btnText={t('shippingUnitBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('shippingUnitBtnSubmit')} type="submit" />
          )}
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
