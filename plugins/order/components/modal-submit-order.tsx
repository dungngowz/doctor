import {
  BasicCard,
  ButtonBase,
  ButtonSubmit,
  DatePicker,
  InputField,
  ItemRow,
  LogActivity,
  MainModal,
  ModalAction,
  ProductDataTable,
  RadioGroupField,
  SelectField,
} from '@/components'
import { getAllStationOptionsApi } from '@/meta/common'
import { contractActiveState } from '@/plugins/contract/store'
import { stationOptionsState, statusOptionsState } from '@/store/meta'
import { formatDate, t } from '@/utils'
import { nameFieldValidation, phoneFieldValidation } from '@/utils/validator'
import { Box, Collapse, Grid, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { submitCreateOrderApi, submitUpdateOrderApi } from '../api'
import { openModalSubmitOrderState, orderActivedState } from '../store'

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
}

export default function ModalSubmitOrder() {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalSubmitOrderState)
  const orderActived = useRecoilValue(orderActivedState)
  const [contractActived, setContractActived] = useRecoilState(contractActiveState)

  // Options
  const statusOptions = useRecoilValue(statusOptionsState)
  const stationOptions = useRecoilValue(stationOptionsState)

  // State
  const router = useRouter()

  // Initial values
  const defaultValues: ValuesType = {
    contractId: contractActived?.id ?? 0,
    consigneeName: orderActived?.consigneeName ?? '',
    phoneContact: orderActived?.phoneContact ?? '',

    status: orderActived?.status?.toString() ?? '',
    memo: orderActived?.memo ?? '',

    timeWorkStation: orderActived?.timeWorkStation ?? '',
    stationId: orderActived?.station?.id ?? '',

    createdAt: formatDate(orderActived?.createdAt as string) ?? '',
    updatedAt: formatDate(orderActived?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  // FormContext
  const { watch, getValues, control } = formContext

  useWatch({ control, name: 'status' })
  const status = getValues('status')

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    data.timeWorkStation = formatDate(data.timeWorkStation, 'YYYY-MM-DD')
    if (orderActived && orderActived?.id > 0) {
      const orderActivedId = orderActived && orderActived?.id > 0 ? orderActived?.id : 0
      submitUpdateOrderApi(data, orderActivedId, handleClose)
    } else {
      submitCreateOrderApi(data, () => {
        router.push('/sales/order')
        setRecoil(orderActivedState, null)
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

  return (
    <MainModal
      open={openModalDetail}
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
            />
            <InputField
              name="phoneContact"
              required
              label={t('orderPhoneContactFieldLabel')}
              placeholder={t('orderPhoneContactFieldPlaceholder')}
              validation={phoneFieldValidation()}
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
            />

            <DatePicker
              name="timeWorkStation"
              required
              label={t('orderWorkStationLabel')}
              validation={nameFieldValidation('orderWorkStationRequiredValidation')}
            />
          </Stack>

          {contractActived && contractActived?.id > 0 && (
            <>
              {orderActived && orderActived?.id > 0 && (
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <BasicCard title={t('orderRoomBusiness')}>
                    <Box mt="-4px" mb="-12px">
                      <RadioGroupField
                        name={'status'}
                        options={statusOptions}
                        label={t('orderAccountantStatusHeadCell')}
                      />

                      <Collapse in={status == -1 ? true : false}>
                        <Box mb={1}>
                          <InputField
                            name="memo"
                            label={t('quoteMemoFieldLabel')}
                            placeholder={t('quotPlaceholderFieldLabel')}
                            rows={3}
                          />
                        </Box>
                      </Collapse>
                    </Box>
                  </BasicCard>

                  <BasicCard title={t('orderRoomAccountant')}>
                    <Box mt="-4px" mb="-12px">
                      <RadioGroupField
                        name={'statusAccountant'}
                        options={statusOptions}
                        label={t('orderAccountantStatusHeadCell')}
                      />

                      {/* <Collapse in={isShowAccountant}>
                        <Box mb={1}>
                          <InputField
                            name="memoAccountant"
                            label={t('quoteMemoFieldLabel')}
                            placeholder={t('quotPlaceholderFieldLabel')}
                            rows={3}
                          />
                        </Box>
                      </Collapse> */}
                    </Box>
                  </BasicCard>
                </Stack>
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
                      title={t('Nhà thầu phụ')}
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
                      title={t('Hình thức bán hàng')}
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
                      title={t('Hình thức thanh toán')}
                      description={contractActived.quote.paymentMethodNote ?? '--'}
                    />
                  </Grid>
                </Grid>

                <ProductDataTable products={contractActived?.quote?.items} />
              </BasicCard>
            </>
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
          />
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
