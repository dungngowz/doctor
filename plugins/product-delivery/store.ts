import { atom } from 'recoil'
import { ProductDeliveryType } from './type'

export const productDeliveryListState = atom<ProductDeliveryType[]>({
  key: 'productDeliveryListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const productDeliveryActiveState = atom<ProductDeliveryType | null>({
  key: 'productDeliveryActiveState',
  default: null,
})

export const productDeliveryOpenModalQuoteState = atom<boolean>({
  key: 'productDeliveryOpenModalQuoteState',
  default: false,
})

export const currentIndexSelectedState = atom<number>({
  key: 'currentIndexSelectedState',
  default: -1,
})
