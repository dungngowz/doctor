import { ProvinceType } from '../province/type'

export type DistrictType = {
  id: number
  title: string
  createdAt: string
  updatedAt: string
  province: ProvinceType
}
