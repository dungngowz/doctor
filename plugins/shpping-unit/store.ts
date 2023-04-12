import { atom } from 'recoil'
import { ShippingUnitType } from './type'

export const shippingUnitListState = atom<ShippingUnitType[]>({
  key: 'shippingUnitListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const shippingUnitActiveState = atom<ShippingUnitType | null>({
  key: 'shippingUnitActiveState',
  default: null,
})
