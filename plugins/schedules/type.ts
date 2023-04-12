import { OrderType } from '../order/type'
import { SupplierType } from '../supplier/type'

export type ScheduleType = {
  id: number
  consigneeName: string
  createdAt: string
  exportedVolume: number
  exportedVolumeFormatted: number
  orderCode: string
  orderVolume: number
  orderVolumeFormatted: string
  placeDelivery: string
  disableEditDelete: boolean
  product: {
    id: number
    title: string
  }
  remainingMass: number
  remainingMassFormatted: string
  shippingUnit: string
  contractor: {
    id: string
    name: string
  }
  timeExport: string
  updatedAt: string
  order: OrderType
  supplier: SupplierType
  amount: number
  amountFormatted: string
}

export type DataTableSchedulesParamsType = {
  refetchData: number
  rowsPerPage: number
  page: number
  orderBy: string
  orderSort: string
  keyword: string
  isDeleted: boolean
  isCreated: boolean
  isEdited: boolean
  isFilter: boolean
}
