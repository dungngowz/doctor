type Investor = {
  id: number
  title: string
}

type StaffType = {
  id: number
  name: string
}

export type ContractorType = {
  id: number
  code: string | number
  name: string
  email: string
  address: string
  taxCode: string
  nameContact: string
  emailContact: string
  phoneContact: string
  positionContact: string
  staff: StaffType
  canDelete: boolean
  memo: string
  nameContactSub: string
  phoneContactSub: string
  emailContactSub: string
  positionContactSub: string
  customerType: {
    id: number
    title: string
  }
  createdAt: string
  updatedAt: string
}
