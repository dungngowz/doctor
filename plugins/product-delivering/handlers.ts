import { formatQty } from '@/utils'

export const totalRemainingMass = (secondaryWeight: number, firstWeight: number) => {
  return formatQty(Math.abs(+secondaryWeight - +firstWeight ?? 0))
}
