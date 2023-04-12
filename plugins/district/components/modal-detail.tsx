import { ButtonBase, ButtonSubmit, InputField, MainModal, SelectField } from '@/components'
import { openModalDetailState } from '@/store/common'
import { provinceOptionsState } from '@/store/meta'
import { formatDate, isPermissionUpdate, t } from '@/utils'
import { fieldRequired, nameFieldValidation } from '@/utils/validator'
import { Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { submitCreateDistrictApi, submitUpdateDistrictApi } from '../api'
import { districtActiveState } from '../store'

type ValuesType = {
  title: string
  provinceId: any
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [districtActive, setProvinceActive] = useRecoilState(districtActiveState)
  const provinceOptions = useRecoilValue(provinceOptionsState)

  // Initial values
  const defaultValues: ValuesType = {
    provinceId: districtActive?.province?.id ?? '',
    title: districtActive?.title ?? '',
    createdAt: formatDate(districtActive?.createdAt as string) ?? '',
    updatedAt: formatDate(districtActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setProvinceActive(null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    if (districtActive && districtActive?.id > 0) {
      const districtId = districtActive && districtActive?.id > 0 ? districtActive?.id : 0
      submitUpdateDistrictApi(data, districtId, handleClose)
    } else {
      submitCreateDistrictApi(data, handleClose)
    }
  }

  // Watch first mount
  useEffect(() => {
    formContext.setValue('title', districtActive?.title ?? '')
    formContext.setValue('provinceId', districtActive?.province?.id ?? '')
    formContext.setValue('createdAt', formatDate(districtActive?.createdAt as string) ?? '')
    formContext.setValue('updatedAt', formatDate(districtActive?.updatedAt as string) ?? '')
  }, [openModalDetail])

  return (
    <MainModal
      open={openModalDetail}
      title={
        districtActive && districtActive?.id > 0
          ? t('districtModalUpdate')
          : t('districtModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2}>
          <SelectField
            name="provinceId"
            label={t('districtSelectProvinceFieldLabel')}
            required
            validation={fieldRequired(t('selectProvinceRequiredValidation'))}
            placeholder={t('districtSelectProvinceFieldPlaceholder')}
            options={provinceOptions}
            disabled={
              districtActive ? (isPermissionUpdate('districts_update') ? false : true) : false
            }
          />
          <InputField
            name={'title'}
            required
            label={t('districtNameFieldLabel')}
            placeholder={t('districtNameFieldPlaceholder')}
            validation={nameFieldValidation(t('districtRequiredValidation'))}
            disabled={
              districtActive ? (isPermissionUpdate('districts_update') ? false : true) : false
            }
          />

          {districtActive && districtActive?.id > 0 && (
            <>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </>
          )}
        </Stack>

        <Stack pt={2.5} direction="row" spacing={2} justifyContent="flex-end">
          <ButtonBase btnText={t('districtBtnClose')} handleClick={handleClose} />

          {districtActive ? (
            <React.Fragment>
              {isPermissionUpdate('districts_update') && (
                <ButtonSubmit btnText={t('districtBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('districtBtnSubmit')} type="submit" />
          )}
        </Stack>
      </FormContainer>
    </MainModal>
  )
}
