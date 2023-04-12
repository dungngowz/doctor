import {
  ButtonBase,
  ButtonSubmit,
  DateTimePicker,
  InputField,
  MainModal,
  ModalAction,
  NumericFieldController,
  SelectField,
} from '@/components'
import { brand } from '@/components/colors/brand'
import { getAllVehiclesOptionsApi } from '@/meta/common'
import { totalRemainingMass } from '@/plugins/product-delivering/handlers'
import { quoteActiveState } from '@/plugins/quote/store'
import { schedulesActiveState } from '@/plugins/schedules/store'
import { openModalDetailState } from '@/store/common'
import { vehiclesOptionsState } from '@/store/meta'
import { formatDate, t } from '@/utils'
import {
  fieldRequired,
  firstTimeExportFieldValidation,
  secondaryTimeExportFieldValidation,
  secondaryWeightFieldValidation,
  weightFieldValidation,
} from '@/utils/validator'
import { Stack, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { submitCreateProductDeliveryApi, submitUpdateProductDeliveryApi } from '../api'
import { currentIndexSelectedState, productDeliveryActiveState } from '../store'

type ValuesType = {
  scheduleId: number
  vehicleId: number | string
  firstWeight: number | string
  secondaryWeight: number | string
  firstTimeExport: string | any
  secondaryTimeExport: string | any
  placeDelivery: string
  consigneeName: string
  createdAt?: string
  updatedAt?: string
}

type IProps = {
  scheduleId: number
}

export const ModalDetail = (props: IProps) => {
  // Props
  const { scheduleId } = props

  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [productDeliveryActive, setProductDeliveryActive] = useRecoilState(
    productDeliveryActiveState
  )

  const schedulesActive = useRecoilValue(schedulesActiveState)

  // Options
  const vehiclesOptions = useRecoilValue(vehiclesOptionsState)

  // Initial values
  const defaultValues: ValuesType = {
    scheduleId: scheduleId,
    vehicleId: productDeliveryActive?.vehicle?.id ?? '',
    firstWeight: productDeliveryActive?.firstWeight ?? '',
    secondaryWeight: productDeliveryActive?.secondaryWeight ?? '',
    firstTimeExport: productDeliveryActive?.firstTimeExport ?? '',
    secondaryTimeExport: productDeliveryActive?.secondaryTimeExport ?? '',
    placeDelivery: productDeliveryActive?.placeDelivery ?? '',
    consigneeName: productDeliveryActive?.consigneeName ?? '',
    createdAt: formatDate(productDeliveryActive?.createdAt as string) ?? '',
    updatedAt: formatDate(productDeliveryActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  const { setValue, watch } = formContext

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setProductDeliveryActive(null)
    setRecoil(quoteActiveState, null)
    setRecoil(currentIndexSelectedState, -1)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    data.firstTimeExport = formatDate(data.firstTimeExport, 'YYYY-MM-DD HH:mm:ss')
    data.secondaryTimeExport = formatDate(data.secondaryTimeExport, 'YYYY-MM-DD HH:mm:ss')
    if (productDeliveryActive && productDeliveryActive?.id > 0) {
      const productDeliveryActiveId =
        productDeliveryActive && productDeliveryActive?.id > 0 ? productDeliveryActive?.id : 0
      submitUpdateProductDeliveryApi(data, productDeliveryActiveId, handleClose)
    } else {
      submitCreateProductDeliveryApi(data, () => {
        handleClose()
      })
    }
  }

  useEffect(() => {
    if (schedulesActive && !productDeliveryActive) {
      setValue('placeDelivery', schedulesActive.placeDelivery)
      setValue('consigneeName', schedulesActive.consigneeName)
    }
  }, [schedulesActive])

  // Get options
  useEffect(() => {
    getAllVehiclesOptionsApi()
  }, [openModalDetail])

  // Watch value
  const firstWeight = watch('firstWeight')
  const secondaryWeight = watch('secondaryWeight')

  return (
    <MainModal
      open={openModalDetail}
      title={
        productDeliveryActive && productDeliveryActive?.id > 0
          ? t('productDeliveryModalUpdate')
          : t('productDeliveryModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack pb={9} spacing={2}>
          {productDeliveryActive && (
            <Stack>
              <Typography className="input-label">
                {t('productDeliveryContractorNameLabel')}
              </Typography>
              <Typography fontWeight={600} fontSize={'13px'} color={brand.gray600}>
                {productDeliveryActive?.schedule?.supplier?.name}
              </Typography>
            </Stack>
          )}
          <SelectField
            name="vehicleId"
            required
            label="Số xe"
            placeholder="Chọn số xe"
            validation={fieldRequired('Vui lòng chọn số xe')}
            options={vehiclesOptions}
          />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <NumericFieldController
              name="firstWeight"
              required
              formContext={formContext}
              validation={weightFieldValidation()}
              label={t('productDeliveryFirstWeightHeadCell')}
              align="right"
              placeholder="VD: 100"
            />
            <NumericFieldController
              name="secondaryWeight"
              required
              label={t('productDeliverySecondWeightHeadCell')}
              formContext={formContext}
              validation={secondaryWeightFieldValidation(false)}
              align="right"
              placeholder="VD: 100"
            />
          </Stack>

          {productDeliveryActive && (
            <Stack direction={'row'} justifyContent="flex-end" mt={'6px !important'} spacing={2}>
              <Typography className="input-label">{t('productDeliveryQtyProductLabel')}</Typography>
              <Typography fontWeight={600} fontSize={'13px'} color={red[600]}>
                {totalRemainingMass(+secondaryWeight, +firstWeight)}
              </Typography>
            </Stack>
          )}

          <DateTimePicker
            name="firstTimeExport"
            minDate={dayjs()}
            label={t('productDeliveryFirstTimeExportLabel')}
            required
            validation={firstTimeExportFieldValidation()}
          />
          <DateTimePicker
            name="secondaryTimeExport"
            minDate={dayjs()}
            label={t('productDeliverySecondTimeExportLabel')}
            required
            validation={secondaryTimeExportFieldValidation()}
          />
          <InputField
            name="placeDelivery"
            label={t('productDeliveryPlaceDeliveryExportLabel')}
            placeholder={t('productDeliveryPlaceDeliveryExportPlaceholder')}
          />
          <InputField
            name="consigneeName"
            label={t('productDeliveryConsigneeNameExportLabel')}
            placeholder={t('productDeliveryConsigneeNameExportPlaceholder')}
          />

          {productDeliveryActive && productDeliveryActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('quoteBtnClose')} handleClick={handleClose} />
          <ButtonSubmit
            btnText={
              productDeliveryActive && productDeliveryActive?.id > 0
                ? t('productDeliveryBtnSubmitUpdate')
                : t('productDeliveryBtnSubmit')
            }
            type="submit"
          />
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
