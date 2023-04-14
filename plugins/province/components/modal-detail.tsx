import { ButtonBase, ButtonSubmit, InputField, MainModal, SelectField } from '@/components'
import { getRegionData } from '@/plugins/region/api'
import { openModalDetailState } from '@/store/common'
import { formatDate, isPermissionUpdate, t } from '@/utils'
import { fieldRequired, nameFieldValidation } from '@/utils/validator'
import { Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { submitCreateProvinceApi, submitUpdateProvinceApi } from '../api'
import { getRegionListOptionState, provinceActiveState } from '../store'

type ValuesType = {
  title: string
  regionId: string | number
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Props
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [provinceActive, setProvinceActive] = useRecoilState(provinceActiveState)

  // Recoil
  const regionListOptions = useRecoilValue(getRegionListOptionState)

  const defaultValues: ValuesType = {
    regionId: provinceActive?.region?.id ?? '',
    title: provinceActive?.title ?? '',
    createdAt: formatDate(provinceActive?.createdAt as string) ?? '',
    updatedAt: formatDate(provinceActive?.updatedAt as string) ?? '',
  }

  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setProvinceActive(null)
    formContext.reset()
  }

  const onHandleSubmit = (data: ValuesType) => {
    if (provinceActive && provinceActive?.id > 0) {
      const provinceId = provinceActive && provinceActive?.id > 0 ? provinceActive?.id : 0
      submitUpdateProvinceApi(data, handleClose, provinceId)
    } else {
      submitCreateProvinceApi(data, handleClose)
    }
  }

  useEffect(() => {
    formContext.setValue('title', provinceActive?.title ?? '')
    formContext.setValue('regionId', provinceActive?.region?.id ?? '')
    formContext.setValue('createdAt', formatDate(provinceActive?.createdAt as string) ?? '')
    formContext.setValue('updatedAt', formatDate(provinceActive?.updatedAt as string) ?? '')
  }, [openModalDetail])

  useEffect(() => {
    getRegionData()
  }, [openModalDetail])

  return (
    <MainModal
      open={openModalDetail}
      title={
        provinceActive && provinceActive?.id > 0
          ? t('provinceModalUpdate')
          : t('provinceModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2}>
          <SelectField
            name="regionId"
            label={t('provinceSelectRegionFieldLabel')}
            required
            placeholder={t('provinceSelectRegionFieldPlaceholder')}
            options={regionListOptions}
            validation={fieldRequired(t('provinceRegionRequiredValidation'))}
            disabled={
              provinceActive ? (isPermissionUpdate('provinces_update') ? false : true) : false
            }
          />
          <InputField
            name={'title'}
            required
            label={t('provinceNameFieldLabel')}
            placeholder={t('provinceNameFieldPlaceholder')}
            validation={nameFieldValidation()}
            disabled={
              provinceActive ? (isPermissionUpdate('provinces_update') ? false : true) : false
            }
          />

          {provinceActive && provinceActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <Stack pt={2.5} direction="row" spacing={2} justifyContent="flex-end">
          <ButtonBase btnText={t('provinceBtnClose')} handleClick={handleClose} />

          {provinceActive ? (
            <React.Fragment>
              {isPermissionUpdate('provinces_update') && (
                <ButtonSubmit btnText={t('provinceBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('provinceBtnSubmit')} type="submit" />
          )}
        </Stack>
      </FormContainer>
    </MainModal>
  )
}
