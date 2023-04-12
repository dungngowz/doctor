import { ProductType } from '../product/type'
import { SupplierType } from '../supplier/type'

export type ReportInputType = {
  id: number
  firstTimeInput: string
  firstWeight: string | number
  firstWeightFormatted: string
  placeDelivery: string
  price: string | number
  priceFormatted: string
  product: ProductType
  productWeight: string | number
  productWeightFormatted: string | number
  secondaryTimeInput: string
  secondaryWeight: string | number
  secondaryWeightFormatted: string
  shippingUnit: string
  supplier: SupplierType
  vehicle: VehicleType
  createdAt: string
  updatedAt: string
}

type VehicleType = {
  id: number
  code: string
}
