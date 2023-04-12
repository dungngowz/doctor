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
import { submitCreateSaleFormApi, submitUpdateSaleFormApi } from '../api'
import { saleFormActiveState } from '../store'

type ValuesType = {
  title: string
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [saleFormActive, setSaleFormActive] = useRecoilState(saleFormActiveState)

  // Initial values
  const defaultValues: ValuesType = {
    title: saleFormActive?.title ?? '',
    createdAt: formatDate(saleFormActive?.createdAt as string) ?? '',
    updatedAt: formatDate(saleFormActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setSaleFormActive(null)
    setRecoil(saleFormActiveState, null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    if (saleFormActive && saleFormActive?.id > 0) {
      const saleFormActiveId = saleFormActive && saleFormActive?.id > 0 ? saleFormActive?.id : 0
      submitUpdateSaleFormApi(data, saleFormActiveId, handleClose)
    } else {
      submitCreateSaleFormApi(data, () => {
        handleClose()
      })
    }
  }

  return (
    <MainModal
      open={openModalDetail}
      title={
        saleFormActive && saleFormActive?.id > 0
          ? t('saleFormModalUpdate')
          : t('saleFormModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack pb={9} spacing={2}>
          <InputField
            name="title"
            required
            label={t('saleFormTitleFieldLabel')}
            placeholder={t('saleFormTitleFieldPlaceholder')}
            validation={nameFieldValidation()}
            disabled={
              saleFormActive ? (isPermissionUpdate('sales_forms_update') ? false : true) : false
            }
          />

          {saleFormActive && saleFormActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('saleFormBtnClose')} handleClick={handleClose} />

          {saleFormActive ? (
            <React.Fragment>
              {isPermissionUpdate('sales_forms_update') && (
                <ButtonSubmit btnText={t('saleFormBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('saleFormBtnSubmit')} type="submit" />
          )}
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
