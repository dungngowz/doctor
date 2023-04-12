import { ScheduleType } from '../schedules/type'

export type ReportExportType = {
  id: number
  consigneeName: string
  createdAt: string
  firstTimeExport: string
  firstWeight: number
  firstWeightFormatted: string
  placeDelivery: string
  productWeight: number
  productWeightFormatted: string
  schedule: ScheduleType
  secondaryTimeExport: string
  secondaryWeight: number
  secondaryWeightFormatted: string
  updatedAt: string
  vehicleNumber: number
  vehicle: VehicleType
  priceFormatted: string
  price: number
  unit: string
}

type VehicleType = {
  id: number
  code: string
}
