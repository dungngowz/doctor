import {
  BasicCard,
  ButtonBase,
  ButtonSubmit,
  InputField,
  ItemRow,
  LogActivity,
  MainModal,
  ModalAction,
  ProductDataTable,
  RadioGroupField,
} from '@/components'
import { openModalSubmitOrderState } from '@/plugins/order/store'
import { openModalDetailState } from '@/store/common'
import { statusOptionsState } from '@/store/meta'
import { formatDate, isPermissionCreate, isPermissionUpdate, t } from '@/utils'
import { Box, Button, Collapse, Grid, Stack } from '@mui/material'
import dynamic from 'next/dynamic'
import React from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { submitUpdateContractApi } from '../api'
import { contractActiveState } from '../store'

const ModalSubmitOrder = dynamic(() => import('@/plugins/order/components/modal-submit-order'), {
  loading: () => <p>Loading...</p>,
})

type ValuesType = {
  status: number | string
  quoteId: number | string
  memo: string
  statusDirector: number | string
  memoDirector: string
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [contractActive, setContractActive] = useRecoilState(contractActiveState)
  const statusOptions = useRecoilValue(statusOptionsState)

  // State
  const openModalCreateOrder = useRecoilValue(openModalSubmitOrderState)

  // Initial values
  const defaultValues: ValuesType = {
    status: contractActive?.status != null ? contractActive?.status.toString() : '',
    quoteId: contractActive?.quote?.id ?? 0,
    memo: contractActive?.memo ?? '',
    statusDirector:
      contractActive?.statusDirector != null ? contractActive?.statusDirector.toString() : '',
    memoDirector: contractActive?.memoDirector ?? '',
    createdAt: formatDate(contractActive?.createdAt as string) ?? '',
    updatedAt: formatDate(contractActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  const { getValues, control } = formContext

  useWatch({ control, name: 'statusDirector' })
  useWatch({ control, name: 'status' })
  const statusDirector = getValues('statusDirector')
  const status = getValues('status')

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setContractActive(null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    data.status = +data.status
    data.statusDirector = +data.statusDirector
    const contractActiveId = contractActive && contractActive?.id > 0 ? contractActive?.id : 0
    submitUpdateContractApi(data, contractActiveId, handleClose)
  }

  // Handle show modal create order
  const handleShowModalCreateOrder = () => {
    setRecoil(openModalSubmitOrderState, true)
  }

  return (
    <MainModal
      open={openModalDetail}
      maxWidth="md"
      title={
        contractActive && contractActive?.id > 0
          ? t('contractModalUpdate')
          : t('contractModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack pb={9} spacing={2}>
          {contractActive && contractActive?.id > 0 && (
            <React.Fragment>
              <ItemRow title={t('contractCodeFieldLabel')} description={contractActive.code} />
              <BasicCard title={t('contractCanApprovedFieldLabel')}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  mb={+status == -1 ? '' : '-8px'}
                >
                  <Box flex={1}>
                    <RadioGroupField
                      name={'status'}
                      options={statusOptions}
                      label={t('contractStatusLeaderLabel')}
                      disabled={
                        !contractActive?.hasOrder && isPermissionUpdate('contracts_approve_leader')
                          ? false
                          : true
                      }
                    />

                    <Collapse in={+status == -1}>
                      <InputField
                        name="memo"
                        label={t('quoteMemoFieldLabel')}
                        placeholder={t('quotPlaceholderFieldLabel')}
                        rows={3}
                        disabled={
                          !contractActive?.hasOrder &&
                          isPermissionUpdate('contracts_approve_leader')
                            ? false
                            : true
                        }
                      />
                    </Collapse>
                  </Box>
                  <Box flex={1}>
                    <RadioGroupField
                      label={t('contractStatusDirectorLabel')}
                      name={'statusDirector'}
                      options={statusOptions}
                      disabled={
                        !contractActive?.hasOrder &&
                        isPermissionUpdate('contracts_approve_director')
                          ? false
                          : true
                      }
                    />

                    <Collapse in={+statusDirector == -1}>
                      <InputField
                        name="memoDirector"
                        label={t('quoteMemoFieldLabel')}
                        placeholder={t('quotPlaceholderFieldLabel')}
                        rows={3}
                      />
                    </Collapse>
                  </Box>
                </Stack>
              </BasicCard>

              <BasicCard title={t('contractDetailQuoteLabel')}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <ItemRow
                      title={t('contractCodeQuoteLabel')}
                      description={contractActive.quote?.code}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <ItemRow
                      title={t('contractContractorLabel')}
                      description={contractActive.quote?.contractor?.name}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <ItemRow
                      title={t('contractProjectLabel')}
                      description={contractActive.quote?.project?.name}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <ItemRow
                      title={t('contractAddressLabel')}
                      description={
                        contractActive.quote?.district?.title +
                        ', ' +
                        contractActive.quote?.province?.title
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ItemRow
                      title={t('contractPaymentMethodLabel')}
                      description={
                        contractActive.quote?.paymentMethodOther
                          ? contractActive.quote?.paymentMethodOther
                          : contractActive.quote?.paymentMethod.title
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ItemRow
                      title={t('contractStaffAuthorLabel')}
                      description={contractActive.quote.staffAuthor.name}
                    />
                  </Grid>
                  {contractActive?.quote?.paymentMethodNote && (
                    <Grid item xs={12} md={6}>
                      <ItemRow
                        title={t('contractPaymentMethodNoteLabel')}
                        description={contractActive?.quote?.paymentMethodNote}
                      />
                    </Grid>
                  )}
                </Grid>

                <ProductDataTable products={contractActive?.quote?.items} />
              </BasicCard>
              {contractActive && contractActive?.id > 0 && (
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
                  <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
                </Stack>
              )}
            </React.Fragment>
          )}

          {contractActive && <LogActivity logsList={contractActive.logs} />}
        </Stack>

        <ModalAction>
          <Stack direction={'row'} justifyContent={'space-between'} width={'100%'}>
            <Box flex={1}>
              {contractActive && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleShowModalCreateOrder}
                  disabled={contractActive.hasOrder || !isPermissionCreate('orders_create')}
                >
                  Tạo đơn hàng
                </Button>
              )}
            </Box>
            <Stack direction={'row'} spacing={2}>
              <ButtonBase btnText={t('quoteBtnClose')} handleClick={handleClose} />
              <ButtonSubmit
                btnText={
                  contractActive && contractActive?.id > 0
                    ? t('contractBtnSubmitUpdate')
                    : t('contractBtnSubmit')
                }
                type="submit"
                disabled={contractActive?.hasOrder || !isPermissionUpdate('contracts_update')}
              />
            </Stack>
          </Stack>
        </ModalAction>
      </FormContainer>

      {openModalCreateOrder && <ModalSubmitOrder />}
    </MainModal>
  )
}
