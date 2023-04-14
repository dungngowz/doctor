import { formatPrice } from '@/utils'

export const totalProductPrice = (discount: number, item: any) => {
  const totalPrice = item.reduce((total: any, item: any) => {
    return total + item?.qty * item?.price
  }, 0)

  const total = totalPrice - discount

  return formatPrice(Math.abs(total))
}
