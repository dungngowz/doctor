import { atom } from 'recoil'
import { CustomerTypesType } from './type'

export const customerTypesListState = atom<CustomerTypesType[]>({
  key: 'customerTypesListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const customerTypesActiveState = atom<CustomerTypesType | null>({
  key: 'customerTypesActiveState',
  default: null,
})
