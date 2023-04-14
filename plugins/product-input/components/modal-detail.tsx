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
import {
  getAllProductOptionsApi,
  getAllSuppliersOptionsApi,
  getAllVehiclesOptionsApi,
} from '@/meta/common'
import { totalRemainingMass } from '@/plugins/product-delivering/handlers'
import { openModalDetailState } from '@/store/common'
import { productOptionsState, suppliersOptionsState, vehiclesOptionsState } from '@/store/meta'
import { userState } from '@/store/user'
import { formatDate, isPermissionUpdate, t } from '@/utils'
import {
  fieldRequired,
  firstWeightFieldValidation,
  placeDeliveryFieldValidation,
  priceFieldValidation,
  secondaryWeightFieldValidation,
  shippingUnitFieldValidation,
} from '@/utils/validator'
import { Stack, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { submitCreateProductInputApi, submitUpdateProductInputApi } from '../api'
import { productInputActiveState } from '../store'

type ValuesType = {
  productId: string | number
  vehicleId: string | number
  supplierId: string | number
  firstWeight: string | number
  secondaryWeight: string | number
  firstTimeInput: string
  secondaryTimeInput: string
  placeDelivery: string
  shippingUnit: string
  price: string | number
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [productInputActive, setProductInputActive] = useRecoilState(productInputActiveState)
  const user = useRecoilValue(userState)

  // Options
  const productOptions = useRecoilValue(productOptionsState)
  const vehiclesOptions = useRecoilValue(vehiclesOptionsState)
  const suppliersOptions = useRecoilValue(suppliersOptionsState)

  // Local State
  const [productCurrentSelected, setProductCurrentSelected] = useState<any>()

  // Initial values
  const defaultValues: ValuesType = {
    productId: productInputActive?.product?.id ?? '',
    vehicleId: productInputActive?.vehicle?.id ?? '',
    supplierId: productInputActive?.supplier?.id ?? '',
    firstWeight: productInputActive?.firstWeight ?? '',
    secondaryWeight: productInputActive?.secondaryWeight ?? '',
    firstTimeInput: productInputActive?.firstTimeInput ?? '',
    secondaryTimeInput: productInputActive?.secondaryTimeInput ?? '',
    placeDelivery: productInputActive?.placeDelivery ?? '',
    shippingUnit: productInputActive?.shippingUnit ?? '',
    price: productInputActive?.price ?? '',
    createdAt: formatDate(productInputActive?.createdAt as string) ?? '',
    updatedAt: formatDate(productInputActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  const { watch, getValues, setValue } = formContext

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setProductInputActive(null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    data.firstTimeInput = formatDate(data.firstTimeInput, 'YYYY-MM-DD hh:mm:ss')
    data.secondaryTimeInput = formatDate(data.secondaryTimeInput, 'YYYY-MM-DD hh:mm:ss')
    if (productInputActive && productInputActive?.id > 0) {
      const productInputActiveId =
        productInputActive && productInputActive?.id > 0 ? productInputActive?.id : 0
      submitUpdateProductInputApi(data, productInputActiveId, handleClose)
    } else {
      submitCreateProductInputApi(data, () => {
        handleClose()
      })
    }
  }

  const firstWeight = watch('firstWeight')
  const secondaryWeight = watch('secondaryWeight')

  // Watch product change
  useEffect(() => {
    const onProductWatch = watch((initialValue, { name, type }) => {
      if (productInputActive && name === 'productId') {
        const productId = getValues('productId')
        const product = productOptions.find((item) => item.id == productId)
        setProductCurrentSelected(product)
      }
    })

    // on First mount
    const productId = getValues('productId')
    const product = productOptions.find((item) => item.id == productId)
    setProductCurrentSelected(product)
    return () => onProductWatch.unsubscribe()
  }, [openModalDetail, watch])

  // Set station default from me api
  useEffect(() => {
    if (user?.station) {
      setValue('placeDelivery', user?.station?.address ?? '')
    }
  }, [user])

  // Get options
  useEffect(() => {
    const productParams = {
      type: 1,
    }
    getAllProductOptionsApi(productParams)
    getAllVehiclesOptionsApi()
    getAllSuppliersOptionsApi()
  }, [])

  return (
    <MainModal
      open={openModalDetail}
      maxWidth="sm"
      title={
        productInputActive && productInputActive?.id > 0
          ? t('productInputModalUpdate')
          : t('productInputModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} pb={9}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <SelectField
              name="productId"
              label={t('productInputProductFieldLabel')}
              placeholder={t('productInputProductFieldPlaceholder')}
              options={productOptions}
              required
              validation={fieldRequired(t('productInputProductRequiredValidation'))}
              disabled={
                productInputActive
                  ? isPermissionUpdate('product_input_update')
                    ? false
                    : true
                  : false
              }
            />
            <SelectField
              name="vehicleId"
              label={t('productInputVehicleFieldLabel')}
              placeholder={t('productInputVehicleFieldPlaceholder')}
              options={vehiclesOptions}
              required
              validation={fieldRequired(t('productInputVehicleRequiredValidation'))}
              disabled={
                productInputActive
                  ? isPermissionUpdate('product_input_update')
                    ? false
                    : true
                  : false
              }
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <SelectField
              name="supplierId"
              label={t('productInputSupplierFieldLabel')}
              placeholder={t('productInputSupplierFieldPlaceholder')}
              options={suppliersOptions}
              required
              validation={fieldRequired(t('productInputSupplierRequiredValidation'))}
              disabled={
                productInputActive
                  ? isPermissionUpdate('product_input_update')
                    ? false
                    : true
                  : false
              }
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <NumericFieldController
              formContext={formContext}
              align="right"
              name="firstWeight"
              label={t('productInputFirstWeightFieldLabel')}
              placeholder={t('productInputFirstWeightFieldPlaceholder')}
              required
              validation={firstWeightFieldValidation()}
              disabled={
                productInputActive
                  ? isPermissionUpdate('product_input_update')
                    ? false
                    : true
                  : false
              }
            />
            <NumericFieldController
              formContext={formContext}
              align="right"
              name="secondaryWeight"
              label={t('productInputSecondaryWeightFieldLabel')}
              placeholder={t('productInputSecondaryWeightFieldPlaceholder')}
              required
              validation={secondaryWeightFieldValidation()}
              disabled={
                productInputActive
                  ? isPermissionUpdate('product_input_update')
                    ? false
                    : true
                  : false
              }
            />
          </Stack>
          {productInputActive && +firstWeight > 0 && +secondaryWeight > 0 ? (
            <Stack
              direction={'row'}
              justifyContent="flex-end"
              mt={'6px !important'}
              spacing={1}
              alignItems="center"
            >
              <Typography color={brand.gray600} fontSize="13px">
                {t('productInputTotalLabel')}
              </Typography>
              <Typography fontWeight={600} fontSize={'13px'} color={red[600]}>
                {totalRemainingMass(+secondaryWeight, +firstWeight)} {productCurrentSelected?.unit}
              </Typography>
            </Stack>
          ) : null}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <DateTimePicker
              name="firstTimeInput"
              minDate={dayjs()}
              label={t('productInputFirstTimeInputFieldLabel')}
              required
              validation={fieldRequired(t('productInputFirstTimeInputRequiredValidation'))}
              disabled={
                productInputActive
                  ? isPermissionUpdate('product_input_update')
                    ? false
                    : true
                  : false
              }
            />
            <DateTimePicker
              name="secondaryTimeInput"
              minDate={dayjs()}
              label={t('productInputSecondaryTimeInputFieldLabel')}
              required
              validation={fieldRequired(t('productInputSecondaryTimeInputRequiredValidation'))}
              disabled={
                productInputActive
                  ? isPermissionUpdate('product_input_update')
                    ? false
                    : true
                  : false
              }
            />
          </Stack>

          <InputField
            name="placeDelivery"
            label={t('productInputPlaceDeliveryFieldLabel')}
            placeholder={t('productInputPlaceDeliveryFieldPlaceholder')}
            required
            validation={placeDeliveryFieldValidation()}
            disabled={
              productInputActive
                ? isPermissionUpdate('product_input_update')
                  ? false
                  : true
                : false
            }
          />

          <InputField
            name="shippingUnit"
            label={t('productInputShippingUnitFieldLabel')}
            placeholder={t('productInputShippingUnitFieldPlaceholder')}
            required
            validation={shippingUnitFieldValidation()}
            disabled={
              productInputActive
                ? isPermissionUpdate('product_input_update')
                  ? false
                  : true
                : false
            }
          />

          <NumericFieldController
            formContext={formContext}
            align="right"
            name="price"
            label={t('productInputPriceFieldLabel')}
            placeholder={t('productInputPriceFieldPlaceholder')}
            validation={priceFieldValidation(
              t('priceRequiredValidation'),
              t('priceMaxLengthValidation'),
              255,
              false
            )}
            disabled={
              productInputActive
                ? isPermissionUpdate('product_input_update')
                  ? false
                  : true
                : false
            }
          />

          {productInputActive && productInputActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('productBtnClose')} handleClick={handleClose} />

          {productInputActive ? (
            <React.Fragment>
              {isPermissionUpdate('product_input_update') && (
                <ButtonSubmit btnText={t('productBtnSubmitUpdate')} type="submit" />
              )}
            </React.Fragment>
          ) : (
            <ButtonSubmit btnText={t('productBtnSubmit')} type="submit" />
          )}
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
