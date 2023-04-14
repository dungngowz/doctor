import { BasicCard, InputField, RadioGroupField } from '@/components'
import { statusOptionsState } from '@/store/meta'
import { isPermissionUpdate, t } from '@/utils'
import { Box, Collapse, Grid } from '@mui/material'
import { useRecoilValue } from 'recoil'
import { orderActivedState } from '../store'

type IProps = {
  statusBusiness: string | number
  statusAccountant: string | number
  statusDirector: string | number
}

export default function StatusOrder(props: IProps) {
  const { statusBusiness = '0', statusAccountant = '0', statusDirector = '0' } = props

  // Options
  const statusOptions = useRecoilValue(statusOptionsState)
  const orderActived = useRecoilValue(orderActivedState)

  return (
    <>
      {orderActived && (
        <BasicCard title={t('orderAccountantStatusHeadCell')}>
          <Grid container spacing={2} rowSpacing={3}>
            <Grid item xs={6} md={orderActived?.statusAccountant == 1 ? 4 : 6}>
              <Box mt="-4px" mb="-12px" flex={1}>
                <RadioGroupField
                  name={'status'}
                  options={statusOptions}
                  label={t('orderRoomBusiness')}
                  row={orderActived?.statusAccountant == 1 ? false : true}
                  disabled={
                    orderActived?.status != 1 && isPermissionUpdate('orders_approve_leader')
                      ? false
                      : true
                  }
                />

                <Collapse in={+statusBusiness == -1 ? true : false}>
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
            </Grid>

            {orderActived.status == 1 && (
              <Grid item xs={6} md={orderActived?.statusAccountant == 1 ? 4 : 6}>
                <Box mt="-4px" mb="-12px" flex={1}>
                  <RadioGroupField
                    name={'statusAccountant'}
                    options={statusOptions}
                    label={t('Kế toán duyệt')}
                    row={orderActived?.statusAccountant == 1 ? false : true}
                    disabled={
                      orderActived?.statusAccountant != 1 &&
                      isPermissionUpdate('orders_approve_accountant')
                        ? false
                        : true
                    }
                  />

                  <Collapse in={+statusAccountant == -1 ? true : false}>
                    <Box mb={1}>
                      <InputField
                        name="memoAccountant"
                        label={t('quoteMemoFieldLabel')}
                        placeholder={t('quotPlaceholderFieldLabel')}
                        rows={3}
                      />
                    </Box>
                  </Collapse>
                </Box>
              </Grid>
            )}

            {orderActived?.statusAccountant == 1 && (
              <Grid item xs={12} md={4}>
                <Box mt="-4px" mb="-12px" flex={1}>
                  <RadioGroupField
                    name={'statusDirector'}
                    options={statusOptions}
                    label={t('Giám đốc duyệt')}
                    row={false}
                    disabled={
                      !orderActived.hasSchedules && isPermissionUpdate('orders_approve_director')
                        ? false
                        : true
                    }
                  />

                  <Collapse in={+statusDirector == -1 ? true : false}>
                    <Box mb={1}>
                      <InputField
                        name="memoDirector"
                        label={t('quoteMemoFieldLabel')}
                        placeholder={t('quotPlaceholderFieldLabel')}
                        rows={3}
                      />
                    </Box>
                  </Collapse>
                </Box>
              </Grid>
            )}
          </Grid>
        </BasicCard>
      )}
    </>
  )
}
