import { atom } from 'recoil'
import { DashboardType } from './type'

export const dashboardState = atom<DashboardType | null>({
  key: 'dashboardState',
  default: null,
})

export const widgetsLoadingState = atom<boolean>({
  key: 'widgetsLoadingState',
  default: false,
})
