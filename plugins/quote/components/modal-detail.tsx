import {
  BasicCard,
  ButtonBase,
  ButtonSubmit,
  DatePicker,
  InputField,
  LogActivity,
  MainModal,
  ModalAction,
  RadioGroupField,
  SelectField,
} from '@/components'
import { brand } from '@/components/colors/brand'
import { loadingState } from '@/components/loading/store'
import endpoint from '@/config/endpoint.json'
import {
  getAllDistrictOptionsApi,
  getAllPaymentMethodOptionsApi,
  getAllProductOptionsApi,
  getAllProvinceOptionsApi,
  getAllSaleFormOptionsApi,
} from '@/meta/common'
import { openModalDetailState } from '@/store/common'
import {
  contractorOptionsState,
  districtOptionsState,
  paymentMethodOptionsState,
  productOptionsState,
  projectOptionsState,
  provinceOptionsState,
  saleFormOptionsState,
  statusOptionsState,
} from '@/store/meta'
import { IApiResponse } from '@/types'
import { axiosClient, formatDate, isPermissionUpdate, t } from '@/utils'
import {
  durationQuoteFieldValidation,
  fieldRequired,
  nameFieldValidation,
  paymentMethodOtherFieldValidation,
} from '@/utils/validator'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { submitCreateQuoteApi, submitUpdateQuoteApi } from '../api'
import { quoteActiveState, totalPriceQuoteState } from '../store'

const ModalCreateContract = dynamic(() => import('./modal-create-contract'))
const ModalRejectFeedback = dynamic(() => import('./modal-reject-feedback'))
const CustomerFeedback = dynamic(() => import('./customer-feedback'))
const ProductItemsArray = dynamic(() => import('./product-items-array'))

type ItemType = {
  productId: number | string
  price: number | string
  qty: number | string
  memo: string
  unit: string
}

type ValuesType = {
  contractorId: number | string
  projectId: number | string
  districtId: number | string
  provinceId: number | string
  paymentMethodId: number | string
  paymentMethodOther: string
  durationQuote: string | any
  contractorSubId: any
  items: ItemType[]
  status: string | number
  memo: string
  salesFormId: number | string
  paymentMethodNote: string
  customerFeedbackNote: string
  customerFeedback: number
  createdAt: string
  updatedAt: string
}

