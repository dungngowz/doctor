import { ContractType } from '../contract/type'

export type OrderType = {
  id: number
  code: string
  memo: string
  title: string
  memoAccountant: string | null
  consigneeName: string
  phoneContact: string
  statusAccountant: number
  staffAuthor: {
    id: number
    name: string
  }
  staffConfirm: {
    id: number
    name: string
  }
  contract: ContractType
  status: number
  canDelete: boolean
  createdAt: string
  updatedAt: string
  logs: any
  discount: number
  discountFormatted: string
  isFinish: boolean
  timeWorkStation: string
  station: {
    id: number | string
    title: string
  }
}
