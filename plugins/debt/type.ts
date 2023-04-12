import { ContractType } from '../contract/type'

export type DebtType = {
  id: number
  code: string
  memo: string
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
}
