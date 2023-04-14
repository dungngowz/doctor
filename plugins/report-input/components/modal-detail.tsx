import { BasicCard, ItemRow, MainModal } from '@/components'
import { openModalDetailState } from '@/store/common'
import { t, totalPriceReportProduct } from '@/utils'
import { Stack } from '@mui/material'
import { useRecoilState } from 'recoil'
import { reportInputActiveState } from '../store'

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [reportInputActive, setReportInputActive] = useRecoilState(reportInputActiveState)

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setReportInputActive(null)
  }

  return (
    <MainModal
      open={openModalDetail}
      maxWidth="sm"
      onClose={() => {
        handleClose()
      }}
    >
      <BasicCard title={t('reportInputDetailLabel')}>
        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
          <ItemRow
            title={t('reportInputCodeLabel')}
            description={reportInputActive?.supplier?.name}
          />
          <ItemRow
            title={t('reportInputPlaceDeliveryLabel')}
            description={reportInputActive?.placeDelivery}
          />
        </Stack>
        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
          <ItemRow
            title={t('reportInputProductTypeLabel')}
            description={reportInputActive?.product?.productCategory?.title}
          />
          <ItemRow
            title={t('reportInputVehicleCodeLabel')}
            description={reportInputActive?.vehicle.code}
          />
        </Stack>

        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
          <ItemRow
            title={t('reportInputProductWeightLabel')}
            description={reportInputActive?.productWeightFormatted}
          />
          <ItemRow
            title={t('reportInputPriceLabel')}
            description={reportInputActive?.priceFormatted}
          />
        </Stack>

        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
          <ItemRow
            title={t('reportInputTotalPriceLabel')}
            description={totalPriceReportProduct(reportInputActive)}
          />
          <ItemRow
            title={t('reportInputShipUnitLabel')}
            description={reportInputActive?.shippingUnit}
          />
        </Stack>
        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
          <ItemRow title={t('createdAtFieldLabel')} description={reportInputActive?.createdAt} />
          <ItemRow title={t('updateAtFieldLabel')} description={reportInputActive?.updatedAt} />
        </Stack>
      </BasicCard>
    </MainModal>
  )
}
