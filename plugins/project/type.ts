import { ContractorType } from '../contractor/type'
import { DistrictType } from '../district/type'
import { InvestorType } from '../investor/type'

export type ProjectDetailsType = {
  productId: number | string
  weight: number | string
}

type ConstructionProgressType = {
  id: number
  title: string
}

type ProvinceType = {
  id: number
  title: string
}

export type ProjectType = {
  id: number
  name: string
  code: string
  contractor: ContractorType
  district: DistrictType
  estimatedVolume: string
  investor: InvestorType
  package: string
  constructionProgress: ConstructionProgressType
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
  memo: string
  province: ProvinceType
  projectDetails: ProjectDetailsType[]
  projectContractorSubs: any
}
