import {
  ButtonBase,
  ButtonSubmit,
  InputField,
  MainModal,
  ModalAction,
  SelectField,
} from '@/components'
import { brand } from '@/components/colors/brand'
import { getAllDepartmentsOptionsApi } from '@/meta/common'
import { openModalDetailState } from '@/store/common'
import { departmentOptionsState } from '@/store/meta'
import { formatDate, isPermissionUpdate, t } from '@/utils'
import { nameFieldValidation } from '@/utils/validator'
import { Checkbox, Divider, FormControlLabel, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { submitCreateDepartmentApi, submitUpdateDepartmentApi } from '../api'
import {
  departmentActiveState,
  departmentPermissionsState,
  departmentTotalPermissionsState,
} from '../store'

type ValuesType = {
  label: string
  permissions: string[]
  roleChildId: any
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [departmentActive, setDepartmentActive] = useRecoilState(departmentActiveState)
  const departmentPermissions = useRecoilValue(departmentPermissionsState)
  const departmentOptions = useRecoilValue(departmentOptionsState)

  const [currentPermissionsSelected, setCurrentPermissionsSelected] = useState<string[]>([])
  const totalPermissions = useRecoilValue(departmentTotalPermissionsState)

  // Initial values
  const defaultValues: ValuesType = {
    label: departmentActive?.label ?? '',
    permissions: departmentActive?.permissions ?? [],
    roleChildId: departmentActive?.roleChildId ?? null,
    createdAt: formatDate(departmentActive?.createdAt as string) ?? '',
    updatedAt: formatDate(departmentActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setDepartmentActive(null)
    setRecoil(departmentActiveState, null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    data.permissions = currentPermissionsSelected

    if (departmentActive && departmentActive?.id > 0) {
      const departmentActiveId =
        departmentActive && departmentActive?.id > 0 ? departmentActive?.id : 0
      submitUpdateDepartmentApi(data, departmentActiveId, handleClose)
    } else {
      submitCreateDepartmentApi(data, () => {
        handleClose()
      })
    }
    // router.reload()
  }

  // On handle check permissions
  const handleCheckPermissions = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    value: string,
    id: number
  ) => {
    if (checked) {
      setCurrentPermissionsSelected((prevValue: string[]) => {
        return [...prevValue, value]
      })
    } else {
      setCurrentPermissionsSelected((prevValue: string[]) => {
        return prevValue.filter((item) => item != value)
      })
    }
  }

  // Query all permissions
  const departmentPermissionsQueryAll = departmentPermissions.map((obj) => {
    const permissionsArr = obj.permissions
    const permissionsValueArray = permissionsArr.map((o) => o.value)

    return permissionsValueArray
  })

  const permissionsFlat = departmentPermissionsQueryAll.flat(2)

  // On check all
  const handleCheckAllPermissions = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    if (checked) {
      setCurrentPermissionsSelected(permissionsFlat)
    } else {
      setCurrentPermissionsSelected([])
    }
  }

  useEffect(() => {
    if (departmentActive) {
      setCurrentPermissionsSelected(departmentActive?.permissions)
    }
  }, [departmentActive])

  useEffect(() => {
    getAllDepartmentsOptionsApi()
  }, [])

  return (
    <MainModal
      open={openModalDetail}
      fullWidth={false}
      title={
        departmentActive && departmentActive?.id > 0
          ? t('departmentModalUpdate')
          : t('departmentModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack pb={9} spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <InputField
              name="label"
              required
              label={t('departmentLabelFieldLabel')}
              placeholder={t('departmentLabelPlaceholder')}
              validation={nameFieldValidation()}
              disabled={
                departmentActive ? (isPermissionUpdate('departments_update') ? false : true) : false
              }
            />

            <SelectField
              name="roleChildId"
              label={t('Được phép quản lý nhân viên tại chức vụ')}
              placeholder="--------"
              options={departmentOptions}
            />
          </Stack>

          <Typography fontWeight={600} fontSize={'13px'} mb={'-6px !important'}>
            {t('departmentRuleLabel')}
          </Typography>

          <Stack
            spacing={2}
            border={1}
            borderColor={brand.gray200}
            px={2}
            py={2}
            borderRadius={'10px'}
            width={'100%'}
            className="department-rules"
          >
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <Typography
                width={'100%'}
                maxWidth={220}
                flexShrink={0}
                fontSize={'13px'}
                fontWeight={600}
                color={brand.gray700}
              >
                {t('departmentFullPermissionLabel')}
              </Typography>
              <FormControlLabel
                control={
                  departmentActive ? (
                    <Checkbox
                      disabled={
                        departmentActive
                          ? isPermissionUpdate('departments_update')
                            ? false
                            : true
                          : false
                      }
                      onChange={handleCheckAllPermissions}
                      checked={
                        departmentActive && totalPermissions == currentPermissionsSelected.length
                          ? true
                          : false
                      }
                    />
                  ) : (
                    <Checkbox onChange={handleCheckAllPermissions} />
                  )
                }
                label={t('departmentSelectAllLabel')}
              />
            </Stack>
            <Divider sx={{ borderStyle: 'dashed', borderColor: brand.gray300 }} />

            {departmentPermissions?.map((item, index) => (
              <React.Fragment key={index}>
                <Stack direction={'row'} alignItems={'center'} pr={16} flexShrink={0}>
                  <Typography
                    width={'100%'}
                    maxWidth={240}
                    flexShrink={0}
                    fontSize={'13px'}
                    fontWeight={600}
                    color={brand.gray700}
                  >
                    {item?.label}
                  </Typography>
                  <Stack direction={'row'} spacing={2} flexShrink={0}>
                    {item?.permissions.map((permission, id) => (
                      <Stack key={id} direction={'row'} spacing={3} alignItems={'center'}>
                        <FormControlLabel
                          key={id}
                          control={
                            <Checkbox
                              id={permission?.value}
                              checked={currentPermissionsSelected?.includes(permission.value)}
                              onChange={(e, checked) =>
                                handleCheckPermissions(e, checked, permission?.value, id)
                              }
                              disabled={
                                departmentActive
                                  ? isPermissionUpdate('departments_update')
                                    ? false
                                    : true
                                  : false
                              }
                            />
                          }
                          label={permission?.label}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Stack>

                {departmentPermissions?.length >= index + 2 && (
                  <Divider sx={{ borderStyle: 'dashed', borderColor: brand.gray300 }} />
                )}
              </React.Fragment>
            ))}
          </Stack>

          {departmentActive && departmentActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('departmentBtnClose')} handleClick={handleClose} />

          {departmentActive ? (
            <React.Fragment>
              {isPermissionUpdate('departments_update') && (
                <ButtonSubmit btnText={t('departmentBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('departmentBtnSubmit')} type="submit" />
          )}
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
