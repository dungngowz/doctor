import { InputField } from '@/components'
import { brand } from '@/components/colors/brand'
import { isPermissionCreate, t } from '@/utils'
import { PostAdd, ThreePOutlined, Unpublished } from '@mui/icons-material'
import { Box, Button, Collapse, Stack, Typography } from '@mui/material'
import { QuoteType } from '../type'

type IProps = {
  quoteActive: QuoteType
  handleShowModalContract: () => void
  handleRejectFeedback: () => void
}

export default function CustomerFeedback(props: IProps) {
  const { quoteActive, handleShowModalContract, handleRejectFeedback } = props

  return (
    <>
      {quoteActive && quoteActive?.status == 1 && (
        <Stack spacing={1}>
          <Stack direction={'row'} spacing={1}>
            <ThreePOutlined sx={{ color: brand.gray700 }} />
            <Typography className="input-label">{t('quoteCustomerFeedbackLabel')}</Typography>
          </Stack>
          <Stack direction={'row'} spacing={2}>
            <Button
              startIcon={<PostAdd />}
              size="small"
              variant="contained"
              color="success"
              onClick={handleShowModalContract}
              disabled={
                isPermissionCreate('contracts_create') &&
                quoteActive?.customerFeedback >= 0 &&
                !quoteActive.hasContract
                  ? false
                  : true
              }
            >
              {t('quoteCreateContractBtn')}
            </Button>

            <Button
              color="error"
              variant="contained"
              startIcon={<Unpublished />}
              onClick={handleRejectFeedback}
              disabled={quoteActive?.customerFeedback == -1 ? true : false}
              size="small"
            >
              {t('quoteNoFeedBackBtn')}
            </Button>
          </Stack>

          <Collapse in={quoteActive?.customerFeedback == -1 ? true : false}>
            <Stack direction={'row'} spacing={2}>
              <Box flex={1}>
                <InputField
                  rows={3}
                  name="customerFeedbackNote"
                  label={t('quoteCustomerFeedbackNote')}
                  placeholder={t('quoteCustomerFeedbackNotePlaceholder')}
                  disabled
                />
              </Box>
              <Box flex={1}></Box>
              <Box flex={1}></Box>
            </Stack>
          </Collapse>
        </Stack>
      )}
    </>
  )
}
