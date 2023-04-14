import { atom } from 'recoil'
import { StaffType } from './type'

export const staffListState = atom<StaffType[]>({
  key: 'staffListState',
  default: [],
})

export const staffActiveState = atom<StaffType | null>({
  key: 'staffActiveState',
  default: null,
})
