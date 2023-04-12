import {
  BasicCard,
  ButtonBase,
  ButtonSubmit,
  ItemRow,
  LogActivity,
  MainModal,
  ModalAction,
  NumericFieldController,
  ProductDataTable,
} from '@/components'
import { submitOrderDiscountApi } from '@/meta/order'
import { contractActiveState } from '@/plugins/contract/store'
import { totalProductPrice } from '@/plugins/order/handlers'
import { openModalDetailState } from '@/store/common'
import { canApprovedState } from '@/store/user'
import { formatDate, t } from '@/utils'
import { Box, Stack, TableCell, TableRow, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import React, { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { debtActivedState } from '../store'

type ValuesType = {
  discount: string | number
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [debtActived, setDebtActived] = useRecoilState(debtActivedState)
  const [contractActived, setContractActived] = useRecoilState(contractActiveState)
  const canApproved = useRecoilValue(canApprovedState)

  // Initial values
  const defaultValues: ValuesType = {
    discount: debtActived?.discount ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  const { control, getValues } = formContext

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setDebtActived(null)
    setContractActived(null)
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    const debtActivedId = debtActived && debtActived?.id > 0 ? debtActived?.id : 0
    submitOrderDiscountApi(debtActivedId, {
      discount: +data.discount,
    })
    handleClose()
  }

  // Set ContractActived
  useEffect(() => {
    if (debtActived && debtActived?.id > 0) {
      setContractActived(debtActived?.contract)
    }
  }, [debtActived])

  // Watch control
  useWatch({ control, name: 'discount' })
  const discountValue = getValues('discount')

  const totalDebtPrice = (item: any) => {
    const totalPrice = item?.reduce((total: any, item: any) => {
      return total + item?.qty * item?.price
    }, 0)
    const finalPrice = totalPrice - +discountValue ?? 0
    return finalPrice
  }

  // Check discount valid
  const isErrorDiscountInvalid = (item: any) => {
    const discountValue = getValues('discount')
    const totalPrice = item?.reduce((total: any, item: any) => {
      return total + item?.qty * item?.price
    }, 0)
    const finalPrice = totalPrice - +discountValue ?? 0

    return +discountValue >= finalPrice ? true : false
  }

  return (
    <MainModal open={openModalDetail} maxWidth="md" title={t('debtModalDetail')}>
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} width="100%" pb={9}>
          <BasicCard title="Thông tin công nợ">
            <Stack direction={'row'} spacing={2}>
              <ItemRow title={t('orderCodeFieldLabel')} description={debtActived?.code} />
              <ItemRow
                title={t('orderConsigneeNameFieldLabel')}
                description={debtActived?.consigneeName}
              />
              <ItemRow
                title={t('orderPhoneContactFieldLabel')}
                description={debtActived?.phoneContact}
              />
            </Stack>
          </BasicCard>

          {contractActived && contractActived?.id > 0 && (
            <React.Fragment>
              <BasicCard title={t('orderDetailContractLabel')}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <ItemRow
                    title={t('orderCodeContractLabel')}
                    description={contractActived?.code}
                  />

                  <ItemRow
                    title={t('orderNameContractorLabel')}
                    description={contractActived?.quote?.contractor?.name}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <ItemRow
                    title={t('orderNameProjectLabel')}
                    description={contractActived?.quote?.project?.name}
                  />
                  <ItemRow
                    title={t('orderAddressLabel')}
                    description={
                      contractActived?.quote?.district?.title +
                      ', ' +
                      contractActived?.quote?.province?.title
                    }
                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <ItemRow
                    title={t('orderDurationQuoteLabel')}
                    description={formatDate(contractActived?.quote?.durationQuote, 'DD/MM/YYYY')}
                  />
                  <ItemRow
                    title={t('orderQuotePaymentMethodLabel')}
                    description={
                      contractActived?.quote?.paymentMethodOther
                        ? contractActived?.quote?.paymentMethodOther
                        : contractActived?.quote?.paymentMethod?.title
                    }
                  />
                </Stack>

                <ProductDataTable
                  products={contractActived?.quote?.items}
                  slotTableRow={
                    <>
                      <TableRow>
                        <TableCell colSpan={8}>
                          <Box display={'flex'} justifyContent="flex-end">
                            <Box
                              width={'100%'}
                              maxWidth={'300px'}
                              display="flex"
                              alignItems={'center'}
                            >
                              <Typography
                                whiteSpace={'nowrap'}
                                pr={2}
                                fontSize={'13px'}
                                fontWeight={600}
                              >
                                {t('debtDiscountLabel')}
                              </Typography>
                              <NumericFieldController
                                variant="standard"
                                name="discount"
                                align="right"
                                formContext={formContext}
                                placeholder={t('discountPlaceholder')}
                              />
                            </Box>
                          </Box>
                          {isErrorDiscountInvalid(contractActived?.quote?.items as any) && (
                            <Typography textAlign={'end'} fontSize="10px" color={red[600]}>
                              {t('discountInValid')}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell colSpan={8} align="right">
                          <Box display={'flex'} justifyContent="flex-end">
                            <Stack
                              direction={'row'}
                              maxWidth="300px"
                              width={'100%'}
                              justifyContent="space-between"
                            >
                              <Typography fontSize={'13px'} fontWeight={600}>
                                {t('debtTotalPrice')}
                              </Typography>
                              <Typography fontSize={'14px'} fontWeight={700} color={red[600]}>
                                {totalProductPrice(
                                  +discountValue,
                                  contractActived?.quote?.items as any
                                )}
                              </Typography>
                            </Stack>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </>
                  }
                />
              </BasicCard>

              {debtActived && (
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <ItemRow
                    title={t('createdAtFieldLabel')}
                    description={formatDate(debtActived?.createdAt)}
                  />
                  <ItemRow
                    title={t('updateAtFieldLabel')}
                    description={formatDate(debtActived?.updatedAt)}
                  />
                </Stack>
              )}
            </React.Fragment>
          )}

          {debtActived && <LogActivity logsList={debtActived.logs} />}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('orderBtnClose')} handleClick={handleClose} />
          <ButtonSubmit
            disabled={isErrorDiscountInvalid(contractActived?.quote?.items as any)}
            btnText={
              debtActived && debtActived?.id > 0 ? t('orderBtnSubmitUpdate') : t('orderBtnSubmit')
            }
            type="submit"
          />
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
