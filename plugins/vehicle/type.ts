export type VehicleType = {
  id: number
  name: string
  code: string
  qrcode: string
  phone: string | number
  staff: {
    id: number
    name: string
  }
  shippingUnit: {
    id: number
    name: string
  }
  weight: number
  weightFormatted: string
  createdAt: string
  updatedAt: string
}
