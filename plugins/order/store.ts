import { atom } from 'recoil'
import { OrderType } from './type'

export const orderListState = atom<OrderType[]>({
  key: 'orderListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const orderActivedState = atom<OrderType | null>({
  key: 'orderActivedState',
  default: null,
})

export const openModalSubmitOrderState = atom<boolean>({
  key: 'openModalSubmitOrderState',
  default: false,
})
