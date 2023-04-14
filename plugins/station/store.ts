import { atom } from 'recoil'
import { StationType } from './type'

export const stationListState = atom<StationType[]>({
  key: 'stationListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const stationActiveState = atom<StationType | null>({
  key: 'stationActiveState',
  default: null,
})
