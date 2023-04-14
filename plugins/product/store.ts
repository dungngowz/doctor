import { atom } from 'recoil'
import { ProductType } from './type'

export const productListState = atom<ProductType[]>({
  key: 'productListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const productActiveState = atom<ProductType | null>({
  key: 'productActiveState',
  default: null,
})
