import {
  ButtonBase,
  ButtonSubmit,
  InputField,
  MainModal,
  ModalAction,
  RadioGroupField,
  SelectField,
} from '@/components'
import { openModalDetailState } from '@/store/common'
import { productCategoryOptionsState, productTypeOptionsState } from '@/store/meta'
import { permissionsRuleState } from '@/store/user'
import { formatDate, t } from '@/utils'
import {
  codeFieldValidation,
  fieldRequired,
  nameFieldValidation,
  standardValidation,
} from '@/utils/validator'
import { Box, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { useRecoilState, useRecoilValue } from 'recoil'
import { submitCreateProductApi, submitUpdateProductApi } from '../api'
import { productActiveState } from '../store'
import { ProductCategoryOptionsType } from '../type'

type ValuesType = {
  productCategoryId: any
  code: string
  title: string
  unit: string
  type: string | any
  standard: string
  memo: string
  createdAt: string
  updatedAt: string
}

export const ModalDetail = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [productActive, setProvinceActive] = useRecoilState(productActiveState)
  const productCategoryOptions = useRecoilValue<ProductCategoryOptionsType[]>(
    productCategoryOptionsState
  )
  const permissionsRule = useRecoilValue(permissionsRuleState)

  const productTypeOptions = useRecoilValue(productTypeOptionsState)

  // Initial values
  const defaultValues: ValuesType = {
    productCategoryId: productActive?.productCategory?.id ?? '',
    title: productActive?.title ?? '',
    code: productActive?.code ?? '',
    type: productActive?.type.toString() ?? '1',
    unit: 'Tấn',
    standard: productActive?.standard ?? '',
    memo: productActive?.memo ?? '',
    createdAt: formatDate(productActive?.createdAt as string) ?? '',
    updatedAt: formatDate(productActive?.updatedAt as string) ?? '',
  }

  // Define form context
  const formContext = useForm<ValuesType>({
    defaultValues: defaultValues,
  })

  // Handle close modal
  const handleClose = () => {
    setOpenModalDetail(!openModalDetail)
    setProvinceActive(null)
    formContext.reset()
  }

  // Handle submit
  const onHandleSubmit = (data: ValuesType) => {
    data.type = +data.type

    if (productActive && productActive?.id > 0) {
      const productActiveId = productActive && productActive?.id > 0 ? productActive?.id : 0
      submitUpdateProductApi(data, productActiveId, handleClose)
    } else {
      submitCreateProductApi(data, () => {
        handleClose()
      })
    }
  }

  return (
    <MainModal
      open={openModalDetail}
      maxWidth="sm"
      title={
        productActive && productActive?.id > 0 ? t('productModalUpdate') : t('productModalCreate')
      }
    >
      <FormContainer onSuccess={onHandleSubmit} formContext={formContext}>
        <Stack spacing={2} pb={9}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <SelectField
              name="productCategoryId"
              label={t('productCategoryFieldLabel')}
              required
              placeholder={t('productCategoryFieldPlaceholder')}
              validation={fieldRequired(t('productCategoryRequiredValidation'))}
              options={productCategoryOptions}
              disabled={
                productActive ? (permissionsRule.includes('products_update') ? false : true) : false
              }
            />

            <InputField
              name={'code'}
              required
              label={t('productCodeFieldLabel')}
              placeholder={t('productCodeFieldPlaceholder')}
              validation={codeFieldValidation(
                t('productCodeRequiredValidation'),
                t('productCodeMaxLengthValidation')
              )}
              disabled={
                productActive ? (permissionsRule.includes('products_update') ? false : true) : false
              }
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Box flex={1}>
              <InputField
                name={'title'}
                required
                label={t('productNameFieldLabel')}
                placeholder={t('productNameFieldPlaceholder')}
                validation={nameFieldValidation(
                  t('productNameRequiredValidation'),
                  t('productNameMaxLengthValidation')
                )}
                disabled={
                  productActive
                    ? permissionsRule.includes('products_update')
                      ? false
                      : true
                    : false
                }
              />
            </Box>
          </Stack>
          <RadioGroupField
            name="type"
            label={t('productTypeFieldLabel')}
            options={productTypeOptions}
            disabled={
              productActive ? (permissionsRule.includes('products_update') ? false : true) : false
            }
          />

          <InputField
            name={'standard'}
            label={t('productStandardFieldLabel')}
            placeholder={t('productStandardFieldPlaceholder')}
            validation={standardValidation(t('productStandardMaxLengthValidation'))}
            disabled={
              productActive ? (permissionsRule.includes('products_update') ? false : true) : false
            }
          />

          <InputField
            name={'memo'}
            label={t('productMemoFieldLabel')}
            placeholder={t('productMemoFieldPlaceholder')}
            validation={standardValidation(t('productMemoMaxLengthValidation'))}
            rows={4}
            disabled={
              productActive ? (permissionsRule.includes('products_update') ? false : true) : false
            }
          />

          {productActive && productActive?.id > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <InputField name="createdAt" disabled label={t('createdAtFieldLabel')} />
              <InputField name="updatedAt" disabled label={t('updateAtFieldLabel')} />
            </Stack>
          )}
        </Stack>

        <ModalAction>
          <ButtonBase btnText={t('productBtnClose')} handleClick={handleClose} />
          {permissionsRule.includes('products_update') ? (
            <ButtonSubmit
              btnText={
                productActive && productActive?.id > 0
                  ? t('productBtnSubmitUpdate')
                  : t('productBtnSubmit')
              }
              type="submit"
            />
          ) : null}
        </ModalAction>
      </FormContainer>
    </MainModal>
  )
}
