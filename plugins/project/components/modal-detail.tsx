import {
  BasicCard,
  ButtonAddNew,
  ButtonBase,
  ButtonSubmit,
  DatePicker,
  InputField,
  MainModal,
  ModalAction,
  NumericFieldController,
  SelectField,
} from '@/components'
import {
  getAllConstructionProgressesOptionsApi,
  getAllDistrictOptionsApi,
  getAllProductOptionsApi,
  getAllProvinceOptionsApi,
} from '@/meta/common'
import { openModalDetailState } from '@/store/common'
import {
  constructionProgressesOptionsState,
  contractorOptionsState,
  districtOptionsState,
  investorOptionsState,
  productOptionsState,
  provinceOptionsState,
} from '@/store/meta'
import { formatDate, isPermissionUpdate, t } from '@/utils'
import {
  codeFieldValidation,
  fieldRequired,
  nameFieldValidation,
  packageFieldValidation,
  priceFieldValidation,
} from '@/utils/validator'
import { Close } from '@mui/icons-material'
import { Box, IconButton, Stack, Tooltip } from '@mui/material'
import React, { useEffect } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { submitCreateProjectApi, submitUpdateProjectApi } from '../api'
import { projectActiveState } from '../store'
import { ProjectDetailsType, ProjectType } from '../type'

