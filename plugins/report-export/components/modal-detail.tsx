import { BasicCard, ItemRow, MainModal } from '@/components'
import { openModalDetailState } from '@/store/common'
import { formatPrice, formatQty, t, totalPriceReportProduct } from '@/utils'
import { Stack } from '@mui/material'
import { useRecoilState } from 'recoil'
import { reportExportActiveState } from '../store'

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [reportExportActive, setReportExportActive] = useRecoilState(reportExportActiveState)

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setReportExportActive(null)
  }

  return (
    <MainModal
      open={openModalDetail}
      maxWidth="sm"
      onClose={() => {
        handleClose()
      }}
    >
      {reportExportActive && (
        <BasicCard title={t('reportExportDetailLabel')}>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
            <ItemRow
              title={t('reportExportCodeLabel')}
              description={reportExportActive?.schedule?.supplier?.code}
            />
            <ItemRow
              title={t('reportExportPlaceDeliveryLabel')}
              description={reportExportActive?.placeDelivery}
            />
          </Stack>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
            <ItemRow
              title={t('reportExportProductTypeLabel')}
              description={reportExportActive?.schedule?.product?.title}
            />
            <ItemRow
              title={t('reportExportVehicleCodeLabel')}
              description={reportExportActive?.vehicle.code}
            />
          </Stack>

          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
            <ItemRow
              title={t('reportExportProductWeightLabel')}
              description={
                <>
                  {formatQty(
                    Math.abs(reportExportActive?.secondaryWeight - reportExportActive?.firstWeight)
                  )}

                  {reportExportActive?.unit}
                </>
              }
            />
            <ItemRow
              title={t('reportExportPriceLabel')}
              description={formatPrice(reportExportActive?.price ?? 0)}
            />
          </Stack>

          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
            <ItemRow
              title={t('reportExportTotalPriceLabel')}
              description={totalPriceReportProduct(reportExportActive)}
            />
            <ItemRow
              title={t('reportExportShipUnitLabel')}
              description={reportExportActive?.schedule?.shippingUnit}
            />
          </Stack>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
            <ItemRow title={t('createdAtFieldLabel')} description={reportExportActive?.createdAt} />
            <ItemRow title={t('updateAtFieldLabel')} description={reportExportActive?.updatedAt} />
          </Stack>
        </BasicCard>
      )}
    </MainModal>
  )
}
