import { atom } from 'recoil'
import { ReportExportType } from './type'

export const reportExportListState = atom<ReportExportType[]>({
  key: 'reportExportListState',
  default: [],
})

export const reportExportActiveState = atom<ReportExportType | null>({
  key: 'reportExportActiveState',
  default: null,
})