type ValuesType = {
  code: string
  name: string
  package: string
  districtId: string | number
  provinceId: string | number
  investorId: string | number
  contractorId: string | number
  createdAt: string
  updatedAt: string
  constructionProgressId: number | string
  projectContractorSubs: {
    contractorId: number
  }[]
  projectDetails: ProjectDetailsType[]
  memo: string
  startTime: string
  endTime: Date | any
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [projectActive, setProjectActive] = useRecoilState<ProjectType | null>(projectActiveState)

  const districtOptions = useRecoilValue(districtOptionsState)
  const provinceOptions = useRecoilValue(provinceOptionsState)
  const investorOptions = useRecoilValue(investorOptionsState)
  const contractorOptions = useRecoilValue(contractorOptionsState)
  const constructionProgressesOptions = useRecoilValue(constructionProgressesOptionsState)
  const productOptions = useRecoilValue(productOptionsState)

  // Initial values
  const defaultValues: ValuesType = {
    code: projectActive?.code ?? '',
    name: projectActive?.name ?? '',
    package: projectActive?.package ?? '',
    districtId: projectActive?.district?.id ?? '',
    provinceId: projectActive?.province?.id ?? '',
    investorId: projectActive?.investor?.id ?? '',
    contractorId: projectActive?.contractor?.id ?? '',
    constructionProgressId: projectActive?.constructionProgress.id ?? 0,
    projectContractorSubs: projectActive?.projectContractorSubs ?? [],
    projectDetails: projectActive?.projectDetails ?? [
      {
        productId: '',
        weight: '',
      },
    ],
    startTime: projectActive?.startTime ?? '',
    endTime: projectActive?.endTime ?? '',
    memo: projectActive?.memo ?? '',
    createdAt: formatDate(projectActive?.createdAt as string) ?? '',
    updatedAt: formatDate(projectActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  const { control, getValues, setValue } = formContext

  // Field Array
  const {
    fields: projectDetails,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'projectDetails',
  })

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setProjectActive(null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    data.startTime = formatDate(data.startTime, 'YYYY-MM-DD')
    data.endTime = formatDate(data.endTime, 'YYYY-MM-DD')

    const projectContractorSubsArray = data?.projectContractorSubs.map((item: any) => {
      return {
        contractorId: item,
      }
    })

    data.projectContractorSubs = [...projectContractorSubsArray]

    if (projectActive && projectActive?.id > 0) {
      const projectActiveId = projectActive && projectActive?.id > 0 ? projectActive?.id : 0
      submitUpdateProjectApi(data, projectActiveId, handleClose)
    } else {
      submitCreateProjectApi(data, () => {
        handleClose()
      })
    }
  }

  // Watch province change
  useWatch({ control, name: 'provinceId' })
  const provinceIdValue = getValues('provinceId')

  const handleAppendProduct = () => {
    append({ productId: '', weight: '' })
  }

  // Watch option
  useEffect(() => {
    getAllConstructionProgressesOptionsApi()
    getAllProvinceOptionsApi()
    getAllProductOptionsApi()
  }, [])

  // filter district by provinceId
  useEffect(() => {
    const districtParams = {
      provinceId: provinceIdValue == null ? '' : provinceIdValue,
    }

    getAllDistrictOptionsApi(districtParams)
  }, [provinceIdValue])

  // Set district value if province filter has values
  useEffect(() => {
    if (provinceIdValue) {
      setValue('districtId', districtOptions[0]?.id ?? '')
    } else {
      setValue('districtId', '')
    }
  }, [districtOptions, provinceIdValue])

  // Watch startTime
  useWatch({ control, name: 'startTime' })

  return (
    <MainModal
      open={openModalDetail}
      title={
        projectActive && projectActive?.id > 0 ? t('projectModalUpdate') : t('projectModalCreate')
      }
      maxWidth="sm"
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} width="100%" pb={10}>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
            <InputField
              name={'code'}
              required
              label={t('projectCodeFieldLabel')}
              placeholder={t('projectCodeFieldPlaceholder')}
              validation={codeFieldValidation()}
              disabled={
                projectActive ? (isPermissionUpdate('projects_update') ? false : true) : false
              }
            />

            <InputField
              name={'name'}
              required
              label={t('projectNameFieldLabel')}
              placeholder={t('projectNameFieldPlaceholder')}
              validation={nameFieldValidation(
                t('projectNameRequiredValidation'),
                t('projectNameMaxLengthValidation')
              )}
              disabled={
                projectActive ? (isPermissionUpdate('projects_update') ? false : true) : false
              }
            />
          </Stack>

          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
            <InputField
              name={'package'}
              required
              label={t('projectPackageFieldLabel')}
              placeholder={t('projectPackageFieldPlaceholder')}
              validation={packageFieldValidation(
                t('projectPackageRequiredValidation'),
                t('projectPackageMaxLengthValidation')
              )}
              disabled={
                projectActive ? (isPermissionUpdate('projects_update') ? false : true) : false
              }
            />
            <SelectField
              name="investorId"
              label={t('projectInvestorSelectLabel')}
              required
              placeholder={t('projectInvestorSelectPlaceholder')}
              validation={fieldRequired(t('projectInvestorSelectRequiredValidation'))}
              options={investorOptions}
              disabled={
                projectActive ? (isPermissionUpdate('projects_update') ? false : true) : false
              }
            />
          </Stack>

          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
            <SelectField
              name="provinceId"
              label={t('projectProvinceSelectLabel')}
              required
              placeholder={t('projectProvinceSelectPlaceholder')}
              validation={fieldRequired(t('projectProvinceSelectRequiredValidation'))}
              options={provinceOptions}
              disabled={
                projectActive ? (isPermissionUpdate('projects_update') ? false : true) : false
              }
            />
            <SelectField
              name="districtId"
              label={t('projectDistrictSelectLabel')}
              required
              placeholder={t('projectDistrictSelectPlaceholder')}
              validation={fieldRequired(t('projectDistrictSelectRequiredValidation'))}
              options={districtOptions}
              disabled={
                projectActive ? (isPermissionUpdate('projects_update') ? false : true) : false
              }
            />
          </Stack>

          <BasicCard title={t('projectContractorLabel')}>
            <SelectField
              name="contractorId"
              label={t('projectMainContractorSelectLabel')}
              required
              placeholder={t('projectContractorSelectPlaceholder')}
              validation={fieldRequired(t('projectContractorSelectRequiredValidation'))}
              options={contractorOptions}
              disabled={
                projectActive ? (isPermissionUpdate('projects_update') ? false : true) : false
              }
            />

            <SelectField
              name="projectContractorSubs"
              label={t('projectContractorSubsFieldLabel')}
              placeholder={t('projectContractorSelectPlaceholder')}
              multiple
              options={contractorOptions}
              showCheckbox
              disabled={
                projectActive ? (isPermissionUpdate('projects_update') ? false : true) : false
              }
            />
          </BasicCard>

          <BasicCard title={t('projectDetailsLabel')}>
            <Stack spacing={2}>
              {projectDetails?.map((projectDetail: ProjectDetailsType, index: number) => (
                <Stack key={index} direction={'row'} alignItems={'flex-start'} spacing={2}>
                  <SelectField
                    name={`projectDetails.${index}.productId`}
                    label={t('projectProductLabel')}
                    required
                    placeholder={t('projectProductSelect')}
                    validation={fieldRequired(t('projectProductSelectRequiredValidation'))}
                    options={productOptions}
                    disabled={
                      projectActive ? (isPermissionUpdate('projects_update') ? false : true) : false
                    }
                  />

                  <NumericFieldController
                    name={`projectDetails.${index}.weight`}
                    formContext={formContext}
                    required
                    label={t('projectProductWeight')}
                    placeholder={t('projectProductWeightRequiredValidation')}
                    validation={priceFieldValidation()}
                    align="right"
                    disabled={
                      projectActive ? (isPermissionUpdate('projects_update') ? false : true) : false
                    }
                  />

                  <Tooltip
                    arrow
                    title={
                      projectDetails?.length <= 1
                        ? t('projectNoDeleteProductTooltip')
                        : t('projectDeleteProductTooltip')
                    }
                  >
                    <Box mt={'20px !important'}>
                      <IconButton
                        edge="end"
                        color="error"
                        disabled={
                          projectDetails?.length <= 1 || projectActive
                            ? isPermissionUpdate('projects_update')
                              ? false
                              : true
                            : false
                        }
                        onClick={() => remove(index)}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  </Tooltip>
                </Stack>
              ))}

              <Box display={'flex'} justifyContent={'flex-end'}>
                {projectActive ? (
                  isPermissionUpdate('projects_update') && (
                    <ButtonAddNew
                      variant="filledTonal"
                      btnText={t('Thêm sản phẩm')}
                      handleClick={handleAppendProduct}
                    />
                  )
                ) : (
                  <ButtonAddNew
                    variant="filledTonal"
                    btnText={t('Thêm sản phẩm')}
                    handleClick={handleAppendProduct}
                  />
                )}
              </Box>
            </Stack>
          </BasicCard>

          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
            <SelectField
              name="constructionProgressId"
              label={t('projectConstructionProgressSelectLabel')}
              required
              placeholder={t('projectConstructionProgressSelectPlaceholder')}
              validation={fieldRequired(t('projectConstructionProgressSelectRequiredValidation'))}
              options={constructionProgressesOptions}
              disabled={
                projectActive ? (isPermissionUpdate('projects_update') ? false : true) : false
              }
            />
          </Stack>

          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
            <DatePicker
              name="startTime"
              label={t('projectStartTimeLabel')}
              required
              // validation={projectActive ? {} : startDateValidation()}
              disabled={
                projectActive ? (isPermissionUpdate('projects_update') ? false : true) : false
              }
            />
            <DatePicker
              name="endTime"
              label={t('projectEndTimeLabel')}
              required
              // validation={projectActive ? {} : endDateValidation(startTimeValue)}
              disabled={
                projectActive ? (isPermissionUpdate('projects_update') ? false : true) : false
              }
            />
          </Stack>

          <InputField
            name="memo"
            label={t('projectMemoFieldLabel')}
            disabled={
              projectActive ? (isPermissionUpdate('projects_update') ? false : true) : false
            }
            rows={3}
          />

          {projectActive && projectActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('projectBtnClose')} handleClick={handleClose} />

          {projectActive ? (
            <React.Fragment>
              {isPermissionUpdate('projects_update') && (
                <ButtonSubmit btnText={t('projectBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('projectBtnSubmit')} type="submit" />
          )}
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
