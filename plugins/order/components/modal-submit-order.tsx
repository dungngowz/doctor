import {
  BasicCard,
  ButtonBase,
  ButtonSubmit,
  DateTimePicker,
  InputField,
  ItemRow,
  LogActivity,
  MainModal,
  ModalAction,
  ProductDataTable,
  SelectField,
} from '@/components'
import { getAllStationOptionsApi } from '@/meta/common'
import { contractActiveState } from '@/plugins/contract/store'
import { stationOptionsState } from '@/store/meta'
import { formatDate, isPermissionUpdate, t } from '@/utils'
import { nameFieldValidation, phoneFieldValidation } from '@/utils/validator'
import { Grid, Stack } from '@mui/material'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { submitCreateOrderApi, submitUpdateOrderApi } from '../api'
import { openModalSubmitOrderState, orderActivedState } from '../store'

const StatusOrder = dynamic(() => import('./status-order'))

type ValuesType = {
  contractId: number
  consigneeName: string
  phoneContact: string
  status: string | number
  memo: string
  createdAt: string
  updatedAt: string

  timeWorkStation: string
  stationId: string | number

  statusAccountant: string | number
  memoAccountant: string
  statusDirector: string | number
  memoDirector: string
}

export default function ModalSubmitOrder() {
  // Recoil
  const [openSubmitOrder, setOpenSubmitOrder] = useRecoilState(openModalSubmitOrderState)
  const orderActived = useRecoilValue(orderActivedState)
  const [contractActived, setContractActived] = useRecoilState(contractActiveState)

  // Options
  const stationOptions = useRecoilValue(stationOptionsState)

  // State
  const router = useRouter()

  // Initial values
  const defaultValues: ValuesType = {
    contractId: contractActived?.id ?? orderActived?.contract?.id ?? 0,
    consigneeName: orderActived?.consigneeName ?? '',
    phoneContact: orderActived?.phoneContact ?? '',

    timeWorkStation: orderActived?.timeWorkStation ?? '',
    stationId: orderActived?.station?.id ?? '',

    status: orderActived?.status?.toString() ?? '',
    memo: orderActived?.memo ?? '',

    statusAccountant: orderActived?.statusAccountant.toString() ?? '',
    memoAccountant: orderActived?.memoAccountant ?? '',

    statusDirector: orderActived?.statusDirector.toString() ?? '',
    memoDirector: orderActived?.memoDirector ?? '',

    createdAt: formatDate(orderActived?.createdAt as string) ?? '',
    updatedAt: formatDate(orderActived?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  // FormContext
  const { watch, getValues } = formContext

  watch(['status', 'statusAccountant', 'statusDirector', 'statusDirector'])
  const statusBusiness = getValues('status')
  const statusAccountant = getValues('statusAccountant')
  const statusDirector = getValues('statusDirector')

  // Handle close modal
  const handleClose = () => {
    setOpenSubmitOrder(!openSubmitOrder)
    formContext.reset()
    setRecoil(orderActivedState, null)
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    data.status = +data.status
    data.statusAccountant = +data.statusAccountant
    data.statusDirector = +data.statusDirector
    data.timeWorkStation = formatDate(data.timeWorkStation, 'YYYY-MM-DD HH:mm:ss')
    if (orderActived && orderActived?.id > 0) {
      const orderActivedId = orderActived && orderActived?.id > 0 ? orderActived?.id : 0
      submitUpdateOrderApi(data, orderActivedId, handleClose)
    } else {
      submitCreateOrderApi(data, () => {
        router.push('/sales/order')
        setRecoil(orderActivedState, null)
        setRecoil(openModalSubmitOrderState, false)
      })
    }
  }

  // Set ContractActived
  useEffect(() => {
    if (orderActived && orderActived?.id > 0) {
      setContractActived(orderActived?.contract)
    }

    getAllStationOptionsApi()
  }, [orderActived])

  // const hasSchedules = false

  return (
    <MainModal
      open={openSubmitOrder}
      maxWidth="md"
      title={orderActived && orderActived?.id > 0 ? t('orderModalUpdate') : t('orderModalCreate')}
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} width="100%" pb={9}>
          <Stack direction={'row'} spacing={2}>
            <InputField
              name="consigneeName"
              required
              label={t('orderConsigneeNameFieldLabel')}
              placeholder={t('orderConsigneeNameFieldPlaceholder')}
              validation={nameFieldValidation()}
              disabled={
                orderActived && isPermissionUpdate('orders_update') && orderActived?.status == 1
                  ? true
                  : false
              }
            />
            <InputField
              name="phoneContact"
              required
              label={t('orderPhoneContactFieldLabel')}
              placeholder={t('orderPhoneContactFieldPlaceholder')}
              validation={phoneFieldValidation()}
              disabled={
                orderActived && isPermissionUpdate('orders_update') && orderActived?.status == 1
                  ? true
                  : false
              }
            />
          </Stack>

          <Stack direction={'row'} spacing={2}>
            <SelectField
              name="stationId"
              options={stationOptions}
              required
              label={t('orderStationFieldLabel')}
              placeholder={t('orderStationFieldPlaceholder')}
              validation={nameFieldValidation(t('orderStationRequiredValidation'))}
              disabled={
                orderActived && isPermissionUpdate('orders_update') && orderActived?.status == 1
                  ? true
                  : false
              }
            />

            <DateTimePicker
              name="timeWorkStation"
              required
              label={t('orderWorkStationLabel')}
              validation={nameFieldValidation('orderWorkStationRequiredValidation')}
              disabled={
                orderActived && isPermissionUpdate('orders_update') && orderActived?.status == 1
                  ? true
                  : false
              }
            />
          </Stack>

          {contractActived && contractActived?.id > 0 && (
            <React.Fragment>
              {orderActived && orderActived?.id > 0 && (
                <StatusOrder
                  statusAccountant={statusAccountant}
                  statusBusiness={statusBusiness}
                  statusDirector={statusDirector}
                />
              )}

              <BasicCard title={t('orderDetailContractLabel')}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <ItemRow
                      title={t('orderCodeContractLabel')}
                      description={contractActived?.code}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ItemRow
                      title={t('orderNameProjectLabel')}
                      description={contractActived?.quote?.project?.name}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ItemRow
                      title={t('orderNameContractorLabel')}
                      description={contractActived?.quote?.contractor?.name}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <ItemRow
                      title={t('orderNameContractorSubLabel')}
                      description={contractActived?.quote?.contractorSub?.name}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <ItemRow
                      title={t('orderAddressLabel')}
                      description={
                        contractActived?.quote?.district?.title +
                        ', ' +
                        contractActived?.quote?.province?.title
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <ItemRow
                      title={t('orderNameSalesFormSubLabel')}
                      description={contractActived.quote.salesForm.title}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <ItemRow
                      title={t('orderQuotePaymentMethodLabel')}
                      description={
                        contractActived?.quote?.paymentMethodOther
                          ? contractActived?.quote?.paymentMethodOther
                          : contractActived?.quote?.paymentMethod?.title
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <ItemRow
                      title={t('orderPaymentMethodNoteSubLabel')}
                      description={contractActived.quote.paymentMethodNote ?? '--'}
                    />
                  </Grid>
                </Grid>

                <ProductDataTable products={contractActived?.quote?.items} />
              </BasicCard>
            </React.Fragment>
          )}

          {orderActived && (
            <>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
                <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
              </Stack>

              <LogActivity logsList={orderActived.logs} />
            </>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('orderBtnClose')} handleClick={handleClose} />
          <ButtonSubmit
            btnText={
              orderActived && orderActived?.id > 0 ? t('orderBtnSubmitUpdate') : t('orderBtnSubmit')
            }
            type="submit"
            disabled={
              !isPermissionUpdate('orders_approve_director') &&
              orderActived != null &&
              orderActived.hasSchedules
            }
          />
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
