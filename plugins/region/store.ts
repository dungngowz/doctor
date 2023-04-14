import { atom } from 'recoil'
import { RegionListType } from './type'

export const regionListState = atom<RegionListType[]>({
  key: 'regionListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const regionActiveState = atom<RegionListType | null>({
  key: 'regionActiveState',
  default: null,
})
