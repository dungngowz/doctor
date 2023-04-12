import {
  BasicCard,
  ButtonBase,
  ButtonSubmit,
  ItemRow,
  MainModal,
  ModalAction,
  ProductDataTable,
} from '@/components'
import { submitCreateContractApi } from '@/plugins/contract/api'
import { quoteActiveState } from '@/plugins/quote/store'
import { openModalDetailState } from '@/store/common'
import { formatDate, t } from '@/utils'
import { Grid, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'

type ValuesType = {
  quoteId: number
}

type IProps = {
  openModal: boolean
  handleClose: () => void
}

export default function ModalCreateContract(props: IProps) {
  // Props
  const { openModal = false, handleClose } = props

  // State
  const router = useRouter()

  // Recoil
  const quoteActive = useRecoilValue(quoteActiveState)

  // Initial values
  const defaultValues: ValuesType = {
    quoteId: quoteActive?.id ?? 0,
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    submitCreateContractApi(data, () => {
      router.push('/sales/contract')
      setRecoil(openModalDetailState, false)
    })
  }

  return (
    <MainModal open={openModal} maxWidth="md" title={t('contractModalCreate')}>
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        {quoteActive && (
          <Stack pb={9} spacing={2}>
            <BasicCard>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <ItemRow title={t('contractCodeQuoteLabel')} description={quoteActive?.code} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ItemRow
                    title={t('contractProjectLabel')}
                    description={quoteActive?.project?.name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ItemRow
                    title={t('contractContractorLabel')}
                    description={quoteActive?.contractor?.name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ItemRow
                    title={t('Nhà thầu phụ')}
                    description={quoteActive?.contractorSub?.name}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <ItemRow
                    title={t('contractAddressLabel')}
                    description={quoteActive?.district?.title + ', ' + quoteActive?.province?.title}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ItemRow
                    title={t('Hình thức bán hàng')}
                    description={quoteActive?.salesForm?.title}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ItemRow
                    title={t('contractPaymentMethodLabel')}
                    description={
                      quoteActive?.paymentMethodOther
                        ? quoteActive?.paymentMethodOther
                        : quoteActive?.paymentMethod.title
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ItemRow
                    title={t('Phương thức thanh toán')}
                    description={quoteActive?.paymentMethodNote ?? '--'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ItemRow
                    title={t('Người tạo báo giá')}
                    description={quoteActive?.staffAuthor?.name ?? '--'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ItemRow
                    title={t('Người duyệt báo giá')}
                    description={quoteActive?.staffConfirm?.name ?? '--'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ItemRow
                    title={t('Thời hạn báo giá')}
                    description={formatDate(quoteActive?.durationQuote, 'DD/MM/YYYY')}
                  />
                </Grid>
              </Grid>

              <ProductDataTable products={quoteActive?.items} />
            </BasicCard>
          </Stack>
        )}

        <ModalAction>
          <ButtonBase btnText={t('quoteBtnClose')} handleClick={handleClose} />
          <ButtonSubmit btnText={t('contractBtnSubmit')} type="submit" />
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
