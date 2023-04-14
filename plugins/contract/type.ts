import { QuoteType } from '../quote/type'

type StaffAuthor = {
  id: number
  name: string
}

type StaffConfirm = {
  id: number
  name: string
}

type Logs = {
  name: string
  title: string
  created_at: string
}

export type ContractType = {
  id: number
  title: string
  code: string
  statusDirector: number
  memoDirector: string
  memo: string | null
  hasOrder: boolean
  quote: QuoteType
  staffAuthor: StaffAuthor
  staffConfirm: StaffConfirm
  status: number
  canDelete: boolean
  createdAt: string
  updatedAt: string
  logs: Logs[]
}
