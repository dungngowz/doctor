import {
  BasicCard,
  ButtonAddNew,
  IconButtonClose,
  InputField,
  NumericFieldController,
  SelectField,
} from '@/components'
import { productUnitOptionsState } from '@/store/meta'
import { OptionsType } from '@/types'
import { formatPrice, t } from '@/utils'
import { fieldRequired, priceFieldValidation, qtyFieldValidation } from '@/utils/validator'
import { Box, Stack, Tooltip, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import { useRecoilValue } from 'recoil'

type ProductItemsType = {
  productId: number | string
  price: number | string
  qty: number | string
  memo: string
  unit: string
}

type IProps = {
  productItems: ProductItemsType[]
  productOptions: OptionsType[]
  totalPriceQuote: number
  handleAppendProduct: () => void
  handleRemoveProduct: (index: number) => void
  formContext: any
  isDisable: boolean
}

export default function ProductItemsArray(props: IProps) {
  const {
    productItems,
    productOptions = [],
    totalPriceQuote,
    formContext,
    handleAppendProduct,
    handleRemoveProduct,
    isDisable = false,
  } = props

  const productUnitOptions = useRecoilValue(productUnitOptionsState)

  return (
    <BasicCard title={t('quoteProductLabel')}>
      <Stack>
        {productItems.map((item, index) => {
          return (
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              key={index}
              pb={2}
              alignItems="flex-start"
            >
              <SelectField
                name={`items.${index}.productId`}
                label={t('quoteProductIdSelectLabel')}
                required
                placeholder={t('quoteProductIdSelectPlaceholder')}
                validation={fieldRequired(t('quoteProductIdfSelectRequiredValidation'))}
                options={productOptions}
                disabled={isDisable}
              />

              <Box width={160} flexShrink={0}>
                <SelectField
                  name={`items.${index}.unit`}
                  label={t('quoteUnitSelectLabel')}
                  required
                  placeholder={t('quoteUnitSelectPlaceholder')}
                  validation={fieldRequired(t('quoteUnitSelectRequiredValidation'))}
                  options={productUnitOptions}
                  disabled={isDisable}
                />
              </Box>

              <Box width={160} flexShrink={0}>
                <NumericFieldController
                  name={`items.${index}.price`}
                  formContext={formContext}
                  required
                  label={t('quoteProductPriceField')}
                  placeholder={t('quoteProductPricePlaceholder')}
                  validation={priceFieldValidation()}
                  align="right"
                  disabled={isDisable}
                />
              </Box>

              <Box width={160} flexShrink={0}>
                <NumericFieldController
                  name={`items.${index}.qty`}
                  formContext={formContext}
                  required
                  label={t('quoteProductQtyField')}
                  placeholder={t('quoteProductQtyPlaceholder')}
                  validation={qtyFieldValidation()}
                  align="right"
                  disabled={isDisable}
                />
              </Box>

              <InputField
                name={`items.${index}.memo`}
                label="Ghi chú"
                placeholder={t('Nhập ghi chú')}
                disabled={isDisable}
              />

              <Tooltip title="Xoá sản phẩm" arrow>
                <Box
                  pt={{ xs: 0, md: 2.6 }}
                  ml="2px !important"
                  display="flex"
                  justifyContent={'flex-end'}
                >
                  <IconButtonClose
                    edge="end"
                    color="error"
                    handleClick={() => handleRemoveProduct(index)}
                    disabled={productItems?.length <= 1 ? true : isDisable ? true : false}
                  />
                </Box>
              </Tooltip>
            </Stack>
          )
        })}
      </Stack>

      <Stack
        mt={'-2px !important'}
        direction={'row'}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction={'row'} spacing={1}>
          <Typography fontSize={'14px'} fontWeight={600}>
            {t('quoteTotalPriceLabel')}
          </Typography>
          <Typography fontSize={'14px'} fontWeight={600} color={red[600]}>
            {formatPrice(totalPriceQuote)}
          </Typography>
        </Stack>
        <ButtonAddNew
          btnText={t('quoteBtnAddProduct')}
          variant="filledTonal"
          handleClick={handleAppendProduct}
          disabled={isDisable}
        />
      </Stack>
    </BasicCard>
  )
}
