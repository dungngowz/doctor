import { atom } from 'recoil'
import { DistrictType } from './type'

/* Creating a state with the key `districtListState` and the default value is `[]`. */
export const districtListState = atom<DistrictType[]>({
  key: 'districtListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const districtActiveState = atom<DistrictType | null>({
  key: 'districtActiveState',
  default: null,
})
