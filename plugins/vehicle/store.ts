import { atom } from 'recoil'
import { VehicleType } from './type'

export const vehicleListState = atom<VehicleType[]>({
  key: 'vehicleListState',
  default: [],
})

export const vehicleActiveState = atom<VehicleType | null>({
  key: 'vehicleActiveState',
  default: null,
})

export const openQrcodeState = atom<boolean>({
  key: 'openQrcodeState',
  default: false,
})