export default function ModalDetail() {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [quoteActive, setQuoteActive] = useRecoilState(quoteActiveState)

  // Options
  const projectOptions = useRecoilValue(projectOptionsState)
  const districtOptions = useRecoilValue(districtOptionsState)
  const contractorOptions = useRecoilValue(contractorOptionsState)
  const paymentMethodOptions = useRecoilValue(paymentMethodOptionsState)
  const productOptions = useRecoilValue(productOptionsState)
  const provinceOptions = useRecoilValue(provinceOptionsState)
  const statusOptions = useRecoilValue(statusOptionsState)
  const formSalesOptions = useRecoilValue(saleFormOptionsState)
  const totalPriceQuote = useRecoilValue(totalPriceQuoteState)

  // Hooks
  const router = useRouter()

  // State
  const [isShowPaymentOther, setIsShowPaymentOther] = useState(false)
  const [isShowMemo, setIsShowMemo] = useState(false)
  const [modalCreateContract, setModalCreateContract] = useState(false)
  const [modalRejectFeedback, setModalRejectFeedback] = useState(false)

  // Initial values
  const defaultValues: ValuesType = {
    contractorId: quoteActive?.contractor?.id ?? '',
    projectId: quoteActive?.project?.id ?? '',
    districtId: quoteActive?.district?.id ?? '',
    provinceId: quoteActive?.province?.id ?? '',
    paymentMethodId: quoteActive?.paymentMethod?.id ?? '',
    paymentMethodOther: quoteActive?.paymentMethodOther ?? '',
    durationQuote: quoteActive?.durationQuote ?? dayjs(),
    contractorSubId: quoteActive?.contractorSub != null ? quoteActive?.contractorSub?.id : '' ?? '',
    salesFormId: quoteActive?.salesForm?.id ?? '',
    items: quoteActive?.items ?? [
      {
        productId: '',
        price: '',
        qty: '',
        memo: '',
        unit: '',
      },
    ],

    status: quoteActive?.status != null ? quoteActive?.status.toString() : '' ?? '',
    memo: quoteActive?.memo ?? '',

    customerFeedbackNote: quoteActive?.customerFeedbackNote ?? '',
    customerFeedback: quoteActive?.customerFeedback ?? 0,

    paymentMethodNote: quoteActive?.paymentMethodNote ?? '',
    createdAt: formatDate(quoteActive?.createdAt as string) ?? '',
    updatedAt: formatDate(quoteActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  const { control, watch, getValues, setValue } = formContext

  // Field Array
  const {
    fields: productItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'items',
  })

  // Watch field
  useWatch({ control, name: 'projectId' })
  const projectId = getValues('projectId')
  //:end watch

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setQuoteActive(null)
    formContext.reset()
    router.push('/sales/quote')
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    const parseInItems = data?.items?.map((item) => {
      return {
        ...item,
        price: +item?.price,
        qty: +item?.qty,
      }
    })

    data.durationQuote = formatDate(data.durationQuote, 'YYYY-MM-DD')
    data.items = parseInItems
    data.status = +data.status
    if (quoteActive && quoteActive?.id > 0) {
      const quoteActiveId = quoteActive && quoteActive?.id > 0 ? quoteActive?.id : 0
      submitUpdateQuoteApi(data, quoteActiveId, handleClose)
    } else {
      submitCreateQuoteApi(data, () => {
        handleClose()
      })
    }
  }

  // Handle append product
  const handleAppendProduct = () => {
    append({ productId: '', price: '', qty: '', unit: '', memo: '' })
  }

  // Handle remove Items Product
  const handleRemoveProduct = (index: number) => {
    remove(index)
  }

  // Handle reject Feedback
  const handleRejectFeedback = () => {
    setModalRejectFeedback(!modalRejectFeedback)
  }

  // Handle show modal contract
  const handleShowModalContract = () => {
    setModalCreateContract(true)
  }

  // check disable all field
  let isDisableAllField = false
  if (quoteActive) {
    if (quoteActive?.status == 1 || !isPermissionUpdate('quotes_update')) {
      isDisableAllField = true
    }
  }

  // Watch on project change
  useEffect(() => {
    const onProjectChange = watch((value, { name, type }) => {
      if (name === 'projectId') {
        const projectId = getValues('projectId')
        if (projectId != null) {
          setRecoil(loadingState, false)
          return axiosClient
            .get(`${endpoint.projects}${projectId}`)
            .then((res: IApiResponse | any) => {
              if (res.code == 200) {
                const responseData = res.data.project
                setValue('contractorId', responseData?.contractor?.id)
                setValue('provinceId', responseData?.province.id)
                setValue('districtId', responseData?.district.id)
              }
            })
            .catch((err) => {
              //
            })
            .finally(() => {
              setRecoil(loadingState, false)
            })
        } else if (projectId == null || !projectId) {
          setValue('contractorId', '')
          setValue('provinceId', '')
          setValue('districtId', '')
        }
      }
    })

    return () => onProjectChange.unsubscribe()
  }, [watch])

  // Watch api options
  useEffect(() => {
    getAllPaymentMethodOptionsApi()
    getAllProductOptionsApi()
    getAllProvinceOptionsApi()
    getAllDistrictOptionsApi()
    getAllSaleFormOptionsApi()
  }, [openModalDetail])

  // Watch onPaymentChange, onStatusChange, onProvinceChange
  useEffect(() => {
    // Watch onPaymentChange
    const onPaymentChange = watch((value, { name, type }) => {
      if (name === 'paymentMethodId') {
        const paymentMethodId = getValues('paymentMethodId')
        if (paymentMethodId == 1) {
          setIsShowPaymentOther(true)
        } else {
          setIsShowPaymentOther(false)
        }
      }
    })

    if (quoteActive?.paymentMethod?.id == 1) {
      setIsShowPaymentOther(true)
    }

    // Watch onStatusChange
    const onStatusChange = watch((value, { name, type }) => {
      if (name === 'status') {
        const statusValue = getValues('status')
        if (statusValue == '-1') {
          setIsShowMemo(true)
        } else {
          setIsShowMemo(false)
        }
      }
    })

    return () => {
      onStatusChange.unsubscribe()
      onPaymentChange.unsubscribe()
    }
  }, [watch])

  // Total price
  useEffect(() => {
    const formData = watch()
    if (formData?.items.length > 0) {
      const items = formData?.items

      const totalPrice = items.reduce((total, item: any) => {
        return total + item.price * item.qty
      }, 0)

      setRecoil(totalPriceQuoteState, totalPrice)
    }
  }, [watch(), productOptions])

  // Watch productOptions
  useEffect(() => {
    if (quoteActive && quoteActive?.id > 0) {
      if (quoteActive.status == -1) {
        setIsShowMemo(true)
      }
    }
  }, [productOptions, openModalDetail, quoteActive])

  // Get form data
  const formData = getValues()

  return (
    <MainModal
      open={openModalDetail}
      maxWidth="lg"
      title={
        quoteActive && quoteActive?.id > 0
          ? t('quoteModalUpdate') + ` (${quoteActive.code})`
          : t('quoteModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} width="100%" pb={9}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <SelectField
              name={'projectId'}
              label={t('quoteProjectIdSelectLabel')}
              placeholder={t('quoteProjectIdSelectPlaceholder')}
              required
              validation={fieldRequired(t('quoteProjectIdSelectRequiredValidation'))}
              options={projectOptions}
              disabled={isDisableAllField}
            />

            <SelectField
              name={'contractorId'}
              label={t('quoteContractorIdSelectLabel')}
              placeholder={t('quoteContractorIdSelectPlaceholder')}
              options={contractorOptions}
              disabled
            />

            <SelectField
              name={'contractorSubId'}
              label={t('quoteContractorSubSelectLabel')}
              placeholder={t('quoteContractorSubSelectPlaceholder')}
              options={contractorOptions}
              disabled={!projectId ? true : false}
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <SelectField
              name={'provinceId'}
              label={t('quoteProvinceIdSelectLabel')}
              placeholder={t('quoteProvinceIdSelectPlaceholder')}
              options={provinceOptions}
              disabled
            />
            <SelectField
              name={'districtId'}
              label={t('quoteDistrictIdSelectLabel')}
              placeholder={t('quoteDistrictIdSelectPlaceholder')}
              options={districtOptions}
              disabled
            />

            <DatePicker
              name={'durationQuote'}
              required
              label={t('quoteDurationPriceField')}
              validation={durationQuoteFieldValidation()}
              minDate={dayjs()}
              disabled={isDisableAllField}
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Box flex={1}>
              <SelectField
                name={'salesFormId'}
                label={t('quoteSaleFormIdIdSelectLabel')}
                placeholder={t('quoteSaleFormIdIdSelectPlaceholder')}
                options={formSalesOptions}
                required
                disabled={isDisableAllField}
                validation={nameFieldValidation(t('quoteSaleFormIdIdSelectRequiredValidation'))}
              />
            </Box>
            <Box flex={1}>
              <InputField
                name="paymentMethodNote"
                label={t('quotePaymentMethodNoteField')}
                placeholder={t('quotePaymentMethodNotePlaceholder')}
                disabled={isDisableAllField}
              />
            </Box>
            <Box flex={1}></Box>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Box flex={1}>
              <SelectField
                name={'paymentMethodId'}
                label={t('quotePaymentMethodSelectLabel')}
                required
                placeholder={t('quotePaymentMethodSelectPlaceholder')}
                validation={fieldRequired(t('quotePaymentMethodSelectRequiredValidation'))}
                options={paymentMethodOptions}
                disabled={isDisableAllField}
              />
            </Box>

            <Box flex={1}>
              {isShowPaymentOther && (
                <React.Fragment>
                  <Typography height={'20px'}></Typography>
                  <InputField
                    name="paymentMethodOther"
                    required
                    placeholder={t('quotePaymentMethodPlaceholder')}
                    validation={isShowPaymentOther && paymentMethodOtherFieldValidation()}
                    disabled={isDisableAllField}
                  />
                </React.Fragment>
              )}
            </Box>
            <Box flex={1}></Box>
          </Stack>

          <ProductItemsArray
            formContext={formContext}
            handleAppendProduct={handleAppendProduct}
            handleRemoveProduct={handleRemoveProduct}
            productItems={productItems}
            productOptions={productOptions}
            totalPriceQuote={totalPriceQuote}
            isDisable={isDisableAllField}
          />

          {quoteActive && quoteActive?.id > 0 && (
            <React.Fragment>
              <BasicCard title={t('quoteCanApprovedFieldLabel')}>
                <Box mt={'-8px'} mb={isShowMemo ? '' : '-8px'}>
                  <RadioGroupField
                    name={'status'}
                    options={statusOptions}
                    disabled={
                      quoteActive
                        ? isPermissionUpdate('quotes_approve_leader')
                          ? false
                          : true
                        : false
                    }
                  />

                  <Collapse in={isShowMemo}>
                    <InputField
                      name="memo"
                      label={t('quoteMemoFieldLabel')}
                      placeholder={t('quotPlaceholderFieldLabel')}
                      rows={3}
                    />
                  </Collapse>
                </Box>
              </BasicCard>

              <CustomerFeedback
                quoteActive={quoteActive}
                handleRejectFeedback={handleRejectFeedback}
                handleShowModalContract={handleShowModalContract}
              />

              <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                <Stack flex={1}>
                  <Typography fontSize={'13px'} fontWeight={600}>
                    {t('quoteStaffAuthorNameLabel')}
                  </Typography>
                  <Typography color={brand.gray600} fontSize="14px">
                    {quoteActive?.staffAuthor?.name}
                  </Typography>
                </Stack>

                <Stack flex={1}>
                  <Typography fontSize={'13px'} fontWeight={600}>
                    {t('quoteStaffConfirmNameLabel')}
                  </Typography>
                  <Typography color={brand.gray600} fontSize="14px">
                    {quoteActive?.status == 1 || quoteActive?.status == -1
                      ? quoteActive?.staffConfirm?.name
                      : '--'}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
                <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
              </Stack>
            </React.Fragment>
          )}

          {quoteActive && <LogActivity logsList={quoteActive?.logs} />}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('quoteBtnClose')} handleClick={handleClose} />
          {quoteActive ? (
            isPermissionUpdate('quotes_update') &&
            isPermissionUpdate('quotes_approve_leader') && (
              <ButtonSubmit btnText={t('quoteBtnSubmitUpdate')} type="submit" />
            )
          ) : (
            <ButtonSubmit btnText={t('quoteBtnSubmit')} type="submit" />
          )}
        </ModalAction>

        {modalRejectFeedback && (
          <ModalRejectFeedback
            open={modalRejectFeedback}
            handleClose={() => setModalRejectFeedback(false)}
            onHandleSubmit={onHandleSubmit}
            formData={formData}
          />
        )}
      </FormContainer>

      {modalCreateContract && (
        <ModalCreateContract
          openModal={modalCreateContract}
          handleClose={() => setModalCreateContract(false)}
        />
      )}
    </MainModal>
  )
}
