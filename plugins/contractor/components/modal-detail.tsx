import {
  BasicCard,
  ButtonBase,
  ButtonSubmit,
  InputField,
  MainModal,
  ModalAction,
  SelectField,
} from '@/components'
import { openModalDetailState } from '@/store/common'
import { customerTypeOptionsState, staffOptionsState } from '@/store/meta'
import { formatDate, isPermissionUpdate, t } from '@/utils'
import {
  addressFieldValidation,
  codeFieldValidation,
  emailValidation,
  fieldRequired,
  nameFieldValidation,
  phoneFieldValidation,
} from '@/utils/validator'
import { Stack } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { submitCreateContractorApi, submitUpdateContractorApi } from '../api'
import { contractorActiveState } from '../store'

type ValuesType = {
  name: string
  code: string | number
  staffId: string | number
  customerTypeId: number

  address: string
  taxCode: string
  email: string

  nameContact: string
  phoneContact: string
  positionContact: string
  emailContact: string

  nameContactSub: string
  phoneContactSub: string
  emailContactSub: string
  positionContactSub: string

  memo: string

  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [contractorActive, setContractorActive] = useRecoilState(contractorActiveState)
  // Options
  const investorStaffOptions = useRecoilValue(staffOptionsState)
  const customerTypeOptions = useRecoilValue(customerTypeOptionsState)

  // Initial values
  const defaultValues: ValuesType = {
    code: contractorActive?.code ?? '',
    name: contractorActive?.name ?? '',
    staffId: contractorActive?.staff.id ?? '',
    customerTypeId: contractorActive?.customerType.id ?? 0,
    address: contractorActive?.address ?? '',
    taxCode: contractorActive?.taxCode ?? '',
    email: contractorActive?.email ?? '',

    nameContact: contractorActive?.nameContact ?? '',
    phoneContact: contractorActive?.phoneContact ?? '',
    positionContact: contractorActive?.positionContact ?? '',
    emailContact: contractorActive?.emailContact ?? '',

    nameContactSub: contractorActive?.nameContactSub ?? '',
    phoneContactSub: contractorActive?.phoneContactSub ?? '',
    emailContactSub: contractorActive?.emailContactSub ?? '',
    positionContactSub: contractorActive?.positionContactSub ?? '',

    memo: contractorActive?.memo ?? '',

    createdAt: formatDate(contractorActive?.createdAt as string) ?? '',
    updatedAt: formatDate(contractorActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setContractorActive(null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    if (contractorActive && contractorActive?.id > 0) {
      const contractorActiveId =
        contractorActive && contractorActive?.id > 0 ? contractorActive?.id : 0
      submitUpdateContractorApi(data, contractorActiveId, handleClose)
    } else {
      submitCreateContractorApi(data, () => {
        handleClose()
      })
    }
  }

  return (
    <MainModal
      open={openModalDetail}
      maxWidth="sm"
      title={
        contractorActive && contractorActive?.id > 0
          ? t('contractorModalUpdate')
          : t('contractorModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} width="100%" pb={10}>
          <BasicCard title={t('contractorInfoCustomerLabel')}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField
                name={'code'}
                required
                label={t('contractorCodeFieldLabel')}
                placeholder={t('contractorCodeFieldPlaceholder')}
                validation={codeFieldValidation(
                  t('contractorCodeRequiredValidation'),
                  t('contractorCodeMaxLengthValidation')
                )}
                disabled={
                  contractorActive
                    ? isPermissionUpdate('contractors_update')
                      ? false
                      : true
                    : false
                }
              />
              <InputField
                name={'name'}
                required
                label={t('contractorNameFieldLabel')}
                placeholder={t('contractorNameFieldPlaceholder')}
                validation={nameFieldValidation(
                  t('contractorNameRequiredValidation'),
                  t('contractorMaxLengthValidation')
                )}
                disabled={
                  contractorActive
                    ? isPermissionUpdate('contractors_update')
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
                label={t('contractorTaxCodeFieldLabel')}
                placeholder={t('contractorTaxCodeFieldPlaceholder')}
                validation={codeFieldValidation(
                  t('contractorTaxCodeRequiredValidation'),
                  t('contractorTaxCodeMaxLengthValidation')
                )}
                disabled={
                  contractorActive
                    ? isPermissionUpdate('contractors_update')
                      ? false
                      : true
                    : false
                }
              />
              <InputField
                name={'email'}
                required
                label={t('contractorEmailFieldLabel')}
                placeholder={t('contractorEmailFieldPlaceholder')}
                validation={emailValidation(t('contractorEmailRequiredValidation'))}
                disabled={
                  contractorActive
                    ? isPermissionUpdate('contractors_update')
                      ? false
                      : true
                    : false
                }
              />
            </Stack>
            <InputField
              name={'address'}
              required
              label={t('contractorAddressFieldLabel')}
              placeholder={t('contractorAddressFieldPlaceholder')}
              validation={addressFieldValidation()}
              disabled={
                contractorActive ? (isPermissionUpdate('contractors_update') ? false : true) : false
              }
            />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <SelectField
                name="staffId"
                label={t('contractorStaffSelectLabel')}
                required
                placeholder={t('contractorStaffSelectPlaceholder')}
                validation={fieldRequired(t('contractorStaffSelectRequiredValidation'))}
                options={investorStaffOptions}
                disabled={
                  contractorActive
                    ? isPermissionUpdate('contractors_update')
                      ? false
                      : true
                    : false
                }
              />
              <SelectField
                name="customerTypeId"
                label={t('contractorCustomerTypeIdSelectLabel')}
                required
                placeholder={t('contractorCustomerTypeIdSelectPlaceholder')}
                validation={fieldRequired(t('contractorCustomerTypeIdSelectRequiredValidation'))}
                options={customerTypeOptions}
                disabled={
                  contractorActive
                    ? isPermissionUpdate('contractors_update')
                      ? false
                      : true
                    : false
                }
              />
            </Stack>
          </BasicCard>

          <BasicCard title={t('contractorContactLabel')}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField
                name={'nameContact'}
                required
                label={t('contractorNameContactFieldLabel')}
                placeholder={t('contractorNameContactFieldPlaceholder')}
                validation={nameFieldValidation(
                  t('contractorNameContactRequiredValidation'),
                  t('contractorNameContactMaxLengthValidation')
                )}
                disabled={
                  contractorActive
                    ? isPermissionUpdate('contractors_update')
                      ? false
                      : true
                    : false
                }
              />
              <InputField
                name={'emailContact'}
                required
                label={t('contractorEmailContactFieldLabel')}
                placeholder={t('contractorEmailContactFieldPlaceholder')}
                validation={emailValidation()}
                disabled={
                  contractorActive
                    ? isPermissionUpdate('contractors_update')
                      ? false
                      : true
                    : false
                }
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField
                name={'phoneContact'}
                required
                label={t('contractorPhoneContactFieldLabel')}
                placeholder={t('contractorPhoneContactFieldPlaceholder')}
                validation={phoneFieldValidation(
                  true,
                  t('contractorPhoneContactRequiredValidation')
                )}
                disabled={
                  contractorActive
                    ? isPermissionUpdate('contractors_update')
                      ? false
                      : true
                    : false
                }
              />

              <InputField
                name={'positionContact'}
                required
                label={t('contractorPositionContactFieldLabel')}
                placeholder={t('contractorPositionContactFieldPlaceholder')}
                validation={nameFieldValidation(
                  t('contractorPositionContactRequiredValidation'),
                  t('contractorPositionContactMaxLengthValidation')
                )}
                disabled={
                  contractorActive
                    ? isPermissionUpdate('contractors_update')
                      ? false
                      : true
                    : false
                }
              />
            </Stack>
          </BasicCard>

          <BasicCard title={t('contractorContactSubLabel')}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField
                name={'nameContactSub'}
                label={t('contractorNameContactFieldLabel')}
                placeholder={t('contractorNameContactFieldPlaceholder')}
                validation={nameFieldValidation(
                  t('contractorNameContactRequiredValidation'),
                  t('contractorNameContactMaxLengthValidation'),
                  255,
                  false
                )}
                disabled={
                  contractorActive
                    ? isPermissionUpdate('contractors_update')
                      ? false
                      : true
                    : false
                }
              />

              <InputField
                name={'emailContactSub'}
                label={t('contractorEmailContactFieldLabel')}
                placeholder={t('contractorEmailContactFieldPlaceholder')}
                validation={emailValidation(
                  t('contractorEmailContactRequiredValidation'),
                  t('contractorEmailContactMaxLengthValidation'),
                  255,
                  false
                )}
                disabled={
                  contractorActive
                    ? isPermissionUpdate('contractors_update')
                      ? false
                      : true
                    : false
                }
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField
                name={'phoneContactSub'}
                label={t('contractorPhoneContactFieldLabel')}
                placeholder={t('contractorPhoneContactFieldPlaceholder')}
                validation={phoneFieldValidation(false)}
                disabled={
                  contractorActive
                    ? isPermissionUpdate('contractors_update')
                      ? false
                      : true
                    : false
                }
              />

              <InputField
                name={'positionContactSub'}
                label={t('contractorPositionContactFieldLabel')}
                placeholder={t('contractorPositionContactFieldPlaceholder')}
                disabled={
                  contractorActive
                    ? isPermissionUpdate('contractors_update')
                      ? false
                      : true
                    : false
                }
              />
            </Stack>
          </BasicCard>

          <InputField
            name={'memo'}
            label={t('contractorMemoFieldLabel')}
            placeholder={t('contractorMemoFieldPlaceholder')}
            rows={3}
            disabled={
              contractorActive ? (isPermissionUpdate('contractors_update') ? false : true) : false
            }
          />

          {contractorActive && contractorActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('contractorBtnClose')} handleClick={handleClose} />

          {contractorActive ? (
            <React.Fragment>
              {isPermissionUpdate('contractors_update') && (
                <ButtonSubmit btnText={t('contractorBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('contractorBtnSubmit')} type="submit" />
          )}
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
