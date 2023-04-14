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
import { quoteActiveState } from '@/plugins/quote/store'
import { getScheduleDetailApi } from '@/plugins/schedules/api'
import { schedulesActiveState } from '@/plugins/schedules/store'
import { openModalDetailState } from '@/store/common'
import { vehiclesOptionsState } from '@/store/meta'
import { formatDate, t } from '@/utils'
import {
  fieldRequired,
  firstTimeExportFieldValidation,
  secondaryTimeExportFieldValidation,
  weightFieldValidation,
} from '@/utils/validator'
import { Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { submitUpdateProductDeliveringApi } from '../api'
import { totalRemainingMass } from '../handlers'
import { productDeliveringActiveState } from '../store'

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
  const [productDeliveringActive, setProductDeliveringActive] = useRecoilState(
    productDeliveringActiveState
  )

  const schedulesActive = useRecoilValue(schedulesActiveState)

  // Options
  const vehiclesOptions = useRecoilValue(vehiclesOptionsState)

  // Initial values
  const defaultValues: ValuesType = {
    scheduleId: scheduleId,
    vehicleId: productDeliveringActive?.vehicle?.id ?? '',
    firstWeight: productDeliveringActive?.firstWeight ?? '',
    secondaryWeight: productDeliveringActive?.secondaryWeight ?? '',
    firstTimeExport: productDeliveringActive?.firstTimeExport ?? '',
    secondaryTimeExport: productDeliveringActive?.secondaryTimeExport ?? '',
    placeDelivery: productDeliveringActive?.placeDelivery ?? '',
    consigneeName: productDeliveringActive?.consigneeName ?? '',
    createdAt: formatDate(productDeliveringActive?.createdAt as string) ?? '',
    updatedAt: formatDate(productDeliveringActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  const { setValue, getValues, watch } = formContext

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setProductDeliveringActive(null)
    setRecoil(quoteActiveState, null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    data.firstTimeExport = formatDate(data.firstTimeExport, 'YYYY-MM-DD HH:mm:ss')
    data.secondaryTimeExport = formatDate(data.secondaryTimeExport, 'YYYY-MM-DD HH:mm:ss')
    if (productDeliveringActive && productDeliveringActive?.id > 0) {
      const productDeliveringActiveId =
        productDeliveringActive && productDeliveringActive?.id > 0 ? productDeliveringActive?.id : 0
      submitUpdateProductDeliveringApi(data, productDeliveringActiveId, handleClose)
    }
  }

  useEffect(() => {
    getScheduleDetailApi(scheduleId)
  }, [scheduleId])

  useEffect(() => {
    if (schedulesActive && !productDeliveringActive) {
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
        productDeliveringActive && productDeliveringActive?.id > 0
          ? t('productDeliveringModalUpdate')
          : t('productDeliveringModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack pb={9} spacing={2}>
          {productDeliveringActive && (
            <Stack>
              <Typography className="input-label">
                {t('productDeliveringContractorNameLabel')}
              </Typography>
              <Typography fontWeight={600} fontSize={'13px'} color={brand.gray600}>
                {productDeliveringActive?.schedule?.supplier?.name}
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
              label={t('productDeliveringFirstWeightHeadCell')}
              align="right"
              placeholder="VD: 100"
            />
            <NumericFieldController
              name="secondaryWeight"
              required
              label={t('productDeliveringSecondWeightHeadCell')}
              formContext={formContext}
              validation={weightFieldValidation()}
              align="right"
              placeholder="VD: 100"
            />
          </Stack>

          {productDeliveringActive && (
            <Stack
              direction={'row'}
              justifyContent="flex-end"
              spacing={2}
              alignItems="center"
              mt={'6px !important'}
            >
              <Typography color={brand.gray600} fontSize="13px">
                {t('productDeliveringQtyProductLabel')}:
              </Typography>
              <Typography fontWeight={600} fontSize={'13px'}>
                {totalRemainingMass(+secondaryWeight, +firstWeight)}
              </Typography>
            </Stack>
          )}

          <DateTimePicker
            name="firstTimeExport"
            minDate={dayjs()}
            label={t('productDeliveringFirstTimeExportLabel')}
            required
            validation={firstTimeExportFieldValidation()}
          />
          <DateTimePicker
            name="secondaryTimeExport"
            minDate={dayjs()}
            label={t('productDeliveringSecondTimeExportLabel')}
            required
            validation={secondaryTimeExportFieldValidation()}
          />
          <InputField
            name="placeDelivery"
            label={t('productDeliveringPlaceDeliveryExportLabel')}
            placeholder={t('productDeliveringPlaceDeliveryExportPlaceholder')}
          />
          <InputField
            name="consigneeName"
            label={t('productDeliveringConsigneeNameExportLabel')}
            placeholder={t('productDeliveringConsigneeNameExportPlaceholder')}
          />
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('quoteBtnClose')} handleClick={handleClose} />
          <ButtonSubmit
            btnText={
              productDeliveringActive && productDeliveringActive?.id > 0
                ? t('productDeliveringBtnSubmitUpdate')
                : t('productDeliveringBtnSubmit')
            }
            type="submit"
          />
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
