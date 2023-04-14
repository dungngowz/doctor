import {
  ButtonBase,
  ButtonSubmit,
  DatePicker,
  InputField,
  InputPasswordField,
  MainModal,
  ModalAction,
  SelectField,
} from '@/components'
import { getAllStationOptionsApi } from '@/meta/common'
import { openModalDetailState } from '@/store/common'
import {
  departmentChildOptionsState,
  departmentOptionsState,
  stationOptionsState,
} from '@/store/meta'
import { userState } from '@/store/user'
import { formatDate, isPermissionUpdate, isPermissionView, t } from '@/utils'
import {
  addressFieldValidation,
  codeFieldValidation,
  emailValidation,
  fieldRequired,
  nameFieldValidation,
  passwordValidation,
  phoneFieldValidation,
} from '@/utils/validator'
import { Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { submitCreateStaffApi, submitUpdateStaffApi } from '../api'
import { staffActiveState } from '../store'

type ValuesType = {
  departmentId: number | string
  name: string
  code: string
  email: string
  phone: string | number
  password: string
  address: string
  startWork: string
  endWork: string
  stationId: any
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [staffActive, setStaffActive] = useRecoilState(staffActiveState)
  const departmentOptions = useRecoilValue(departmentOptionsState)
  const departmentChildOptions = useRecoilValue(departmentChildOptionsState)
  const stationOptions = useRecoilValue(stationOptionsState)
  const user = useRecoilValue(userState)

  // Initial values
  const defaultValues: ValuesType = {
    departmentId: staffActive?.department?.id ?? '',
    code: staffActive?.code ?? '',
    name: staffActive?.name ?? '',
    phone: staffActive?.phone ?? '',
    email: staffActive?.email ?? '',
    address: staffActive?.address ?? '',
    password: staffActive?.password ?? '',
    stationId: staffActive?.station?.id ?? '',
    startWork: staffActive?.startWork ?? '',
    endWork: staffActive?.endWork ?? '',
    createdAt: formatDate(staffActive?.createdAt as string) ?? '',
    updatedAt: formatDate(staffActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  const { setValue, control, getValues } = formContext

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setStaffActive(null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    data.startWork = formatDate(data.startWork, 'YYYY-MM-DD ')
    data.endWork = formatDate(data.endWork, 'YYYY-MM-DD ')

    if (staffActive && staffActive?.id > 0) {
      const staffActiveId = staffActive && staffActive?.id > 0 ? staffActive?.id : 0
      submitUpdateStaffApi(data, staffActiveId, handleClose)
    } else {
      submitCreateStaffApi(data, () => {
        handleClose()
        formContext.reset()
      })
    }
  }

  // Set value departmentId
  useEffect(() => {
    if (user && !staffActive) {
      if (user.roleChildIds.length > 0) {
        // setValue('departmentId', user.roleChildId)
      } else {
        setValue('departmentId', user.department.id)
      }
    }
  }, [user])

  useEffect(() => {
    getAllStationOptionsApi()
  }, [])

  return (
    <MainModal
      open={openModalDetail}
      title={staffActive && staffActive?.id > 0 ? t('staffModalUpdate') : t('staffModalCreate')}
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} width="100%" pb={10}>
          {user.id == 1 && isPermissionView('departments_view') ? (
            <SelectField
              name="departmentId"
              label={t('staffDepartmentSelectLabel')}
              required
              placeholder={t('staffDepartmentSelectPlaceholder')}
              validation={fieldRequired(t('staffDepartmentSelectRequiredValidation'))}
              options={departmentOptions}
              disabled={staffActive ? (isPermissionUpdate('staffs_update') ? false : true) : false}
            />
          ) : (
            <>
              {user?.roleChildIds.length > 0 ? (
                <SelectField
                  name="departmentId"
                  label={t('staffDepartmentSelectLabel')}
                  placeholder={t('staffDepartmentSelectPlaceholder')}
                  options={departmentChildOptions}
                />
              ) : (
                <SelectField
                  name="departmentId"
                  label={t('staffDepartmentSelectLabel')}
                  placeholder={t('staffDepartmentSelectPlaceholder')}
                  options={departmentOptions}
                  disabled
                />
              )}
            </>
          )}

          <InputField
            name={'code'}
            required
            label={t('staffCodeFieldLabel')}
            placeholder={t('staffCodeFieldPlaceholder')}
            validation={codeFieldValidation(
              t('staffCodeRequiredValidation'),
              t('staffCodeMaxLengthValidation')
            )}
            disabled={staffActive ? (isPermissionUpdate('staffs_update') ? false : true) : false}
          />

          <InputField
            name={'name'}
            required
            label={t('staffNameFieldLabel')}
            placeholder={t('staffNameFieldPlaceholder')}
            validation={nameFieldValidation(
              t('staffNameRequiredValidation'),
              t('staffNameMaxLengthValidation')
            )}
            disabled={staffActive ? (isPermissionUpdate('staffs_update') ? false : true) : false}
          />

          <InputField
            name={'phone'}
            required
            label={t('staffPhoneFieldLabel')}
            placeholder={t('staffPhoneFieldPlaceholder')}
            validation={phoneFieldValidation(
              true,
              t('staffPhoneRequiredValidation'),
              t('staffPhoneMaxLengthValidation')
            )}
            disabled={staffActive ? (isPermissionUpdate('staffs_update') ? false : true) : false}
          />

          <InputField
            name={'email'}
            label={t('staffEmailFieldLabel')}
            placeholder={t('staffEmailFieldPlaceholder')}
            validation={emailValidation('', t('staffEmailMaxLengthValidation'), 255, false)}
            disabled={staffActive ? (isPermissionUpdate('staffs_update') ? false : true) : false}
          />

          <InputPasswordField
            name={'password'}
            required={staffActive && staffActive?.id > 0 ? false : true}
            label={t('staffPasswordFieldLabel')}
            validation={staffActive && staffActive?.id > 0 ? {} : passwordValidation()}
            disabled={staffActive ? (isPermissionUpdate('staffs_update') ? false : true) : false}
          />

          <InputField
            name={'address'}
            label={t('staffAddressFieldLabel')}
            placeholder={t('staffAddressFieldPlaceholder')}
            validation={addressFieldValidation(
              '',
              t('staffAddressMaxLengthValidation'),
              255,
              false
            )}
            disabled={staffActive ? (isPermissionUpdate('staffs_update') ? false : true) : false}
          />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <DatePicker
              name="startWork"
              label={t('staffStartWorkFieldLabel')}
              disabled={staffActive ? (isPermissionUpdate('staffs_update') ? false : true) : false}
            />
            <DatePicker
              name="endWork"
              label={t('staffEndWorkFieldLabel')}
              disabled={staffActive ? (isPermissionUpdate('staffs_update') ? false : true) : false}
            />
          </Stack>

          <SelectField
            name="stationId"
            label="Trạm cân"
            placeholder="Chọn trạm cân"
            options={stationOptions}
            disabled={staffActive ? (isPermissionUpdate('staffs_update') ? false : true) : false}
          />

          {staffActive && staffActive?.id > 0 && (
            <Stack direction={'row'} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('staffBtnClose')} handleClick={handleClose} />

          {staffActive ? (
            <React.Fragment>
              {isPermissionUpdate('staffs_update') && (
                <ButtonSubmit btnText={t('staffBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('staffBtnSubmit')} type="submit" />
          )}
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
