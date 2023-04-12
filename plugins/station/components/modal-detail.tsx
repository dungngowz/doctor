import {
  ButtonBase,
  ButtonSubmit,
  InputField,
  MainModal,
  ModalAction,
  NumericFieldController,
} from '@/components'
import { openModalDetailState } from '@/store/common'
import { formatDate, isPermissionUpdate, t } from '@/utils'
import { nameFieldValidation } from '@/utils/validator'
import { Stack } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState } from 'recoil'
import { submitCreateStationApi, submitUpdateStationApi } from '../api'
import { stationActiveState } from '../store'

type ValuesType = {
  name: string
  memo: string
  address: string
  wattage: string | number
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [stationActive, setStationActive] = useRecoilState(stationActiveState)

  // Initial values
  const defaultValues: ValuesType = {
    name: stationActive?.name ?? '',
    memo: stationActive?.memo ?? '',
    address: stationActive?.address ?? '',
    wattage: stationActive?.wattage ?? '',
    createdAt: formatDate(stationActive?.createdAt as string) ?? '',
    updatedAt: formatDate(stationActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setStationActive(null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    if (stationActive && stationActive?.id > 0) {
      const stationActiveId = stationActive && stationActive?.id > 0 ? stationActive?.id : 0
      submitUpdateStationApi(data, stationActiveId, handleClose)
    } else {
      submitCreateStationApi(data, () => {
        handleClose()
      })
    }
  }

  return (
    <MainModal
      open={openModalDetail}
      title={
        stationActive && stationActive?.id > 0 ? t('stationModalUpdate') : t('stationModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} pb={9}>
          <InputField
            name="name"
            label={t('stationNameFieldLabel')}
            required
            placeholder={t('stationNameFieldPlaceholder')}
            validation={nameFieldValidation(
              t('stationNameFieldRequiredValidation'),
              t('stationNameFieldMaxLengthValidation')
            )}
            disabled={
              stationActive ? (isPermissionUpdate('stations_update') ? false : true) : false
            }
          />

          <InputField
            name="address"
            label={t('stationAddressFieldLabel')}
            required
            placeholder={t('stationAddressFieldPlaceholder')}
            validation={nameFieldValidation(
              t('stationAddressFieldRequiredValidation'),
              t('stationAddressFieldMaxLengthValidation')
            )}
            disabled={
              stationActive ? (isPermissionUpdate('stations_update') ? false : true) : false
            }
          />

          <NumericFieldController
            name="wattage"
            formContext={formContext}
            label={t('stationWattageFieldLabel')}
            required
            placeholder={t('stationWattageFieldPlaceholder')}
            validation={nameFieldValidation(
              t('stationWattageRequiredValidation'),
              t('stationWattageMaxLengthValidation'),
              5
            )}
            disabled={
              stationActive ? (isPermissionUpdate('stations_update') ? false : true) : false
            }
          />

          <InputField
            name="memo"
            label={t('stationMemoFieldLabel')}
            placeholder={t('stationMemoFieldPlaceholder')}
            rows={3}
            disabled={
              stationActive ? (isPermissionUpdate('stations_update') ? false : true) : false
            }
          />

          {stationActive && stationActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('stationBtnClose')} handleClick={handleClose} />

          {stationActive ? (
            <React.Fragment>
              {isPermissionUpdate('stations_update') && (
                <ButtonSubmit btnText={t('stationBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('stationBtnSubmit')} type="submit" />
          )}
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
