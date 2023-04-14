import {
  BasicCard,
  ButtonBase,
  ButtonSubmit,
  InputField,
  MainModal,
  ModalAction,
  SelectField,
} from '@/components'
import { getAllDistrictOptionsApi, getAllProvinceOptionsApi } from '@/meta/common'
import { openModalDetailState } from '@/store/common'
import {
  districtOptionsState,
  investorTypeOptionsState,
  provinceOptionsState,
  staffOptionsState,
} from '@/store/meta'
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
import React, { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { submitCreateInvestorApi, submitUpdateInvestorApi } from '../api'
import { investorActiveState } from '../store'

type ValuesType = {
  code: string
  name: string
  address: string
  nameContact: string
  phoneContact: string
  emailContact: string
  positionContact: string
  memo: string
  provinceId: string | number
  districtId: string | number
  investorTypeId: string | number
  staffId: string | number
  nameContactSub: string
  phoneContactSub: string
  emailContactSub: string
  positionContactSub: string
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [investorActive, setInvestorActive] = useRecoilState(investorActiveState)
  const investorTypeOptions = useRecoilValue(investorTypeOptionsState)
  const investorStaffOptions = useRecoilValue(staffOptionsState)
  const districtOptions = useRecoilValue(districtOptionsState)
  const provinceOptions = useRecoilValue(provinceOptionsState)

  // Initial values
  const defaultValues: ValuesType = {
    code: investorActive?.code ?? '',
    name: investorActive?.name ?? '',
    address: investorActive?.address ?? '',
    nameContact: investorActive?.nameContact ?? '',
    phoneContact: investorActive?.phoneContact ?? '',
    emailContact: investorActive?.emailContact ?? '',
    positionContact: investorActive?.positionContact ?? '',
    memo: investorActive?.memo ?? '',
    districtId: investorActive?.district?.id ?? '',
    provinceId: investorActive?.province?.id ?? '',
    investorTypeId: investorActive?.investorType?.id ?? '',
    staffId: investorActive?.staff?.id ?? '',
    nameContactSub: investorActive?.nameContactSub ?? '',
    phoneContactSub: investorActive?.phoneContactSub ?? '',
    emailContactSub: investorActive?.emailContactSub ?? '',
    positionContactSub: investorActive?.positionContactSub ?? '',
    createdAt: formatDate(investorActive?.createdAt as string) ?? '',
    updatedAt: formatDate(investorActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  const { control, setValue } = formContext

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setInvestorActive(null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    if (investorActive && investorActive?.id > 0) {
      const investorActiveId = investorActive && investorActive?.id > 0 ? investorActive?.id : 0
      submitUpdateInvestorApi(data, investorActiveId, handleClose)
    } else {
      submitCreateInvestorApi(data, () => {
        handleClose()
      })
    }
  }

  useEffect(() => {
    getAllProvinceOptionsApi()
  }, [])

  // Watch province Change
  const provinceId = useWatch({ control, name: 'provinceId' })

  // Filter by provinceId
  useEffect(() => {
    const filterProvinceParam = {
      provinceId: provinceId ?? 0,
    }

    getAllDistrictOptionsApi(filterProvinceParam)
  }, [provinceId])

  // Set default district when filter by provinceId
  useEffect(() => {
    if (provinceId != 0 && districtOptions?.length > 0) {
      setValue('districtId', districtOptions[0]?.id)
    }
    if (!provinceId) {
      setValue('districtId', '')
    }
  }, [provinceId, districtOptions])

  return (
    <MainModal
      open={openModalDetail}
      maxWidth="sm"
      title={
        investorActive && investorActive?.id > 0
          ? t('investorModalUpdate')
          : t('investorModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} width="100%" pb={9}>
          <BasicCard title={t('investorInfoLabel')}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField
                name={'code'}
                required
                label={t('investorCodeFieldLabel')}
                placeholder={t('investorCodeFieldPlaceholder')}
                validation={codeFieldValidation(
                  t('investorCodeRequiredValidation'),
                  t('investorCodeMaxLengthValidation')
                )}
                disabled={
                  investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
                }
              />

              <InputField
                name={'name'}
                required
                label={t('investorNameFieldLabel')}
                placeholder={t('investorNameFieldPlaceholder')}
                validation={nameFieldValidation(
                  t('investorNameRequiredValidation'),
                  t('investorNameMaxLengthValidation')
                )}
                disabled={
                  investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
                }
              />
            </Stack>

            <InputField
              name={'address'}
              required
              label={t('investorAddressFieldLabel')}
              placeholder={t('investorAddressFieldPlaceholder')}
              validation={addressFieldValidation(
                t('investorAddressRequiredValidation'),
                t('investorAddressMaxLengthValidation')
              )}
              disabled={
                investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
              }
            />
          </BasicCard>

          {/* Investor Contact  */}
          <BasicCard title={t('investorContactLabel')}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField
                name={'nameContact'}
                required
                label={t('investorNameContactFieldLabel')}
                placeholder={t('investorNameContactFieldPlaceholder')}
                validation={nameFieldValidation(
                  t('investorNameContactRequiredValidation'),
                  t('investorNameContactMaxLengthValidation')
                )}
                disabled={
                  investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
                }
              />

              <InputField
                name={'emailContact'}
                required
                label={t('investorEmailContactFieldLabel')}
                placeholder={t('investorEmailContactFieldPlaceholder')}
                validation={emailValidation(t('investorEmailContactRequiredValidation'))}
                disabled={
                  investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
                }
              />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField
                name={'phoneContact'}
                required
                label={t('investorPhoneContactFieldLabel')}
                placeholder={t('investorPhoneContactFieldPlaceholder')}
                validation={phoneFieldValidation(
                  true,
                  t('investorPhoneContactRequiredValidation'),
                  t('investorPhoneContactMaxLengthValidation')
                )}
                disabled={
                  investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
                }
              />
              <InputField
                name={'positionContact'}
                label={t('investorPositionContactFieldLabel')}
                placeholder={t('investorPositionContactFieldPlaceholder')}
                required
                validation={nameFieldValidation(t('investorPositionContactRequiredValidation'))}
                disabled={
                  investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
                }
              />
            </Stack>
          </BasicCard>

          {/* Investor Contact Sub  */}
          <BasicCard title={t('investorContactLabelSub')}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField
                name={'nameContactSub'}
                label={t('investorNameContactFieldLabel')}
                placeholder={t('investorNameContactFieldPlaceholder')}
                validation={nameFieldValidation(
                  t('investorNameContactRequiredValidation'),
                  t('investorNameContactMaxLengthValidation'),
                  255,
                  false
                )}
                disabled={
                  investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
                }
              />

              <InputField
                name={'emailContactSub'}
                label={t('investorEmailContactFieldLabel')}
                placeholder={t('investorEmailContactFieldPlaceholder')}
                validation={emailValidation(
                  t('investorEmailContactRequiredValidation'),
                  t('emailMaxLengthRule'),
                  255,
                  false
                )}
                disabled={
                  investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
                }
              />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField
                name={'phoneContactSub'}
                label={t('investorPhoneContactFieldLabel')}
                placeholder={t('investorPhoneContactFieldPlaceholder')}
                validation={phoneFieldValidation(
                  false,
                  t('investorPhoneContactRequiredValidation'),
                  t('investorPhoneContactMaxLengthValidation')
                )}
                disabled={
                  investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
                }
              />
              <InputField
                name={'positionContactSub'}
                label={t('investorPositionContactFieldLabel')}
                placeholder={t('investorPositionContactFieldPlaceholder')}
                disabled={
                  investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
                }
              />
            </Stack>
          </BasicCard>

          <BasicCard title={t('investorAreaLabel')}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <SelectField
                name="provinceId"
                label={t('investorProvinceSelectLabel')}
                required
                placeholder={t('investorProvinceSelectPlaceholder')}
                options={provinceOptions}
                validation={nameFieldValidation(t('investorProvinceSelectRequiredValidation'))}
                disabled={
                  investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
                }
              />
              <SelectField
                name="districtId"
                label={t('investorDistrictSelectLabel')}
                placeholder={t('investorDistrictSelectPlaceholder')}
                options={districtOptions}
                disabled={
                  investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
                }
              />
            </Stack>
          </BasicCard>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <SelectField
              name="staffId"
              label={t('investorStaffSelectLabel')}
              required
              placeholder={t('investorStaffSelectPlaceholder')}
              validation={fieldRequired(t('investorStaffSelectRequiredValidation'))}
              options={investorStaffOptions}
              disabled={
                investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
              }
            />

            <SelectField
              name="investorTypeId"
              required
              label={t('investorTypeFieldLabel')}
              placeholder={t('investorTypeFieldPlaceholder')}
              options={investorTypeOptions}
              validation={nameFieldValidation(t('investorTypeRequiredValidation'))}
              disabled={
                investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
              }
            />
          </Stack>

          <InputField
            name="memo"
            label={t('investorMemoFieldLabel')}
            placeholder={t('investorMemoPlaceholder')}
            rows={3}
            disabled={
              investorActive ? (isPermissionUpdate('investors_update') ? false : true) : false
            }
          />
          {investorActive && investorActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('investorBtnClose')} handleClick={handleClose} />

          {investorActive ? (
            <React.Fragment>
              {isPermissionUpdate('investors_update') && (
                <ButtonSubmit btnText={t('investorBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('investorBtnSubmit')} type="submit" />
          )}
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
