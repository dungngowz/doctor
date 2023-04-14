import { atom } from 'recoil'
import { BaseType } from './type'

export const baseListState = atom<BaseType[]>({
  key: 'baseListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const baseActiveState = atom<BaseType | null>({
  key: 'baseActiveState',
  default: null,
})
