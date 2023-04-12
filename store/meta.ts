import { OptionsType, ProductOptionsType } from '@/types'
import { t } from '@/utils'
import { atom } from 'recoil'

export const investorTypeOptionsState = atom<OptionsType[]>({
  key: 'investorTypeOptionsState',
  default: [],
})

export const staffOptionsState = atom<OptionsType[]>({
  key: 'staffOptionsState',
  default: [],
})

export const districtOptionsState = atom<OptionsType[]>({
  key: 'districtOptionsState',
  default: [],
})

export const investorOptionsState = atom<OptionsType[]>({
  key: 'investorOptionsState',
  default: [],
})

export const contractorOptionsState = atom<OptionsType[]>({
  key: 'contractorOptionsState',
  default: [],
})

export const departmentOptionsState = atom<OptionsType[]>({
  key: 'departmentOptionsState',
  default: [],
})

export const constructionProgressesOptionsState = atom<OptionsType[]>({
  key: 'constructionProgressesOptionsState',
  default: [],
})

export const projectOptionsState = atom<OptionsType[]>({
  key: 'projectOptionsState',
  default: [],
})

export const productOptionsState = atom<ProductOptionsType[]>({
  key: 'productOptionsState',
  default: [],
})

export const paymentMethodOptionsState = atom<OptionsType[]>({
  key: 'paymentMethodOptionsState',
  default: [],
})

export const provinceOptionsState = atom<OptionsType[]>({
  key: 'provinceOptionsState',
  default: [],
})

export const vehiclesOptionsState = atom<OptionsType[]>({
  key: 'vehiclesOptionsState',
  default: [],
})

export const suppliersOptionsState = atom<OptionsType[]>({
  key: 'suppliersOptionsState',
  default: [],
})

export const statusOptionsState = atom<OptionsType[]>({
  key: 'statusOptionsState',
  default: [
    { id: '1', label: t('quoteCanApprovedAcceptedFieldLabel'), value: '1' },
    { id: '0', label: t('quoteCanApprovedWaitingFieldLabel'), value: '0' },
    { id: '-1', label: t('quoteCanApprovedNotAcceptFieldLabel'), value: '-1' },
  ],
})

export const productTypeOptionsState = atom<OptionsType[]>({
  key: 'productTypeOptionsState',
  default: [
    { id: '1', label: t('productTypeInputFieldLabel'), value: '1' },
    { id: '2', label: t('productTypeOutputFieldLabel'), value: '2' },
  ],
})

export const productUnitOptionsState = atom<OptionsType[]>({
  key: 'productUnitOptionsState',
  default: [
    { id: 'Tấn', label: t('productUnitTonFieldLabel'), value: 'Tấn' },
    { id: 'Khối', label: t('productUnitKhoiFieldLabel'), value: 'Khối' },
    { id: 'Kg', label: t('productUnitKgFieldLabel'), value: 'Kg' },
  ],
})

export const stationOptionsState = atom<OptionsType[]>({
  key: 'stationOptionsState',
  default: [],
})

export const productCategoryOptionsState = atom<OptionsType[]>({
  key: 'productCategoryOptionsState',
  default: [],
})

export const shippingUnitOptionsState = atom<OptionsType[]>({
  key: 'shippingUnitOptionsState',
  default: [],
})

export const customerTypeOptionsState = atom<OptionsType[]>({
  key: 'customerTypeOptionsState',
  default: [],
})

export const saleFormOptionsState = atom<OptionsType[]>({
  key: 'saleFormOptionsState',
  default: [],
})
