import { atom } from 'recoil'
import { SaleFormType } from './type'

export const saleFormListState = atom<SaleFormType[]>({
  key: 'saleFormListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const saleFormActiveState = atom<SaleFormType | null>({
  key: 'saleFormActiveState',
  default: null,
})
