import { DistrictType } from '../district/type'

type Investor = {
  id: number
  title: string
}

type StaffType = {
  id: number
  name: string
}

export type InvestorType = {
  id: number
  name: string
  address: string
  code: string
  district: DistrictType
  province: DistrictType
  emailContact: string
  memo: string
  investorType: Investor
  nameContact: string
  positionContact: string
  phoneContact: string
  staff: StaffType
  nameContactSub: string
  phoneContactSub: string
  emailContactSub: string
  positionContactSub: string
  createdAt: string
  updatedAt: string
}
