import { ProductType } from '../product/type'
import { SupplierType } from '../supplier/type'
import { VehicleType } from '../vehicle/type'

export type ProductInputType = {
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
