import { atom } from 'recoil'
import { SupplierType } from './type'

export const supplierListState = atom<SupplierType[]>({
  key: 'supplierListState',
  default: [],
})

export const supplierActiveState = atom<SupplierType | null>({
  key: 'supplierActiveState',
  default: null,
})
