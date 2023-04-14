import {
  ButtonBase,
  ButtonSubmit,
  InputField,
  MainModal,
  ModalAction,
  NumericFieldController,
  SelectField,
} from '@/components'

import { openModalDetailState } from '@/store/common'
import { shippingUnitOptionsState } from '@/store/meta'
import { formatDate, isPermissionUpdate, t } from '@/utils'
import {
  codeFieldValidation,
  fieldRequired,
  phoneFieldValidation,
  weightFieldValidation,
} from '@/utils/validator'
import { Stack } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { submitCreateVehicleApi, submitUpdateVehicleApi } from '../api'
import { vehicleActiveState } from '../store'
import { VehicleType } from '../type'

type ValuesType = {
  shippingUnitId: string | number
  code: string
  weight: string | number
  phone: string | number
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [vehicleActive, setVehicleActive] = useRecoilState<VehicleType | null>(vehicleActiveState)

  // Options
  const shippingUnitOptions = useRecoilValue(shippingUnitOptionsState)

  // Initial values
  const defaultValues: ValuesType = {
    shippingUnitId: vehicleActive?.shippingUnit?.id ?? '',
    code: vehicleActive?.code ?? '',
    phone: vehicleActive?.phone ?? '',
    weight: vehicleActive?.weight ?? '',
    createdAt: formatDate(vehicleActive?.createdAt as string) ?? '',
    updatedAt: formatDate(vehicleActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setVehicleActive(null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    if (vehicleActive && vehicleActive?.id > 0) {
      const vehicleActiveId = vehicleActive && vehicleActive?.id > 0 ? vehicleActive?.id : 0
      submitUpdateVehicleApi(data, vehicleActiveId, handleClose)
    } else {
      submitCreateVehicleApi(data, () => {
        handleClose()
        formContext.reset()
      })
    }
  }

  return (
    <MainModal
      open={openModalDetail}
      title={
        vehicleActive && vehicleActive?.id > 0 ? t('vehicleModalUpdate') : t('vehicleModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} width="100%" pb={10}>
          <SelectField
            name={'shippingUnitId'}
            label={t('vehicleShippingUnitIdFieldLabel')}
            placeholder={t('vehicleShippingUnitIdFieldPlaceholder')}
            options={shippingUnitOptions}
            disabled={
              vehicleActive ? (isPermissionUpdate('vehicles_update') ? false : true) : false
            }
            required
            validation={fieldRequired(t('vehicleShippingUnitIdRequiredValidation'))}
          />

          <InputField
            name={'code'}
            required
            label={t('vehicleCodeFieldLabel')}
            placeholder={t('vehicleCodeFieldPlaceholder')}
            validation={codeFieldValidation()}
            disabled={
              vehicleActive ? (isPermissionUpdate('vehicles_update') ? false : true) : false
            }
          />

          <InputField
            name={'phone'}
            label={t('vehiclePhoneFieldLabel')}
            placeholder={t('vehiclePhoneFieldPlaceholder')}
            validation={phoneFieldValidation(false)}
            disabled={
              vehicleActive ? (isPermissionUpdate('vehicles_update') ? false : true) : false
            }
          />

          <NumericFieldController
            name={'weight'}
            formContext={formContext}
            align="right"
            label={t('vehicleWeightFieldLabel')}
            placeholder={t('vehicleWeightFieldPlaceholder')}
            validation={weightFieldValidation(
              t('weightRequiredFieldValidation'),
              t('weightMaxLengthFieldValidation'),
              255,
              false
            )}
            disabled={
              vehicleActive ? (isPermissionUpdate('vehicles_update') ? false : true) : false
            }
          />

          {vehicleActive && vehicleActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>
        <ModalAction>
          <ButtonBase btnText={t('vehicleBtnClose')} handleClick={handleClose} />

          {vehicleActive ? (
            <React.Fragment>
              {isPermissionUpdate('vehicles_update') && (
                <ButtonSubmit btnText={t('vehicleBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('vehicleBtnSubmit')} type="submit" />
          )}
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
