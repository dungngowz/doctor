import { atom } from 'recoil'
import { ReportInputType } from './type'

export const reportInputListState = atom<ReportInputType[]>({
  key: 'reportInputListState',
  default: [],
})

export const reportInputActiveState = atom<ReportInputType | null>({
  key: 'reportInputActiveState',
  default: null,
})
