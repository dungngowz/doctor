import {
  BasicCard,
  ButtonBase,
  ButtonSubmit,
  ItemRow,
  LogActivity,
  MainModal,
  ModalAction,
  ProductDataTable,
} from '@/components'
import { contractActiveState } from '@/plugins/contract/store'
import { openModalDetailState } from '@/store/common'
import { formatDate, t } from '@/utils'
import { AssignmentTurnedIn } from '@mui/icons-material'
import { Box, Button, Stack, TableCell, TableRow, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { updateFinishOrderApi } from '../api'
import { totalProductPrice } from '../handlers'
import { orderActivedState } from '../store'

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [orderActived, setOrderActived] = useRecoilState(orderActivedState)
  const [contractActived, setContractActived] = useRecoilState(contractActiveState)

  // State
  const [openModalFinishOrder, setOpenModalFinishOrder] = useState(false)

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setOrderActived(null)
    setContractActived(null)
  }

  const handleSubmitFinish = () => {
    if (orderActived) {
      updateFinishOrderApi(
        orderActived?.id,
        {
          isFinish: true,
        },
        () => {
          handleClose()
          setOpenModalFinishOrder(false)
        }
      )
    }
  }

  // Set ContractActived
  useEffect(() => {
    if (orderActived && orderActived?.id > 0) {
      setContractActived(orderActived?.contract)
    }
  }, [orderActived])

  return (
    <MainModal open={openModalDetail} maxWidth="md" title={t('orderDetailFieldLabel')}>
      <Stack spacing={2} width="100%" pb={9}>
        {orderActived && (
          <BasicCard title={t('orderDetailFieldLabel')}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <ItemRow title={t('orderCodeFieldLabel')} description={orderActived?.code} />
              <ItemRow
                title={t('orderConsigneeNameFieldLabel')}
                description={orderActived?.consigneeName}
              />
              <ItemRow
                title={t('orderPhoneContactFieldLabel')}
                description={orderActived?.phoneContact}
              />
            </Stack>
          </BasicCard>
        )}

        {contractActived && (
          <BasicCard title={t('orderDetailContractLabel')}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <ItemRow title={t('orderCodeContractLabel')} description={contractActived?.code} />

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

            {orderActived && (
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
                            justifyContent="space-between"
                          >
                            <Typography
                              whiteSpace={'nowrap'}
                              pr={2}
                              fontSize={'13px'}
                              fontWeight={600}
                            >
                              {t('debtDiscountLabel')}
                            </Typography>

                            <Typography textAlign={'right'} fontWeight={600}>
                              {orderActived?.discountFormatted}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell colSpan={8}>
                        <Box display={'flex'} justifyContent="flex-end">
                          <Box
                            width={'100%'}
                            maxWidth={'300px'}
                            display="flex"
                            alignItems={'center'}
                            justifyContent="space-between"
                          >
                            <Typography
                              whiteSpace={'nowrap'}
                              pr={2}
                              fontSize={'13px'}
                              fontWeight={600}
                            >
                              {t('debtDiscountLabel')}
                            </Typography>
                            <Typography textAlign={'right'} fontWeight={600}>
                              {totalProductPrice(
                                orderActived?.discount,
                                contractActived?.quote?.items as any
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </>
                }
              />
            )}
          </BasicCard>
        )}
        {orderActived && (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <ItemRow title={t('createdAtFieldLabel')} description={orderActived?.createdAt} />
            <ItemRow title={t('updateAtFieldLabel')} description={orderActived?.updatedAt} />
          </Stack>
        )}
        {orderActived && <LogActivity logsList={orderActived.logs} />}
      </Stack>

      <ModalAction>
        <Stack justifyContent={'space-between'} direction="row" width={'100%'}>
          <Button
            variant="contained"
            color="success"
            disabled={orderActived?.isFinish}
            onClick={() => setOpenModalFinishOrder(true)}
          >
            {t('orderCompleteBtn')}
          </Button>
          <ButtonBase btnText={t('orderBtnClose')} handleClick={handleClose} />
        </Stack>
      </ModalAction>

      <MainModal open={openModalFinishOrder}>
        <Box textAlign={'center'}>
          <AssignmentTurnedIn color="info" sx={{ fontSize: '2.5rem' }} />
          <Typography textAlign={'center'} fontSize="16px" fontWeight={500} pt={1}>
            {t('orderMessageConfirmComplete')}
          </Typography>
          <Stack direction={'row'} spacing={2} justifyContent="center" pt={4}>
            <ButtonBase
              btnText={t('orderBtnCancel')}
              handleClick={() => setOpenModalFinishOrder(false)}
            />
            <ButtonSubmit
              btnText={t('orderBtnConfirmCompleteOrder')}
              handleClick={handleSubmitFinish}
            />
          </Stack>
        </Box>
      </MainModal>
    </MainModal>
  )
}
