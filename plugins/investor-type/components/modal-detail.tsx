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
import { submitCreateInvestorTypeApi, submitUpdateInvestorTypeApi } from '../api'
import { investorTypeActiveState } from '../store'

type ValuesType = {
  title: string
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [investorTypeActive, setInvestorTypeActive] = useRecoilState(investorTypeActiveState)

  // Initial values
  const defaultValues: ValuesType = {
    title: investorTypeActive?.title ?? '',
    createdAt: formatDate(investorTypeActive?.createdAt as string) ?? '',
    updatedAt: formatDate(investorTypeActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setInvestorTypeActive(null)
    setRecoil(investorTypeActiveState, null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    if (investorTypeActive && investorTypeActive?.id > 0) {
      const investorTypeActiveId =
        investorTypeActive && investorTypeActive?.id > 0 ? investorTypeActive?.id : 0
      submitUpdateInvestorTypeApi(data, investorTypeActiveId, handleClose)
    } else {
      submitCreateInvestorTypeApi(data, () => {
        handleClose()
      })
    }
  }

  return (
    <MainModal
      open={openModalDetail}
      title={
        investorTypeActive && investorTypeActive?.id > 0
          ? t('investorTypeModalUpdate')
          : t('investorTypeModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack pb={9} spacing={2}>
          <InputField
            name="title"
            required
            label={t('investorTypeTitleFieldLabel')}
            placeholder={t('investorTypeTitlePlaceholder')}
            validation={nameFieldValidation()}
            disabled={
              investorTypeActive
                ? isPermissionUpdate('investor_types_update')
                  ? false
                  : true
                : false
            }
          />

          {investorTypeActive && investorTypeActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('investorTypeBtnClose')} handleClick={handleClose} />

          {investorTypeActive ? (
            <React.Fragment>
              {isPermissionUpdate('investor_types_update') && (
                <ButtonSubmit btnText={t('investorTypeBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('investorTypeBtnSubmit')} type="submit" />
          )}
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
