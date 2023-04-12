import {
  BasicCard,
  ButtonBase,
  ButtonSubmit,
  DateTimePicker,
  InputField,
  ItemRow,
  MainModal,
  ModalAction,
  ProductDataTable,
  SelectField,
} from '@/components'
import { totalProductPrice } from '@/plugins/order/handlers'
import { orderActivedState } from '@/plugins/order/store'
import { OrderType } from '@/plugins/order/type'
import { filterProductsByOrderApi } from '@/plugins/product/api'
import { openModalDetailState } from '@/store/common'
import { productOptionsState, suppliersOptionsState } from '@/store/meta'
import { formatDate, t } from '@/utils'
import {
  addressFieldValidation,
  consigneeNameFieldValidation,
  dateFieldValidation,
  fieldRequired,
  productFieldValidation,
  shippingUnitFieldValidation,
} from '@/utils/validator'
import { Inventory2, Replay } from '@mui/icons-material'
import { Box, Button, Stack, TableCell, TableRow, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { submitCreateSchedulesApi, submitUpdateSchedulesApi } from '../api'
import {
  currentIndexSelectedOrderIdState,
  openModalSelectOrderState,
  schedulesActiveState,
} from '../store'
import { ModalSelectOrder } from './modal-select-order'

type ValuesType = {
  orderId: string | number
  supplierId: string | number
  productId: string | number
  timeExport: any
  placeDelivery: string
  consigneeName: string
  shippingUnit: string
  createdAt?: string
  updatedAt?: string
}

export const ModalDetail = () => {
  // Props
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [schedulesActive, setSchedulesActive] = useRecoilState(schedulesActiveState)
  const openModalSelectOrder = useRecoilValue(openModalSelectOrderState)
  const [orderActive, setOrderActive] = useRecoilState<OrderType | any>(orderActivedState)
  const productOptions = useRecoilValue(productOptionsState)
  const suppliersOptions = useRecoilValue(suppliersOptionsState)

  // DefaultValues
  const defaultValues: ValuesType = {
    orderId: '',
    supplierId: schedulesActive?.supplier?.id ?? '',
    productId: schedulesActive?.product?.id ?? '',
    timeExport: schedulesActive?.timeExport ?? dayjs(),
    placeDelivery: schedulesActive?.placeDelivery ?? '',
    consigneeName: schedulesActive?.consigneeName ?? '',
    shippingUnit: schedulesActive?.shippingUnit ?? '',
    createdAt: formatDate(schedulesActive?.createdAt as string) ?? '',
    updatedAt: formatDate(schedulesActive?.updatedAt as string) ?? '',
  }

  // FormContext
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  const { setValue } = formContext

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setSchedulesActive(null)
    setOrderActive(null)
    setRecoil(currentIndexSelectedOrderIdState, -1)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    data.timeExport = formatDate(data.timeExport, 'YYYY-MM-DD')
    if (schedulesActive && schedulesActive?.id > 0) {
      const scheduleId = schedulesActive && schedulesActive?.id > 0 ? schedulesActive?.id : 0
      submitUpdateSchedulesApi(data, scheduleId, handleClose)
    } else {
      submitCreateSchedulesApi(data, handleClose)
    }
  }

  // GET Product list by order
  useEffect(() => {
    if (orderActive && orderActive?.id > 0) {
      filterProductsByOrderApi(orderActive?.id)
      setValue('orderId', orderActive?.id)
    }
  }, [orderActive])

  useEffect(() => {
    if (schedulesActive && schedulesActive?.id > 0) {
      setOrderActive(schedulesActive?.order)
    }
  }, [schedulesActive])

  return (
    <MainModal
      open={openModalDetail}
      maxWidth="md"
      title={
        schedulesActive && schedulesActive?.id > 0
          ? t('scheduleModalUpdate')
          : t('scheduleModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} mb={9}>
          <Stack direction={'row'} spacing={2}>
            <Stack direction={'row'} spacing={2} flex={1}>
              <SelectField
                name="supplierId"
                label="Nhà cung cấp"
                placeholder="Chọn nhà cung cấp"
                options={suppliersOptions}
                required
                validation={fieldRequired(t('schedulesSelectSupplierRequiredValidation'))}
                disabled={schedulesActive?.disableEditDelete}
              />
            </Stack>
            <Stack direction={'row'} spacing={2} flex={1}>
              <Stack flexShrink={0}>
                <Typography className="input-label">
                  {t('schedulesSelectedOrderLabel')} <span className="required">*</span>
                </Typography>
                <Box mt={'-1px !important'} width="100%">
                  <Button
                    fullWidth
                    startIcon={orderActive ? <Replay /> : <Inventory2 />}
                    variant="filledTonal"
                    onClick={() => setRecoil(openModalSelectOrderState, true)}
                    disabled={schedulesActive?.disableEditDelete}
                  >
                    {orderActive
                      ? t('schedulesReSelectOrderBtnLabel')
                      : t('schedulesSelectedOrderBtnLabel')}
                  </Button>
                </Box>
              </Stack>
              {orderActive && (
                <SelectField
                  name="productId"
                  label={t('schedulesSelectProductLabel')}
                  placeholder={t('schedulesSelectProductLabel')}
                  options={productOptions}
                  required
                  validation={productFieldValidation()}
                  disabled={schedulesActive?.disableEditDelete}
                />
              )}
            </Stack>
          </Stack>

          <Stack direction={'row'} spacing={2}>
            <DateTimePicker
              name="timeExport"
              required
              label={t('schedulesTimeExportLabel')}
              validation={dateFieldValidation()}
              disabled={schedulesActive?.disableEditDelete}
              minDate={dayjs()}
            />
            <InputField
              name="placeDelivery"
              required
              validation={addressFieldValidation(t('placeDeliveryRequiredValidation'))}
              disabled={schedulesActive?.disableEditDelete}
              label={t('schedulesPlaceDeliveryLabel')}
            />
          </Stack>

          <Stack direction={'row'} spacing={2}>
            <InputField
              name="consigneeName"
              required
              label={t('schedulesConsigneeNameLabel')}
              disabled={schedulesActive?.disableEditDelete}
              validation={consigneeNameFieldValidation()}
            />
            <InputField
              name="shippingUnit"
              required
              label={t('schedulesShippingUnitLabel')}
              disabled={schedulesActive?.disableEditDelete}
              validation={shippingUnitFieldValidation()}
            />
          </Stack>

          {orderActive && (
            <BasicCard title={t('schedulesDetailOrderLabel')}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <ItemRow title={t('schedulesCodeOrderLabel')} description={orderActive?.code} />
                <ItemRow
                  title={t('orderConsigneeNameFieldLabel')}
                  description={orderActive?.consigneeName}
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <ItemRow
                  title={t('orderPhoneContactFieldLabel')}
                  description={orderActive?.phoneContact}
                />
                <ItemRow
                  title={t('orderContractorNameHeadCell')}
                  description={orderActive?.contract?.quote?.contractor?.name}
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <ItemRow
                  title={t('orderProjectNameHeadCell')}
                  description={orderActive?.contract.quote?.project?.name}
                />
                <ItemRow
                  title={t('orderAddressHeadCell')}
                  description={
                    orderActive?.contract?.quote?.district?.title +
                    ', ' +
                    orderActive?.contract?.quote?.province?.title
                  }
                />
              </Stack>

              <ProductDataTable
                products={orderActive?.contract?.quote?.detail}
                slotTableRow={
                  schedulesActive && (
                    <>
                      <TableRow>
                        <TableCell colSpan={8} align="right">
                          <Box display={'flex'} justifyContent="flex-end">
                            <Box
                              maxWidth={300}
                              display={'flex'}
                              alignItems="center"
                              justifyContent={'space-between'}
                              width="100%"
                            >
                              <Typography fontSize={'13px'} fontWeight={600}>
                                Tiền giảm giá
                              </Typography>
                              <Typography fontWeight={600}>
                                {schedulesActive?.amountFormatted}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell colSpan={8} align="right">
                          <Box display={'flex'} justifyContent="flex-end">
                            <Box
                              maxWidth={300}
                              display={'flex'}
                              alignItems="center"
                              justifyContent={'space-between'}
                              width="100%"
                            >
                              <Typography fontSize={'13px'} fontWeight={600}>
                                Thành tiền
                              </Typography>
                              <Typography fontWeight={600} color={red[600]}>
                                {totalProductPrice(
                                  schedulesActive?.amount,
                                  orderActive?.contract?.quote?.detail
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </>
                  )
                }
              />
            </BasicCard>
          )}

          {schedulesActive && schedulesActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('schedulesBtnClose')} handleClick={handleClose} />
          <ButtonSubmit
            btnText={
              schedulesActive && schedulesActive?.id > 0
                ? t('schedulesBtnSubmitUpdate')
                : t('schedulesBtnSubmit')
            }
            type="submit"
            disabled={schedulesActive?.disableEditDelete}
          />
        </ModalAction>
      </FormContainer>

      {openModalSelectOrder && <ModalSelectOrder />}
    </MainModal>
  )
}
