import { atom } from 'recoil'
import { DebtType } from './type'

export const debtListState = atom<DebtType[]>({
  key: 'debtListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const debtActivedState = atom<DebtType | null>({
  key: 'debtActivedState',
  default: null,
})
