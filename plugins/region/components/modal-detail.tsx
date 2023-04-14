import { ButtonBase, ButtonSubmit, InputField, MainModal } from '@/components'
import { openModalDetailState } from '@/store/common'
import { formatDate, isPermissionUpdate, t } from '@/utils'
import { nameFieldValidation } from '@/utils/validator'
import { Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState } from 'recoil'
import { submitCreateRegion, submitUpdateRegion } from '../api'
import { regionActiveState } from '../store'

type ValuesType = {
  title: string
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Props
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [regionActive, setRegionActive] = useRecoilState(regionActiveState)

  // DefaultValues
  const defaultValues: ValuesType = {
    title: regionActive?.title ?? '',
    createdAt: formatDate(regionActive?.createdAt as string) ?? '',
    updatedAt: formatDate(regionActive?.updatedAt as string) ?? '',
  }

  // FormContext
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setRegionActive(null)
    formContext.reset()
  }

  const onHandleSubmit = (data: ValuesType) => {
    if (regionActive && regionActive?.id > 0) {
      const regionId = regionActive && regionActive?.id > 0 ? regionActive?.id : 0
      submitUpdateRegion(data, handleClose, regionId)
    } else {
      submitCreateRegion(data, handleClose)
    }
  }

  useEffect(() => {
    formContext.setValue('title', regionActive?.title ?? '')
    formContext.setValue('createdAt', formatDate(regionActive?.createdAt as string) ?? '')
    formContext.setValue('updatedAt', formatDate(regionActive?.updatedAt as string) ?? '')
  }, [openModalDetail])

  return (
    <MainModal
      open={openModalDetail}
      title={regionActive && regionActive?.id > 0 ? t('regionModalUpdate') : t('regionModalCreate')}
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2}>
          <InputField
            name={'title'}
            required
            label={t('regionNameFieldLabel')}
            placeholder={t('regionNameFieldPlaceholder')}
            validation={nameFieldValidation()}
            disabled={regionActive ? (isPermissionUpdate('regions_update') ? false : true) : false}
          />

          {regionActive && regionActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <Stack pt={'25px'} direction="row" spacing={2} justifyContent="flex-end">
          <ButtonBase btnText={t('regionBtnClose')} handleClick={handleClose} />

          {regionActive ? (
            <React.Fragment>
              {isPermissionUpdate('regions_update') && (
                <ButtonSubmit btnText={t('regionBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('regionBtnSubmit')} type="submit" />
          )}
        </Stack>
      </FormContainer>
    </MainModal>
  )
}
